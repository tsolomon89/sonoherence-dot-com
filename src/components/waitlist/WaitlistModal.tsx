import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { captureUtmFromLocation } from '../../lib/utm';
import { detectDeviceTier } from '../../lib/device';
import { env } from '../../lib/env';
import { trackEvent } from '../../lib/analytics';
import {
  beginEmailMagicLink,
  beginOAuth,
  registerWaitlist,
} from '../../services/waitlist';
import { intentLabels } from '../../content/site-copy';
import type { AuthMethod, Intent, Interest, SourceCta } from '../../types/funnel';
import './waitlist.css';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceCta: SourceCta;
}

type Step = 'method' | 'profile' | 'intent' | 'success';

interface WaitlistFormState {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  interest: Interest;
  intent: Intent;
  marketingConsent: boolean;
  authMethod: AuthMethod;
}

const INITIAL_FORM_STATE: WaitlistFormState = {
  fullName: '',
  email: '',
  country: '',
  phone: '',
  interest: 'home',
  intent: 'preorder_deposit',
  marketingConsent: false,
  authMethod: 'google',
};

const GOOGLE_CALENDAR_URL =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Somaherence+Launch+Window&details=Watch+for+Somaherence+launch+updates+and+reservation+timeline.&dates=20260401T170000Z/20260401T173000Z';

