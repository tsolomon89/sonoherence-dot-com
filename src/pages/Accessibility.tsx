import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import './site-pages.css';

export function Accessibility() {
  return (
    <LegalPageLayout
      title="Accessibility Statement"
      description="Somaherence accessibility commitments for website and launch communication."
      updatedOn="February 26, 2026"
      sections={[
        {
          heading: 'Commitment',
          paragraphs: [
            'Somaherence is committed to providing a website and launch process that is usable by people with diverse abilities and assistive technologies.',
          ],
        },
        {
          heading: 'Current measures',
          paragraphs: [
            'We use semantic structure, keyboard-accessible controls, reduced-motion support, and readable contrast targets across key conversion flows.',
          ],
        },
        {
          heading: 'Known limitations',
          paragraphs: [
            'Some rich media content, including 3D sequences, may have limited support on older devices. Fallback media and reduced-motion alternatives are provided.',
          ],
        },
        {
          heading: 'Feedback and support',
          paragraphs: [
            'If you encounter an accessibility barrier, contact support with steps to reproduce. We prioritize fixes for launch-blocking user journeys.',
          ],
        },
      ]}
    />
  );
}
