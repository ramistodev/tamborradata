import { describe, expect, it } from 'vitest';
import {
  chartLayout,
  DEFAULT_LAYOUT,
} from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/components/renders/Series/lib/chartLayout';

describe('chartLayout', () => {
  it('defines the desktop layout as the default', () => {
    expect(DEFAULT_LAYOUT).toEqual({
      compact: false,
      width: 640,
      height: 280,
      maxLines: 10,
      targetTicks: 4,
      minLabelSpacing: 48,
      axisFontSize: 9,
      padding: { top: 28, right: 24, bottom: 30, left: 46 },
    });
  });

  it.each([1000, 560])('returns the default layout for a container of %s px', (width) => {
    expect(chartLayout(width)).toBe(DEFAULT_LAYOUT);
  });

  it('returns the compact layout just below the breakpoint', () => {
    expect(chartLayout(559)).toEqual({
      compact: true,
      width: 559,
      height: 220,
      maxLines: 4,
      targetTicks: 3,
      minLabelSpacing: 44,
      axisFontSize: 10,
      padding: { top: 16, right: 12, bottom: 28, left: 36 },
    });
  });

  it.each([100, 240, 0])('never draws narrower than 240 for a container of %s px', (width) => {
    expect(chartLayout(width).width).toBe(240);
  });
});
