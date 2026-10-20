import { describe, expect, it } from 'vitest';
import { CHART_STYLES } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/chartStyles';

describe('CHART_STYLES', () => {
  it.each(['@keyframes series-draw', '.series-draw', '.series-pulse', 'prefers-reduced-motion: reduce'])(
    'contains %s',
    (fragment) => {
      expect(CHART_STYLES).toContain(fragment);
    }
  );
});
