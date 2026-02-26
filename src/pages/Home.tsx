import { type CSSProperties } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useWaitlist } from '../context/use-waitlist';
import { trackEvent } from '../lib/analytics';
import { env } from '../lib/env';
import { faqs, featureCards, solutionModes } from '../content/site-copy';
import { useSectionReveal } from '../hooks/useSectionReveal';
import { Moon, Sparkles, User, Sun } from 'lucide-react';
import './home.css';

type RevealStyle = CSSProperties & { '--reveal-index': number };

const revealStyle = (index: number): RevealStyle => ({
  '--reveal-index': index,
});

export function Home() {
  const { openWaitlist } = useWaitlist();
  const registerReveal = useSectionReveal();

  const handleKickstarterClick = (source: string) => {
    trackEvent('kickstarter_notify_clicked', {
      source_cta: source,
    });
  };

  return (
    <>
      <Helmet>
        <title>Somaherence | Water-coupled resonance, felt not just heard</title>
        <meta
          name="description"
          content="Soaherence is a water-coupled vibroacoustic resonance bed built for embodied listening, rest routines, and launch-ready early access."
        />
      </Helmet>

      <main className="home-page">
        <section className="hero-section section-pad">
          <div className="container hero-grid">
            <div className="hero-copy" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <h1 className="headline-glow">Sonoherence<br/>Waterbed</h1>
              <p className="hero-subtitle">
                Immerse Yourself in Vibrational Bliss
              </p>
              <div className="hero-actions" data-reveal ref={registerReveal} style={revealStyle(1)}>
                <Button size="lg" onClick={() => openWaitlist('hero')}>
                  Join waitlist
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  as="a"
                  href={env.fallbackKickstarterUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleKickstarterClick('hero')}
                >
                  Support on Kickstarter
                </Button>
              </div>
              <ul className="hero-signals" data-reveal ref={registerReveal} style={revealStyle(2)}>
                <li>Water-coupled resonance</li>
                <li>Safety-envelope controls</li>
                <li>Waitlist registration open</li>
              </ul>
            </div>
            <GlassPanel
              padding="lg"
              className="hero-panel"
              data-reveal
              ref={registerReveal}
              style={revealStyle(1)}
            >
              <h2>What it is</h2>
              <p>
                Somaherence uses water as the transmission medium for vibroacoustic resonance. Instead of
                relying only on airborne sound, session profiles couple mechanical wave energy through a
                sealed chamber and body-contact surface.
              </p>
              <div className="micro-diagram">
                <div>
                  <span className="diagram-label">Input</span>
                  <strong>Signal engine</strong>
                </div>
                <div>
                  <span className="diagram-label">Coupling</span>
                  <strong>Transducers + water chamber</strong>
                </div>
                <div>
                  <span className="diagram-label">Experience</span>
                  <strong>Embodied resonance</strong>
                </div>
              </div>
            </GlassPanel>
          </div>
        </section>



        <section className="section-pad">
          <div className="container">
            <header className="section-heading" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow">Why it matters</p>
              <h2>A practical instrument for downshift and deep listening</h2>
              <p>
                Somaherence is built for experiential outcomes: winding down after high-load days, extending
                meditation routines, and creating physically immersive studio sessions.
              </p>
            </header>
            <div className="benefit-grid">
              <GlassPanel data-reveal ref={registerReveal} style={revealStyle(1)} className="glass-card-healing">
                <div className="card-icon-wrapper"><Sun className="card-icon" /></div>
                <h3>Healing Frequencies</h3>
                <p>Experience the power of sound and vibration.</p>
              </GlassPanel>
              <GlassPanel data-reveal ref={registerReveal} style={revealStyle(2)} className="glass-card-relaxation">
                <div className="card-icon-wrapper"><User className="card-icon" /></div>
                <h3>Deep Relaxation</h3>
                <p>Release stress and enter a state of bliss.</p>
              </GlassPanel>
              <GlassPanel data-reveal ref={registerReveal} style={revealStyle(3)} className="glass-card-dreams">
                <div className="card-icon-wrapper"><Moon className="card-icon" /></div>
                <h3>Lucid Dreams</h3>
                <p>Journey beyond into vivid dreamscapes.</p>
              </GlassPanel>
            </div>
          </div>
        </section>

        <section className="section-pad section-soft">
          <div className="container">
            <header className="section-heading" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow">How it works</p>
              <h2>Product architecture</h2>
            </header>
            <div className="feature-grid">
              {featureCards.map((feature, index) => (
                <GlassPanel
                  key={feature.title}
                  data-reveal
                  ref={registerReveal}
                  style={revealStyle(index + 1)}
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container">
            <header className="section-heading" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow">Solutions</p>
              <h2>Program modes</h2>
            </header>
            <div className="mode-grid">
              {solutionModes.map((mode, index) => (
                <GlassPanel
                  key={mode.label}
                  data-reveal
                  ref={registerReveal}
                  style={revealStyle(index + 1)}
                >
                  <h3>{mode.label}</h3>
                  <p>{mode.body}</p>
                </GlassPanel>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad section-soft">
          <div className="container">
            <GlassPanel
              padding="lg"
              className="campaign-panel"
              data-reveal
              ref={registerReveal}
              style={revealStyle(0)}
            >
              <p className="eyebrow">Campaign and Offer</p>
              <h2 className="headline-glow">Founders launch path</h2>
              <p>
                Join the waitlist or choose Kickstarter launch notification. Early 
                registrants receive production updates, region rollout notices, and queue
                priority details.
              </p>
              <ul className="timeline-list">
                <li>Registration and segmentation live now</li>
                <li>Launch window messaging and campaign updates sent by intent segment</li>
              </ul>
              <div className="campaign-actions">
                <Button onClick={() => openWaitlist('campaign')}>Join waitlist</Button>
                <Button
                  variant="secondary"
                  as="a"
                  href={env.fallbackKickstarterUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleKickstarterClick('campaign')}
                >
                  Support on Kickstarter
                </Button>
              </div>
            </GlassPanel>
          </div>
        </section>

        <section className="section-pad">
          <div className="container">
            <header className="section-heading" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow">In collaboration</p>
              <h2>Audio artists, studios, and wellness practitioners</h2>
              <p>
                Pilot conversations are underway with multidisciplinary partners shaping launch programs and
                installation contexts.
              </p>
            </header>
            <div className="partner-chips" data-reveal ref={registerReveal} style={revealStyle(1)}>
              <span>Spatial audio studios</span>
              <span>Soundbath facilitators</span>
              <span>Recovery practitioners</span>
              <span>Mix engineers</span>
              <span>Performance artists</span>
            </div>
          </div>
        </section>

        <section className="section-pad section-soft">
          <div className="container">
            <header className="section-heading" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow">FAQ</p>
              <h2>Common launch questions</h2>
            </header>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="faq-item"
                  data-reveal
                  ref={registerReveal}
                  style={revealStyle(index + 1)}
                >
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad final-cta">
          <div className="container final-cta-inner">
            <div className="final-cta-content" data-reveal ref={registerReveal} style={revealStyle(0)}>
              <p className="eyebrow final-cta-kicker">
                <Sparkles size={14} />
                Founding Wave Access
              </p>
              <h2 className="headline-glow">Claim your place in the first production release</h2>
              <p className="final-cta-copy">
                Secure early access now to receive launch updates, priority purchase windows, and first-wave
                availability before public release.
              </p>

              <ul className="final-cta-proof" data-reveal ref={registerReveal} style={revealStyle(1)}>
                <li>Priority queue position locked at registration</li>
                <li>Founding-wave updates and launch timing notices</li>
                <li>No commitment required to join the queue</li>
              </ul>

              <div className="final-cta-actions" data-reveal ref={registerReveal} style={revealStyle(2)}>
                <Button size="lg" onClick={() => openWaitlist('final_cta')}>
                  Join Waitlist Now
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  as="a"
                  href={env.fallbackKickstarterUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleKickstarterClick('final_cta')}
                >
                  Follow Launch on Kickstarter
                </Button>
              </div>

              <p className="final-cta-footnote" data-reveal ref={registerReveal} style={revealStyle(3)}>
                Early registrants receive first notification when founder allocation opens.
              </p>
            </div>

            <div className="final-cta-glowband" aria-hidden />
          </div>
        </section>
      </main>
    </>
  );
}
