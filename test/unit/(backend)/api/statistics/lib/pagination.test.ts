import { describe, expect, it, vi } from 'vitest';
import { buildCursorPage, clampLimit } from '@/app/(backend)/api/statistics/lib/pagination';

describe('clampLimit', () => {
  it.each([
    [null, 25],
    [1, 1],
    [10, 10],
    [100, 100],
    [101, 100],
    [100000, 100],
  ])('turns %j into %i', (limit, expected) => {
    expect(clampLimit(limit)).toBe(expected);
  });
});

describe('buildCursorPage', () => {
  it('cuts the extra row and encodes the last delivered one', () => {
    const encode = vi.fn((row: number) => `c${row}`);

    const page = buildCursorPage([1, 2, 3], 2, encode);

    expect(page).toEqual({ items: [1, 2], nextCursor: 'c2' });
    expect(encode).toHaveBeenCalledTimes(1);
    expect(encode).toHaveBeenCalledWith(2);
  });

  it('returns no cursor when the rows fit exactly in the page', () => {
    const encode = vi.fn((row: number) => `c${row}`);

    const page = buildCursorPage([1, 2], 2, encode);

    expect(page).toEqual({ items: [1, 2], nextCursor: null });
    expect(encode).not.toHaveBeenCalled();
  });

  it('returns no cursor when there are fewer rows than the limit', () => {
    const page = buildCursorPage([1], 2, (row: number) => `c${row}`);

    expect(page.nextCursor).toBeNull();
  });

  it('returns an empty page for no rows', () => {
    expect(buildCursorPage([], 2, (row: number) => `c${row}`)).toEqual({
      items: [],
      nextCursor: null,
    });
  });

  it('returns a new array when it cuts, leaving the input untouched', () => {
    const rows = [1, 2, 3];

    const page = buildCursorPage(rows, 2, (row: number) => `c${row}`);

    expect(page.items).not.toBe(rows);
    expect(rows).toHaveLength(3);
  });
});