export function WaitlistModal({ isOpen, onClose, sourceCta }: WaitlistModalProps) {
  const [step, setStep] = useState<Step>('method');
  const [formData, setFormData] = useState<WaitlistFormState>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const deviceTier = useMemo(() => detectDeviceTier(), []);

  useEffect(() => {
    if (!isOpen) {
      setStep('method');
      setFormData(INITIAL_FORM_STATE);
      setIsSubmitting(false);
      setErrorMessage(null);
      setMagicLinkSent(false);
      setOauthUrl(null);
    }
  }, [isOpen]);

  const updateFormField = <K extends keyof WaitlistFormState>(key: K, value: WaitlistFormState[K]) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleMethodSelection = (method: AuthMethod) => {
    updateFormField('authMethod', method);
    setErrorMessage(null);
    setStep('profile');

    trackEvent('auth_method_selected', {
      auth_method: method,
      source_cta: sourceCta,
      device_tier: deviceTier,
    });

    trackEvent('waitlist_step_completed', {
      step: 'method',
      auth_method: method,
      source_cta: sourceCta,
      device_tier: deviceTier,
    });
  };

  const handleProfileNext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setStep('intent');

    trackEvent('waitlist_step_completed', {
      step: 'profile',
      source_cta: sourceCta,
      device_tier: deviceTier,
    });
  };

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setMagicLinkSent(false);
    setOauthUrl(null);

    try {
      const utm = captureUtmFromLocation();
      await registerWaitlist({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        country: formData.country.trim(),
        phone: formData.phone.trim() || undefined,
        interest: formData.interest,
        intent: formData.intent,
        marketingConsent: formData.marketingConsent,
        authMethod: formData.authMethod,
        sourceCta,
        utm,
      });

      if (formData.authMethod === 'email_magic_link') {
        await beginEmailMagicLink(formData.email.trim());
        setMagicLinkSent(true);
      }

      if (formData.authMethod === 'google' || formData.authMethod === 'apple') {
        const url = await beginOAuth(formData.authMethod);
        setOauthUrl(url);
      }

      trackEvent('waitlist_step_completed', {
        step: 'intent',
        intent: formData.intent,
        interest: formData.interest,
        source_cta: sourceCta,
        device_tier: deviceTier,
      });

      trackEvent('waitlist_registration_completed', {
        intent: formData.intent,
        interest: formData.interest,
        auth_method: formData.authMethod,
        source_cta: sourceCta,
        device_tier: deviceTier,
      });

      setStep('success');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to complete registration right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKickstarterClick = () => {
    trackEvent('kickstarter_notify_clicked', {
      source_cta: sourceCta,
      intent: formData.intent,
      interest: formData.interest,
      device_tier: deviceTier,
    });
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
    } catch {
      // Ignore clipboard errors; manual copy is still possible.
    }
  };

  const title =
    step === 'method'
      ? 'Join waitlist'
      : step === 'profile'
        ? 'Create your profile'
        : step === 'intent'
          ? 'Choose launch intent'
          : 'You are in';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="waitlist-container">
        {step === 'method' && (
          <div className="waitlist-step waitlist-stage">
            <p className="waitlist-subtitle">
              Choose how you want to sign in. You can still complete your registration details in the next
              step.
            </p>
            <div className="auth-methods">
              <Button variant="secondary" fullWidth onClick={() => handleMethodSelection('google')}>
                Continue with Google
              </Button>
              <Button variant="secondary" fullWidth onClick={() => handleMethodSelection('apple')}>
                Continue with Apple
              </Button>
              <Button variant="outline" fullWidth onClick={() => handleMethodSelection('email_magic_link')}>
                Continue with Email Magic Link
              </Button>
            </div>
          </div>
        )}

        {step === 'profile' && (
          <form className="waitlist-form waitlist-stage" onSubmit={handleProfileNext}>
            <p className="waitlist-subtitle">Tell us where and how you plan to use Somaherence.</p>

            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(event) => updateFormField('fullName', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateFormField('email', event.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={(event) => updateFormField('country', event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone (optional)</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateFormField('phone', event.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="interest">Primary interest</label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={(event) => updateFormField('interest', event.target.value as Interest)}
              >
                <option value="home">Home</option>
                <option value="studio">Studio</option>
                <option value="practitioner">Practitioner</option>
              </select>
            </div>

            <label className="consent-label">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(event) => updateFormField('marketingConsent', event.target.checked)}
                required
              />
              <span>
                I consent to launch updates and accept the <a href="/privacy">Privacy Policy</a>.
              </span>
            </label>

            <div className="form-actions">
              <Button variant="ghost" type="button" onClick={() => setStep('method')}>
                Back
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        )}

        {step === 'intent' && (
          <form className="waitlist-form waitlist-stage" onSubmit={submitRegistration}>
            <p className="waitlist-subtitle">Choose your launch intent. You can change this later.</p>
            <div className="intent-options">
              {(Object.keys(intentLabels) as Intent[]).map((intent) => (
                <label className="intent-radio" key={intent}>
                  <input
                    type="radio"
                    name="intent"
                    value={intent}
                    checked={formData.intent === intent}
                    onChange={() => updateFormField('intent', intent)}
                  />
                  <span>{intentLabels[intent]}</span>
                </label>
              ))}
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <div className="form-actions">
              <Button variant="ghost" type="button" onClick={() => setStep('profile')}>
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Complete registration'}
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="waitlist-success waitlist-stage">
            <h3 className="success-heading">Registration complete</h3>
            <p className="success-message">
              You are on the Somaherence launch list. We will send timeline and access updates to
              <strong> {formData.email}</strong>.
            </p>

            {magicLinkSent && (
              <p className="success-note">
                A magic link was sent to your email to finish sign-in.
              </p>
            )}

            {oauthUrl && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => window.location.assign(oauthUrl)}
                className="success-action"
              >
                Complete {formData.authMethod === 'google' ? 'Google' : 'Apple'} sign-in
              </Button>
            )}



            <Button
              variant="outline"
              fullWidth
              as="a"
              href={env.fallbackKickstarterUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleKickstarterClick}
              className="success-action"
            >
              Support on Kickstarter
            </Button>

            <div className="success-meta-actions">
              <Button variant="ghost" onClick={copyShareLink}>
                Copy share link
              </Button>
              <Button variant="ghost" as="a" href={GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer">
                Add launch reminder
              </Button>
            </div>

            {errorMessage && <p className="form-error">{errorMessage}</p>}

            <Button variant="secondary" onClick={onClose}>
              Return to site
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
