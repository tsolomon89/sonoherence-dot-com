import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import './site-pages.css';

export function Privacy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Somaherence collects, uses, and protects registration, reservation, and support data."
      updatedOn="February 26, 2026"
      sections={[
        {
          heading: 'Information we collect',
          paragraphs: [
            'We collect contact, profile, and preference data when you join the waitlist, submit support requests, or reserve with a refundable deposit.',
          ],
          bullets: [
            'Name, email, country, optional phone',
            'Launch intent and interest segment',
            'Reservation and payment status metadata',
            'Device and campaign attribution metadata (for example UTM parameters)',
          ],
        },
        {
          heading: 'How we use data',
          paragraphs: [
            'We use your information to deliver launch communications, process reservations, provide support, and improve product readiness. We do not sell personal data.',
          ],
          bullets: [
            'Send waitlist and campaign updates',
            'Coordinate reservation and refund workflows',
            'Route inquiries by support category',
            'Measure conversion funnel performance',
          ],
        },
        {
          heading: 'Data sharing',
          paragraphs: [
            'We use service providers for infrastructure, email campaigns, analytics, and payment processing. Providers only receive data required to perform contracted services.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You can request access, correction, export, or deletion of personal data by contacting support. You can unsubscribe from marketing updates at any time.',
          ],
        },
        {
          heading: 'Retention and security',
          paragraphs: [
            'We retain records for operational, legal, and accounting purposes and use technical controls designed to protect account and transaction data.',
          ],
        },
      ]}
    />
  );
}
