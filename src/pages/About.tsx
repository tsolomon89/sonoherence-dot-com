import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useWaitlist } from '../context/use-waitlist';
import './site-pages.css';

export function About() {
  const { openWaitlist } = useWaitlist();

  return (
    <>
      <Helmet>
        <title>About Somaherence</title>
        <meta
          name="description"
          content="Learn how Somaherence combines water-coupled vibroacoustic design, safety-first engineering, and launch-stage manufacturing goals."
        />
      </Helmet>

      <main className="page-main">
        <div className="container">
          <header className="page-header">
            <p className="eyebrow">About</p>
            <h1>Grounded design, sensory depth</h1>
            <p>
              Somaherence started as an engineering question: what changes when resonance is coupled through
              water instead of delivered only through air? The product direction emerged from studio
              experimentation, embodied listening practice, and strict safety boundaries.
            </p>
          </header>

          <section className="page-section page-grid two">
            <GlassPanel padding="lg">
              <h2>Origin story</h2>
              <p>
                Early prototypes tested how low-frequency structures travel through a sealed chamber and
                contact surface. Sessions showed consistent experiential differences in perceived depth and
                immersion compared to conventional speaker setups.
              </p>
              <p>
                The team translated those prototypes into a manufacturable architecture that keeps operation
                practical: repeatable parts, defined service windows, and clear usage guidance.
              </p>
            </GlassPanel>

            <GlassPanel padding="lg">
              <h2>Design principles</h2>
              <ul>
                <li>Physics-first claims: describe transmission and resonance, not cures.</li>
                <li>Safety envelope: software and hardware limits for amplitude and duration.</li>
                <li>Operational clarity: plain-language setup, maintenance, and policy docs.</li>
                <li>Experiential focus: rest, listening, and recovery contexts.</li>
              </ul>
            </GlassPanel>
          </section>

          <section className="page-section">
            <GlassPanel padding="lg">
              <h2>Technology overview</h2>
              <div className="page-grid three">
                <div>
                  <p className="eyebrow">Layer 1</p>
                  <h3>Signal Engine</h3>
                  <p>Mode-aware signal routing, envelope shaping, and limit controls.</p>
                </div>
                <div>
                  <p className="eyebrow">Layer 2</p>
                  <h3>Coupling Stack</h3>
                  <p>Transducer array bonded to a sealed chamber with calibrated transfer behavior.</p>
                </div>
                <div>
                  <p className="eyebrow">Layer 3</p>
                  <h3>Session Library</h3>
                  <p>Preset structures for Drift, Recover, Focus, and Soundbath workflows.</p>
                </div>
              </div>
            </GlassPanel>
          </section>

          <section className="page-section page-grid two">
            <GlassPanel padding="lg">
              <h2>Team and advisors</h2>
              <p>
                Somaherence is developed with contributors from hardware, audio engineering, production, and
                studio facilitation. Public advisor profiles will be published before campaign launch.
              </p>
            </GlassPanel>
            <GlassPanel padding="lg">
              <h2>Manufacturing roadmap</h2>
              <ul>
                <li>Q2 2026: final assembly validation and reliability testing</li>
                <li>Q3 2026: founders reservation queue and pilot fulfillment prep</li>
                <li>Q4 2026: first production wave and region-by-region shipping notices</li>
              </ul>
            </GlassPanel>
          </section>

          <section className="page-section">
            <GlassPanel padding="lg">
              <h2>Launch participation</h2>
              <p>
                Join the waitlist for release updates, reservation milestones, and Kickstarter launch
                notifications based on your selected intent.
              </p>
              <Button onClick={() => openWaitlist('final_cta')}>Join waitlist</Button>
            </GlassPanel>
          </section>
        </div>
      </main>
    </>
  );
}
