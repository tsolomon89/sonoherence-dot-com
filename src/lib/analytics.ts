import { env } from './env';

export type AnalyticsEventName =
  | 'waitlist_modal_open'
  | 'auth_method_selected'
  | 'waitlist_step_completed'
  | 'waitlist_registration_completed'
  | 'reserve_checkout_started'
  | 'reserve_checkout_completed'
  | 'kickstarter_notify_clicked'
  | 'support_form_submitted'
  | 'page_view';

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

let gtmInitialized = false;

export function initGtm(): void {
  if (gtmInitialized || !env.gtmId) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${env.gtmId}`;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

  document.head.appendChild(script);
  gtmInitialized = true;
}

export function trackEvent(event: AnalyticsEventName, params: AnalyticsParams = {}): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...params,
  });
}
