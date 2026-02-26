import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import './site-pages.css';

export function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page not found | Somaherence</title>
      </Helmet>
      <main className="page-main">
        <div className="container">
          <GlassPanel padding="lg">
            <p className="eyebrow">404</p>
            <h1>Page not found</h1>
            <p>The page you requested does not exist or may have moved.</p>
            <Button as="a" href="/">
              Return home
            </Button>
          </GlassPanel>
        </div>
      </main>
    </>
  );
}
