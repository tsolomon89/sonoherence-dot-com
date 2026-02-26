import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';

interface ReservationCheckoutInput {
  registrationId: string;
  amountUsd: 100;
}

function isValidPayload(payload: unknown): payload is ReservationCheckoutInput {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const data = payload as Partial<ReservationCheckoutInput>;
  return (
    typeof data.registrationId === 'string' &&
    data.registrationId.length > 0 &&
    data.amountUsd === 100
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

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      return jsonResponse({ error: 'Stripe key is not configured.' }, 500);
    }

    const { data: registration } = await supabaseAdmin
      .from('waitlist_registrations')
      .select('id')
      .eq('id', payload.registrationId)
      .maybeSingle();

    if (!registration) {
      return jsonResponse({ error: 'Registration not found.' }, 404);
    }

    const siteUrl =
      Deno.env.get('PUBLIC_SITE_URL') ??
      request.headers.get('origin') ??
      'http://localhost:5173';

    const form = new URLSearchParams();
    form.append('mode', 'payment');
    form.append('payment_method_types[0]', 'card');
    form.append('success_url', `${siteUrl}/reserve/success?session_id={CHECKOUT_SESSION_ID}`);
    form.append('cancel_url', `${siteUrl}/reserve/cancel`);
    form.append('line_items[0][quantity]', '1');
    form.append('line_items[0][price_data][currency]', 'usd');
    form.append('line_items[0][price_data][unit_amount]', String(payload.amountUsd * 100));
    form.append(
      'line_items[0][price_data][product_data][name]',
      'Somaherence Founders Reservation Deposit',
    );
    form.append(
      'line_items[0][price_data][product_data][description]',
      'Refundable reservation deposit for early access queue placement',
    );
    form.append('metadata[registration_id]', payload.registrationId);
    form.append('payment_intent_data[metadata][registration_id]', payload.registrationId);

    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text();
      return jsonResponse({ error: `Stripe checkout failed: ${error}` }, 500);
    }

    const session = await stripeResponse.json();

    const { error: reservationError } = await supabaseAdmin.from('reservations').insert({
      registration_id: payload.registrationId,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === 'string' ? session.payment_intent : null,
      amount_usd: payload.amountUsd,
      status: 'pending',
      refund_status: 'none',
    });

    if (reservationError) {
      return jsonResponse({ error: reservationError.message }, 500);
    }

    return jsonResponse(
      {
        checkoutUrl: session.url,
      },
      200,
    );
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Unexpected server error.' },
      500,
    );
  }
});
