import { TARGET_TICKS } from '../constants';

/** Round tick values (1, 2, 5 x 10^n) that start at 0 (or below) and cover the maximum. */
export function niceTicks(min: number, max: number): number[] {
  const range = max - min || 1;
  const rawStep = range / TARGET_TICKS;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
  const first = Math.floor(min / step);
  const last = Math.ceil(max / step);

  // Whole multiples of `step` (never `tick += step`), so 0 is exactly 0 and not 5.5e-17.
  return Array.from({ length: last - first + 1 }, (_, index) => {
    const multiple = first + index;
    return multiple === 0 ? 0 : Number((multiple * step).toPrecision(12));
  });
}
