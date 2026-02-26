import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { supabaseAdmin } from '../_shared/supabase-admin.ts';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

async function verifyStripeSignature(
  payload: string,
  signatureHeader: string | null,
  webhookSecret: string | null,
): Promise<boolean> {
  if (!signatureHeader || !webhookSecret) {
    return false;
  }

  const items = signatureHeader.split(',').map((item) => item.trim());
  const timestamp = items.find((item) => item.startsWith('t='))?.slice(2);
  const signature = items.find((item) => item.startsWith('v1='))?.slice(3);

  if (!timestamp || !signature) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const digest = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(signedPayload),
  );
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return timingSafeEqual(hash, signature);
}

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const payload = await request.text();
  const signatureHeader = request.headers.get('stripe-signature');

  if (webhookSecret) {
    const verified = await verifyStripeSignature(payload, signatureHeader, webhookSecret);
    if (!verified) {
      return jsonResponse({ error: 'Invalid webhook signature' }, 401);
    }
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(payload);
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload' }, 400);
  }

  const eventType = String(event.type ?? '');
  const dataObject = (event.data as { object?: Record<string, unknown> } | undefined)?.object;

  if (!dataObject) {
    return jsonResponse({ received: true });
  }

  if (eventType === 'checkout.session.completed') {
    const sessionId = String(dataObject.id ?? '');
    const paymentIntent =
      typeof dataObject.payment_intent === 'string' ? dataObject.payment_intent : null;

    if (sessionId) {
      await supabaseAdmin
        .from('reservations')
        .update({
          status: 'completed',
          stripe_payment_intent_id: paymentIntent,
        })
        .eq('stripe_checkout_session_id', sessionId);
    }
  }

  if (eventType === 'checkout.session.expired' || eventType === 'checkout.session.async_payment_failed') {
    const sessionId = String(dataObject.id ?? '');
    if (sessionId) {
      await supabaseAdmin
        .from('reservations')
        .update({
          status: 'failed',
        })
        .eq('stripe_checkout_session_id', sessionId);
    }
  }

  if (eventType === 'charge.refunded') {
    const paymentIntent =
      typeof dataObject.payment_intent === 'string' ? dataObject.payment_intent : null;

    if (paymentIntent) {
      await supabaseAdmin
        .from('reservations')
        .update({
          status: 'refunded',
          refund_status: 'processed',
        })
        .eq('stripe_payment_intent_id', paymentIntent);
    }
  }

  return jsonResponse({ received: true }, 200);
});
