import type { Intent } from '../types/funnel';

export const chapterNarrative = [
  {
    title: '0. Whole Instrument',
    body: 'Somaherence begins as a complete resting instrument: a sealed water chamber, tuned transducers, and quiet control electronics.',
  },
  {
    title: '1. Water Chamber',
    body: 'The internal chamber holds the transmission medium. Water carries low-frequency mechanical energy efficiently across a broad contact surface.',
  },
  {
    title: '2. Transducer Array',
    body: 'An array of exciters couples structured waveforms into the chamber so sound becomes a tactile, distributed experience.',
  },
  {
    title: '3. Somaherence Engine',
    body: 'Signal routing and tuning profiles shape each session mode while maintaining safety limits for amplitude and exposure time.',
  },
  {
    title: '4. Program Modes',
    body: 'Mode profiles adjust envelope, sweep, and cadence for Drift, Recover, Focus, and Soundbath listening contexts.',
  },
  {
    title: '5. Reassembly',
    body: 'The system closes back into a single form: engineered hardware, intentional software, and a practical ritual for rest.',
  },
] as const;

export const featureCards = [
  {
    title: 'Somaherence Engine',
    body: 'Dedicated signal architecture controls mode envelopes, frequency windows, and safe operating ceilings.',
  },
  {
    title: 'Hydroacoustic Coupling',
    body: 'A sealed water medium transfers structured vibration through the body-contact surface with minimal airborne spill.',
  },
  {
    title: 'Resonant Tuning',
    body: 'Session profiles are tuned for experiential targets like downshifting, compositional immersion, and meditative pacing.',
  },
  {
    title: 'Program Library',
    body: 'Drift, Recover, Focus, and Soundbath provide curated presets for different contexts and session lengths.',
  },
  {
    title: 'Safety Envelope',
    body: 'Output and timing constraints are controlled in software to keep operation within predefined acoustic and thermal limits.',
  },
] as const;

export const solutionModes = [
  {
    label: 'Drift',
    body: 'Long-wave pacing designed for settling and evening wind-down.',
  },
  {
    label: 'Recover',
    body: 'Targeted low-end profiles focused on post-training and physical reset routines.',
  },
  {
    label: 'Focus',
    body: 'Rhythmic program structures for studio prep and attention-centered sessions.',
  },
  {
    label: 'Soundbath',
    body: 'Expanded dynamic profiles for immersive composition and deep listening events.',
  },
] as const;

export const faqs = [
  {
    question: 'Is Somaherence a medical device?',
    answer:
      'No. Somaherence is an experiential resonance product for rest, listening, and personal practice. It is not intended to diagnose, treat, or cure medical conditions.',
  },
  {
    question: 'How loud is it to others in the room?',
    answer:
      'Most energy is coupled into the chamber, so airborne sound is lower than a typical speaker setup at similar perceived intensity.',
  },
  {
    question: 'Who is it designed for?',
    answer:
      'Home users, studios, and practitioners who want a full-body, non-mystical resonance experience.',
  },
  {
    question: 'Can I reserve before launch?',
    answer:
      'Yes. You can place a refundable $100 reservation deposit to secure founders queue priority.',
  },
  {
    question: 'What if I only want launch updates?',
    answer:
      'Choose the Kickstarter notify intent in the waitlist flow and we will only send launch and campaign milestones.',
  },
  {
    question: 'What maintenance is required?',
    answer:
      'Maintenance guidance includes inspection intervals, water handling instructions, and cleaning materials approved for the bed surface.',
  },
] as const;

export const intentLabels: Record<Intent, string> = {
  preorder_deposit: 'I would reserve with a refundable deposit',
  kickstarter_notify: 'Notify me for Kickstarter launch',
  partner_info: 'I want partner information',
};
