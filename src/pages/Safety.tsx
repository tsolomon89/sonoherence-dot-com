import { LegalPageLayout } from '../components/legal/LegalPageLayout';
import './site-pages.css';

export function Safety() {
  return (
    <LegalPageLayout
      title="Safety Notes"
      description="Plain-language safety and usage guidance for Somaherence sessions."
      updatedOn="February 26, 2026"
      sections={[
        {
          heading: 'Intended use',
          paragraphs: [
            'Somaherence is intended for experiential resonance sessions in home, studio, and practitioner settings. It is not a medical treatment device.',
          ],
        },
        {
          heading: 'Session guidance',
          paragraphs: [
            'Follow session duration recommendations for each mode and keep hardware within specified operating conditions.',
          ],
          bullets: [
            'Start with shorter sessions while learning personal comfort levels',
            'Do not exceed published power and timing constraints',
            'Stop use if discomfort occurs',
          ],
        },
        {
          heading: 'Operational precautions',
          paragraphs: [
            'Do not use damaged equipment or compromised cabling. Keep power and ventilation conditions within setup guidance.',
          ],
        },
        {
          heading: 'Who should seek medical guidance first',
          paragraphs: [
            'If you are pregnant, have implanted electronic devices, or have health concerns related to vibration exposure, consult a qualified clinician before use.',
          ],
        },
      ]}
    />
  );
}
