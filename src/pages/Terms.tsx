import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import './site-pages.css';

export function Terms() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      description="Terms governing use of the Somaherence website, waitlist, and reservation workflows."
      updatedOn="February 26, 2026"
      sections={[
        {
          heading: 'Scope',
          paragraphs: [
            'These terms govern your use of the Somaherence website, waitlist registration, support channels, and reservation checkout workflow.',
          ],
        },
        {
          heading: 'Eligibility and account information',
          paragraphs: [
            'You agree to provide accurate registration details and to maintain access to the email address used for launch and transaction notices.',
          ],
        },
        {
          heading: 'Reservation deposits',
          paragraphs: [
            'Reservation deposits are refundable under the refund policy. A reservation is not a guaranteed shipping date and does not constitute medical advice or treatment.',
          ],
        },
        {
          heading: 'Acceptable use',
          paragraphs: [
            'You may not misuse the site, attempt unauthorized access, interfere with service integrity, or submit unlawful content through forms.',
          ],
        },
        {
          heading: 'Disclaimers and limitation',
          paragraphs: [
            'Somaherence is offered as an experiential resonance product. It is not intended to diagnose, treat, or cure medical conditions. To the extent allowed by law, we disclaim implied warranties and limit liability for indirect damages.',
          ],
        },
        {
          heading: 'Changes to terms',
          paragraphs: [
            'We may update these terms as launch operations evolve. Material updates will be posted on this page with a new revision date.',
          ],
        },
      ]}
    />
  );
}
