import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { trackEvent } from '../lib/analytics';
import { useWaitlist } from '../context/use-waitlist';
import './site-pages.css';

export function ReserveSuccess() {
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    trackEvent('reserve_checkout_completed');
  }, []);

  return (
    <>
      <Helmet>
        <title>Reservation confirmed | Somaherence</title>
        <meta
          name="description"
          content="Your refundable Somaherence reservation deposit was received."
        />
      </Helmet>

      <main className="page-main">
        <div className="container">
          <GlassPanel padding="lg">
            <p className="eyebrow">Reservation confirmed</p>
            <h1>Deposit received</h1>
            <p>
              Your refundable reservation deposit has been recorded. We will email updates for production
              milestones, next payment windows, and shipping-region timelines.
            </p>
            <div className="page-actions">
              <Button onClick={() => openWaitlist('final_cta')}>Update waitlist intent</Button>
              <Button variant="secondary" as="a" href="/refund-policy">
                Review refund policy
              </Button>
            </div>
          </GlassPanel>
        </div>
      </main>
    </>
  );
}
