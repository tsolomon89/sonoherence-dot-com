import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { initGtm, trackEvent } from '../../lib/analytics';
import { captureUtmFromLocation } from '../../lib/utm';
import { detectDeviceTier } from '../../lib/device';
import { WaitlistProvider } from '../../context/WaitlistProvider';
import type { SourceCta } from '../../types/funnel';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WaitlistModal } from '../waitlist/WaitlistModal';

const DEFAULT_SOURCE: SourceCta = 'hero';

export function SiteLayout() {
  const location = useLocation();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [sourceCta, setSourceCta] = useState<SourceCta>(DEFAULT_SOURCE);
  const deviceTier = useMemo(() => detectDeviceTier(), []);

  useEffect(() => {
    initGtm();
    captureUtmFromLocation();
  }, []);

  useEffect(() => {
    trackEvent('page_view', {
      page_path: location.pathname,
      device_tier: deviceTier,
    });
  }, [location.pathname, deviceTier]);

  const openWaitlist = (source: SourceCta) => {
    setSourceCta(source);
    setIsWaitlistOpen(true);
    trackEvent('waitlist_modal_open', {
      source_cta: source,
      device_tier: deviceTier,
    });
  };

  return (
    <WaitlistProvider value={{ openWaitlist }}>
      <Navbar onJoinWaitlist={() => openWaitlist('nav')} />
      <Outlet />
      <Footer />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        sourceCta={sourceCta}
      />
    </WaitlistProvider>
  );
}
