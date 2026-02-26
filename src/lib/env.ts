const trimOrEmpty = (value: string | undefined): string => value?.trim() ?? '';

export const env = {
  appUrl: trimOrEmpty(import.meta.env.VITE_APP_URL) || window.location.origin,
  gtmId: trimOrEmpty(import.meta.env.VITE_GTM_ID),
  supabaseUrl: trimOrEmpty(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: trimOrEmpty(import.meta.env.VITE_SUPABASE_ANON_KEY),
  stripeDepositAmount: 100 as const,
  fallbackKickstarterUrl:
    trimOrEmpty(import.meta.env.VITE_KICKSTARTER_NOTIFY_URL) ||
    'https://www.kickstarter.com',
};

export const isSupabaseConfigured =
  Boolean(env.supabaseUrl) && Boolean(env.supabaseAnonKey);
