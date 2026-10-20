import { describe, expect, it } from 'vitest';
import {
  PREVIEW_ENTITIES,
  PREVIEW_GROUPS,
  PREVIEW_PERIODS,
  PREVIEW_RANKS,
  PREVIEW_SCHOOLS,
} from '@/app/(backend)/api/statistics/lib/preview';

describe('preview limits', () => {
  const limits = {
    PREVIEW_RANKS,
    PREVIEW_ENTITIES,
    PREVIEW_PERIODS,
    PREVIEW_SCHOOLS,
    PREVIEW_GROUPS,
  };

  it.each(Object.entries(limits))('pins %s to 10', (_name, value) => {
    expect(value).toBe(10);
  });

  it.each(Object.entries(limits))('keeps %s a positive integer', (_name, value) => {
    expect(Number.isInteger(value) && value > 0).toBe(true);
  });
});
