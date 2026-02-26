import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useWaitlist } from '../context/use-waitlist';
import './site-pages.css';

export function ReserveCancel() {
  const { openWaitlist } = useWaitlist();

  return (
    <>
      <Helmet>
        <title>Reservation canceled | Somaherence</title>
        <meta
          name="description"
          content="Your reservation checkout was canceled. You can resume from the waitlist flow."
        />
      </Helmet>

      <main className="page-main">
        <div className="container">
          <GlassPanel padding="lg">
            <p className="eyebrow">Checkout canceled</p>
            <h1>No payment captured</h1>
            <p>
              Your reservation checkout was canceled before completion. You can resume at any time through the
              waitlist flow.
            </p>
            <div className="page-actions">
              <Button onClick={() => openWaitlist('final_cta')}>Resume reservation</Button>
              <Button variant="secondary" as="a" href="/support">
                Contact support
              </Button>
            </div>
          </GlassPanel>
        </div>
      </main>
    </>
  );
}
