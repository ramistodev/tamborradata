import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const TYPEWRITER_DURATION = 700;

/**
 * `phrases` are the (already translated) tagline phrases, typed and deleted one after another.
 * With reduced motion requested nothing moves: the first phrase is shown whole.
 */
export function useHero(phrases: string[]) {
  const reducedMotion = usePrefersReducedMotion();
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting' | 'idle'>('typing');

  const phraseCount = phrases.length;
  const phrase = phrases[phraseIndex % phraseCount];
  const description = reducedMotion ? phrases[0] : phrase.slice(0, charCount);

  // The time to type a phrase is the same for every phrase, however long it is
  const tiks = Math.floor(TYPEWRITER_DURATION / phrase.length);

  useEffect(() => {
    if (reducedMotion) return;

    const delay = { typing: tiks, holding: 2000, deleting: tiks / 2, idle: 1000 }[phase];

    const id = setTimeout(() => {
      if (phase === 'typing') {
        if (charCount === phrase.length) {
          setPhase('holding');
          return;
        }

        setCharCount((prev) => prev + 1);
      } else if (phase === 'holding') {
        setPhase('deleting');
      } else if (phase === 'deleting') {
        if (charCount === 0) {
          setPhraseIndex((prev) => (prev + 1) % phraseCount);
          setPhase('idle');
          return;
        }

        setCharCount((prev) => prev - 1);
      } else if (phase === 'idle') {
        setPhase('typing');
      }
    }, delay);

    return () => clearTimeout(id);
  }, [charCount, phase, phrase.length, phraseCount, tiks, reducedMotion]);

  return { description, overviewRef };
}
