import { useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { submitSupportInquiry } from '../services/support';
import { trackEvent } from '../lib/analytics';
import type { SupportCategory } from '../types/funnel';
import './site-pages.css';

interface SupportFormState {
  category: SupportCategory;
  name: string;
  email: string;
  message: string;
}

const INITIAL_STATE: SupportFormState = {
  category: 'sales',
  name: '',
  email: '',
  message: '',
};

const supportFaq = [
  {
    question: 'How long does support response take?',
    answer: 'Most inquiries receive a response within 2 business days.',
  },
  {
    question: 'Can I update reservation intent after registering?',
    answer: 'Yes. Contact support from the same registration email and we will update your segment.',
  },
  {
    question: 'Will setup require special room modifications?',
    answer: 'No permanent modifications are expected for standard home or studio placement.',
  },
];

export function Support() {
  const [formState, setFormState] = useState<SupportFormState>(INITIAL_STATE);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const updateField = <K extends keyof SupportFormState>(key: K, value: SupportFormState[K]) => {
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setStatusMessage(null);

    try {
      await submitSupportInquiry({
        category: formState.category,
        name: formState.name.trim(),
        email: formState.email.trim(),
        message: formState.message.trim(),
      });

      trackEvent('support_form_submitted', {
        category: formState.category,
      });

      setStatus('success');
      setStatusMessage('Message submitted. The team will reply by email.');
      setFormState(INITIAL_STATE);
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit at the moment. Please try again shortly.',
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>Support and Contact | Somaherence</title>
        <meta
          name="description"
          content="Contact Somaherence for preorder, partnership, press, or support requests. Includes safety and usage notes."
        />
      </Helmet>

      <main className="page-main">
        <div className="container">
          <header className="page-header">
            <p className="eyebrow">Support</p>
            <h1>Contact and support</h1>
            <p>
              Use the form for sales, partnership, press, and general support requests. Include relevant
              details so we can route your message quickly.
            </p>
          </header>

          <section className="page-grid two">
            <GlassPanel padding="lg">
              <h2>Send a message</h2>
              <form className="support-form" onSubmit={handleSubmit}>
                <div className="page-form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={formState.category}
                    onChange={(event) => updateField('category', event.target.value as SupportCategory)}
                  >
                    <option value="sales">Sales and reservations</option>
                    <option value="partnership">Partnership</option>
                    <option value="press">Press and media</option>
                    <option value="support">General support</option>
                  </select>
                </div>
                <div className="page-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </div>
                <div className="page-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(event) => updateField('email', event.target.value)}
                  />
                </div>
                <div className="page-form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(event) => updateField('message', event.target.value)}
                  />
                </div>

                {statusMessage && (
                  <p className={status === 'error' ? 'form-error' : 'status-banner'}>{statusMessage}</p>
                )}

                <Button type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Submit'}
                </Button>
              </form>
            </GlassPanel>

            <div className="page-grid">
              <GlassPanel padding="lg">
                <h2>Support FAQ</h2>
                <div className="faq-list">
                  {supportFaq.map((item) => (
                    <details key={item.question} className="faq-item">
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel padding="lg">
                <h2>Safety and usage notes</h2>
                <ul>
                  <li>Follow session duration guidance for each program mode.</li>
                  <li>Do not operate with damaged surfaces, leaks, or unstable power input.</li>
                  <li>Keep children and pets supervised near powered equipment.</li>
                  <li>Consult your clinician before use if you have device implants or specific concerns.</li>
                </ul>
              </GlassPanel>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
