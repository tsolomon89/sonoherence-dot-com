import { useEffect, useRef, type RefObject } from 'react';

export function usePageScroll(containerRef: RefObject<HTMLElement | null>) {
  const scrollData = useRef({ offset: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalScroll = rect.height - windowHeight;
      if (totalScroll <= 0) {
        scrollData.current.offset = 0;
        return;
      }

      const scrolled = -rect.top;
      scrollData.current.offset = Math.max(0, Math.min(1, scrolled / totalScroll));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [containerRef]);

  return scrollData;
}
