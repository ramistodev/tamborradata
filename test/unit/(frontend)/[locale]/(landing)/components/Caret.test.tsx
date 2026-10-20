import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Caret } from '@/app/(frontend)/[locale]/(landing)/components/Caret';
import { installMatchMedia } from '@/test/helpers/matchMedia';

describe('Caret', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a decorative visible span', () => {
    const { container } = render(<Caret />);

    const caret = container.querySelector('span');

    expect(caret).toHaveAttribute('aria-hidden', 'true');
    expect(caret).toHaveClass('opacity-100');
  });

  it('blinks every 530 ms', () => {
    const { container } = render(<Caret />);
    const caret = container.querySelector('span');

    act(() => {
      vi.advanceTimersByTime(530);
    });
    expect(caret).toHaveClass('opacity-0');

    act(() => {
      vi.advanceTimersByTime(530);
    });
    expect(caret).toHaveClass('opacity-100');
  });

  it('stays solid and schedules nothing with reduced motion', () => {
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    const { container } = render(<Caret />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(container.querySelector('span')).toHaveClass('opacity-100');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears the interval on unmount', () => {
    const { unmount } = render(<Caret />);
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
