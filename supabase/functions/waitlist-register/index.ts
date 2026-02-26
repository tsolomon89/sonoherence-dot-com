import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import md5 from 'npm:blueimp-md5@2.19.0';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';

type Interest = 'home' | 'studio' | 'practitioner';
type Intent = 'preorder_deposit' | 'kickstarter_notify' | 'partner_info';
type AuthMethod = 'google' | 'apple' | 'email_magic_link';
type SourceCta = 'nav' | 'hero' | 'chapter_cta' | 'campaign' | 'final_cta';

interface WaitlistRegistrationInput {
  fullName: string;
  email: string;
  country: string;
  phone?: string;
  interest: Interest;
  intent: Intent;
  marketingConsent: boolean;
  authMethod: AuthMethod;
  utm: Record<string, string | undefined>;
  sourceCta: SourceCta;
}

function isValidPayload(payload: unknown): payload is WaitlistRegistrationInput {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const data = payload as Partial<WaitlistRegistrationInput>;
  const validInterest = ['home', 'studio', 'practitioner'].includes(String(data.interest));
  const validIntent = ['preorder_deposit', 'kickstarter_notify', 'partner_info'].includes(
    String(data.intent),
  );
  const validAuthMethod = ['google', 'apple', 'email_magic_link'].includes(String(data.authMethod));
  const validSource = ['nav', 'hero', 'chapter_cta', 'campaign', 'final_cta'].includes(
    String(data.sourceCta),
  );

  return (
    typeof data.fullName === 'string' &&
    data.fullName.trim().length > 1 &&
    typeof data.email === 'string' &&
    data.email.includes('@') &&
    typeof data.country === 'string' &&
    data.country.trim().length > 1 &&
    typeof data.marketingConsent === 'boolean' &&
    validInterest &&
    validIntent &&
    validAuthMethod &&
    validSource &&
    typeof data.utm === 'object' &&
    data.utm !== null
  );
}

async function syncMailchimp(payload: WaitlistRegistrationInput): Promise<'synced' | 'failed' | 'pending'> {
  const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
  const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');
  const serverPrefix = Deno.env.get('MAILCHIMP_SERVER_PREFIX');

  if (!apiKey || !audienceId || !serverPrefix) {
    return 'pending';
  }

  const email = payload.email.toLowerCase().trim();
  const memberId = md5(email);
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}`;

  const interestTag = `interest_${payload.interest}`;
  const intentTag = `intent_${payload.intent}`;
  const sourceTagMap: Record<SourceCta, string> = {
    nav: 'source_nav',
    hero: 'source_hero',
    chapter_cta: 'source_chapter',
    campaign: 'source_campaign',
    final_cta: 'source_final',
  };
  const sourceTag = sourceTagMap[payload.sourceCta];

  const memberResponse = await fetch(`${baseUrl}/members/${memberId}`, {
    method: 'PUT',
    headers: {
      Authorization: `apikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: 'subscribed',
      status: payload.marketingConsent ? 'subscribed' : 'transactional',
      merge_fields: {
        FNAME: payload.fullName,
        COUNTRY: payload.country,
        PHONE: payload.phone ?? '',
      },
    }),
  });

  if (!memberResponse.ok) {
    return 'failed';
  }

  const tagsResponse = await fetch(`${baseUrl}/members/${memberId}/tags`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tags: [
        { name: intentTag, status: 'active' },
        { name: interestTag, status: 'active' },
        { name: sourceTag, status: 'active' },
      ],
    }),
  });

  return tagsResponse.ok ? 'synced' : 'failed';
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload = await request.json();
    if (!isValidPayload(payload)) {
      return jsonResponse({ error: 'Invalid payload' }, 400);
    }

    const email = payload.email.trim().toLowerCase();

    let authUserId: string | null = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const jwt = authHeader.replace('Bearer ', '');
      const { data: userData } = await supabaseAdmin.auth.getUser(jwt);
      authUserId = userData.user?.id ?? null;
    }

    const { data: profileRows, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          auth_user_id: authUserId,
          full_name: payload.fullName.trim(),
          email,
          country: payload.country.trim(),
          phone: payload.phone?.trim() || null,
        },
        {
          onConflict: 'email',
        },
      )
      .select('id')
      .limit(1);

    if (profileError || !profileRows?.length) {
      return jsonResponse(
        {
          error: profileError?.message ?? 'Unable to create profile.',
        },
        500,
      );
    }

    const profileId = profileRows[0].id;

    const { data: waitlistRows, error: waitlistError } = await supabaseAdmin
      .from('waitlist_registrations')
      .insert({
        profile_id: profileId,
        interest: payload.interest,
        intent: payload.intent,
        marketing_consent: payload.marketingConsent,
        auth_method: payload.authMethod,
        source_cta: payload.sourceCta,
        utm_json: payload.utm,
      })
      .select('id')
      .limit(1);

    if (waitlistError || !waitlistRows?.length) {
      return jsonResponse(
        {
          error: waitlistError?.message ?? 'Unable to create waitlist record.',
        },
        500,
      );
    }

    const registrationId = waitlistRows[0].id;
    const mailchimpStatus = await syncMailchimp(payload);

    await supabaseAdmin
      .from('waitlist_registrations')
      .update({ mailchimp_sync_status: mailchimpStatus })
      .eq('id', registrationId);

    return jsonResponse({ registrationId }, 200);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unexpected server error.' },
      500,
    );
  }
});
