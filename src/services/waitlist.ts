import { env } from '../lib/env';
import { supabase } from '../lib/supabase';
import type {
  AuthMethod,
  ReservationCheckoutInput,
  ReservationCheckoutResponse,
  WaitlistRegistrationInput,
  WaitlistRegistrationResponse,
} from '../types/funnel';

const DEMO_CHECKOUT_URL = '/reserve/success?demo=1';

export async function beginOAuth(
  method: Extract<AuthMethod, 'google' | 'apple'>,
): Promise<string | null> {
  if (!supabase) {
    return null;
  }

  const provider = method === 'google' ? 'google' : 'apple';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: env.appUrl,
      skipBrowserRedirect: true,
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    throw error;
  }

  return data.url ?? null;
}

export async function beginEmailMagicLink(email: string): Promise<void> {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: env.appUrl,
    },
  });

  if (error) {
    throw error;
  }
}

export async function registerWaitlist(
  input: WaitlistRegistrationInput,
): Promise<WaitlistRegistrationResponse> {
  if (!supabase) {
    return {
      registrationId: `demo-${Date.now()}`,
    };
  }

  const { data, error } = await supabase.functions.invoke<WaitlistRegistrationResponse>(
    'waitlist-register',
    {
      body: input,
    },
  );

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to register waitlist request.');
  }

  return data;
}

export async function createReservationCheckout(
  input: ReservationCheckoutInput,
): Promise<ReservationCheckoutResponse> {
  if (!supabase) {
    return { checkoutUrl: DEMO_CHECKOUT_URL };
  }

  const { data, error } = await supabase.functions.invoke<ReservationCheckoutResponse>(
    'create-reservation-checkout',
    {
      body: input,
    },
  );

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create reservation checkout.');
  }

  return data;
}
