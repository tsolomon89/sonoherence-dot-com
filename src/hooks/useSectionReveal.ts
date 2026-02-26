import { useCallback, useEffect, useRef } from 'react';

interface UseSectionRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

const DEFAULT_THRESHOLD = 0;
const DEFAULT_ROOT_MARGIN = '0px 0px -12% 0px';

export function useSectionReveal(options: UseSectionRevealOptions = {}) {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD;
  const rootMargin = options.rootMargin ?? DEFAULT_ROOT_MARGIN;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.dataset.inView = 'true';
              observer.unobserve(target);
            }
          });
        },
        { threshold, rootMargin },
      );
    }
    return observerRef.current;
  }, [threshold, rootMargin]);

  const registerReveal = useCallback(
    (element: HTMLElement | null) => {
      if (!element) return;
      if (element.dataset.inView === 'true') return;

      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        element.dataset.inView = 'true';
        return;
      }

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight * 0.9 && rect.bottom > 0) {
        element.dataset.inView = 'true';
        return;
      }

      const observer = getObserver();
      observer.observe(element);
    },
    [getObserver],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  return registerReveal;
}
