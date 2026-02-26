import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';

type SupportCategory = 'sales' | 'partnership' | 'press' | 'support';

interface SupportSubmissionInput {
  category: SupportCategory;
  name: string;
  email: string;
  message: string;
}

function isValidPayload(payload: unknown): payload is SupportSubmissionInput {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const data = payload as Partial<SupportSubmissionInput>;
  return (
    ['sales', 'partnership', 'press', 'support'].includes(String(data.category)) &&
    typeof data.name === 'string' &&
    data.name.trim().length > 1 &&
    typeof data.email === 'string' &&
    data.email.includes('@') &&
    typeof data.message === 'string' &&
    data.message.trim().length > 3
  );
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

    const { data, error } = await supabaseAdmin
      .from('support_inquiries')
      .insert({
        category: payload.category,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        message: payload.message.trim(),
        status: 'new',
      })
      .select('id')
      .limit(1);

    if (error || !data?.length) {
      return jsonResponse({ error: error?.message ?? 'Unable to submit inquiry.' }, 500);
    }

    return jsonResponse({ inquiryId: data[0].id }, 200);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unexpected server error.' },
      500,
    );
  }
});
