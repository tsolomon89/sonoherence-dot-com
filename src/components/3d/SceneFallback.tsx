import { Button } from '../ui/Button';
import { chapterNarrative } from '../../content/site-copy';

interface SceneFallbackProps {
  onJoinWaitlist: () => void;
  reason: 'no_webgl' | 'reduced_motion';
}

export function SceneFallback({ onJoinWaitlist, reason }: SceneFallbackProps) {
  const fallbackMessage =
    reason === 'reduced_motion'
      ? 'Motion effects are reduced to respect your system settings.'
      : 'Interactive 3D is not available on this device. Showing optimized fallback media.';

  return (
    <section className="scene-fallback">
      <div className="scene-fallback-media">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/media/somaherence-fallback.jpg"
          className="scene-fallback-video"
        >
          <source src="/media/somaherence-fallback.mp4" type="video/mp4" />
        </video>
        <div className="scene-fallback-overlay" />
      </div>

      <div className="scene-fallback-content container">
        <p className="scene-fallback-message">{fallbackMessage}</p>
        <div className="fallback-card-grid">
          {chapterNarrative.map((chapter) => (
            <article key={chapter.title} className="fallback-chapter-card">
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
            </article>
          ))}
        </div>
        <Button size="lg" onClick={onJoinWaitlist}>
          Join waitlist
        </Button>
      </div>
    </section>
  );
}
