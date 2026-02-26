import { Suspense, lazy, type ComponentType } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';
import { SiteLayout } from './components/layout/SiteLayout';
import { ScrollToTop } from './components/layout/ScrollToTop';

const Home = lazy(async () => {
  const module = await import('./pages/Home');
  return { default: module.Home };
});
const HowItWorks = lazy(async () => {
  const module = await import('./pages/HowItWorks');
  return { default: module.HowItWorks };
});
const About = lazy(async () => {
  const module = await import('./pages/About');
  return { default: module.About };
});
const Support = lazy(async () => {
  const module = await import('./pages/Support');
  return { default: module.Support };
});
const Privacy = lazy(async () => {
  const module = await import('./pages/Privacy');
  return { default: module.Privacy };
});
const Terms = lazy(async () => {
  const module = await import('./pages/Terms');
  return { default: module.Terms };
});
const RefundPolicy = lazy(async () => {
  const module = await import('./pages/RefundPolicy');
  return { default: module.RefundPolicy };
});
const Safety = lazy(async () => {
  const module = await import('./pages/Safety');
  return { default: module.Safety };
});
const Accessibility = lazy(async () => {
  const module = await import('./pages/Accessibility');
  return { default: module.Accessibility };
});
const ReserveSuccess = lazy(async () => {
  const module = await import('./pages/ReserveSuccess');
  return { default: module.ReserveSuccess };
});
const ReserveCancel = lazy(async () => {
  const module = await import('./pages/ReserveCancel');
  return { default: module.ReserveCancel };
});
const NotFound = lazy(async () => {
  const module = await import('./pages/NotFound');
  return { default: module.NotFound };
});

function RouteFallback() {
  return (
    <main className="page-main">
      <div className="container">
        <p>Loading page...</p>
      </div>
    </main>
  );
}

function lazyElement(Component: ComponentType) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={lazyElement(Home)} />
            <Route path="/how-it-works" element={lazyElement(HowItWorks)} />
            <Route path="/about" element={lazyElement(About)} />
            <Route path="/support" element={lazyElement(Support)} />
            <Route path="/privacy" element={lazyElement(Privacy)} />
            <Route path="/terms" element={lazyElement(Terms)} />
            <Route path="/refund-policy" element={lazyElement(RefundPolicy)} />
            <Route path="/safety" element={lazyElement(Safety)} />
            <Route path="/accessibility" element={lazyElement(Accessibility)} />
            <Route path="/reserve/success" element={lazyElement(ReserveSuccess)} />
            <Route path="/reserve/cancel" element={lazyElement(ReserveCancel)} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={lazyElement(NotFound)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
