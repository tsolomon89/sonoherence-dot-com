import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import './site-pages.css';

export function RefundPolicy() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      description="Refund rules for Somaherence refundable reservation deposits."
      updatedOn="February 26, 2026"
      sections={[
        {
          heading: 'Reservation deposit terms',
          paragraphs: [
            'Somaherence reservations collect a refundable $100 deposit to indicate purchase intent and allocate launch queue priority.',
          ],
        },
        {
          heading: 'How to request a refund',
          paragraphs: [
            'Refund requests can be submitted from the support page using the same email used for reservation checkout.',
          ],
          bullets: [
            'Include reservation email and request reason',
            'Allow up to 10 business days for processing confirmation',
            'Refunds are returned to the original payment method when available',
          ],
        },
        {
          heading: 'Delivery estimates',
          paragraphs: [
            'Estimated delivery windows are planning targets, not guaranteed ship dates. Reservation deposits remain refundable prior to final purchase agreement acceptance.',
          ],
        },
        {
          heading: 'Policy updates',
          paragraphs: [
            'If this policy changes, we will update this page and reference the revision date. Existing reservations retain refund rights applicable at the time of payment unless otherwise required by law.',
          ],
        },
      ]}
    />
  );
}
