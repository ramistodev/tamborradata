'use client';
import { useEffect, useRef } from 'react';

export function ProgressBar({ targetId }: { targetId: string }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const target = document.getElementById(targetId);

    if (!bar || !target) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const end = target.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const progress = end > 0 ? Math.min(Math.max(window.scrollY / end, 0), 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(target);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-501 h-0.5">
      <div
        ref={barRef}
        className="h-full origin-left bg-accent will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
