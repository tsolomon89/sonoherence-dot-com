export type Interest = 'home' | 'studio' | 'practitioner';

export type Intent = 'preorder_deposit' | 'kickstarter_notify' | 'partner_info';

export type AuthMethod = 'google' | 'apple' | 'email_magic_link';

export type SourceCta =
  | 'nav'
  | 'hero'
  | 'chapter_cta'
  | 'campaign'
  | 'final_cta';

export type SupportCategory = 'sales' | 'partnership' | 'press' | 'support';

export interface WaitlistRegistrationInput {
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

export interface WaitlistRegistrationResponse {
  registrationId: string;
}

export interface ReservationCheckoutInput {
  registrationId: string;
  amountUsd: 100;
}

export interface ReservationCheckoutResponse {
  checkoutUrl: string;
}

export interface SupportSubmissionInput {
  category: SupportCategory;
  name: string;
  email: string;
  message: string;
}

export interface SupportSubmissionResponse {
  inquiryId: string;
}
