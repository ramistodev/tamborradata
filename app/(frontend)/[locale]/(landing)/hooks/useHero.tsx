import { useEffect, useMemo, useRef, useState } from 'react';
import { OverviewResponse } from '../../../../types/api/overview.types';

const TYPEWRITER_DURATION = 700;
const PHRASES = [
  'La tamborrada vista desde sus nombres',
  'Cada edicion una historia',
  'Detras de la tamborrada hay historias',
];

export function useHero() {
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting' | 'idle'>('typing');

  const phrase = PHRASES[phraseIndex];
  const description = phrase.slice(0, charCount);

  const tiks = useMemo(() => {
    if (phraseIndex === null) return 0;
    return Math.floor(TYPEWRITER_DURATION / PHRASES[phraseIndex].length);
  }, [phraseIndex]);

  useEffect(() => {
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
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
          setPhase('idle');
          return;
        }

        setCharCount((prev) => prev - 1);
      } else if (phase === 'idle') {
        setPhase('typing');
      }
    }, delay);

    return () => clearTimeout(id);
  }, [charCount, phraseIndex, phase, tiks]);

  return { description, overviewRef };
}
