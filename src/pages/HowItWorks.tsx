import { Suspense, lazy, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { useWaitlist } from '../context/use-waitlist';
import { chapterNarrative } from '../content/site-copy';
import { usePageScroll } from '../hooks/usePageScroll';
import './home.css'; // Reuse CSS or create how-it-works.css if needed

const Scene = lazy(async () => {
  const module = await import('../components/3d/Scene');
  return { default: module.Scene };
});

export function HowItWorks() {
  const { openWaitlist } = useWaitlist();
  const dissectionRef = useRef<HTMLElement>(null);
  const scrollData = usePageScroll(dissectionRef);

  return (
    <>
      <Helmet>
        <title>How It Works - Somaherence</title>
        <meta
          name="description"
          content="Learn about the product architecture and the interactive 3D model of the Somaherence waterbed."
        />
      </Helmet>

      <main className="how-it-works-page">
        <section className="dissection-section" ref={dissectionRef}>
          <Suspense
            fallback={
              <div className="scene-loading container">
                <p>Loading interactive dissection...</p>
              </div>
            }
          >
            <Scene scrollData={scrollData} onJoinWaitlist={() => openWaitlist('chapter_cta')} />
          </Suspense>
          <div className="scene-scroll-spacer">
            {chapterNarrative.map((chapter, index) => (
              <article
                key={chapter.title}
                className={`scene-chapter scene-chapter-${index % 2 === 0 ? 'left' : 'right'}`}
                style={{ position: 'absolute', top: `${index * 100 + 120}vh`, zIndex: 10 }}
              >
                <GlassPanel padding="md" className="scene-chapter-card">
                  <h3>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                </GlassPanel>
              </article>
            ))}
            <div
              className="scene-cta"
              style={{
                position: 'absolute',
                top: `${chapterNarrative.length * 100 + 120}vh`,
                zIndex: 10,
              }}
            >
              <h3>Ready for early access?</h3>
              <Button size="lg" onClick={() => openWaitlist('chapter_cta')}>
                Join waitlist
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
