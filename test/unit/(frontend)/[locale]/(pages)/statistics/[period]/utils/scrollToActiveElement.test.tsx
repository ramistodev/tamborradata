import { beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollToActiveElement } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToActiveElement';
import { installMatchMedia } from '@/test/helpers/matchMedia';

describe('scrollToActiveElement', () => {
  let container: HTMLElement;
  let active: HTMLElement;
  let scrollTo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement('div');
    active = document.createElement('button');
    scrollTo = vi.fn();
    container.scrollTo = scrollTo as unknown as typeof container.scrollTo;

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({ left: 100, width: 300 } as DOMRect);
    vi.spyOn(active, 'getBoundingClientRect').mockReturnValue({ left: 500, width: 100 } as DOMRect);
    Object.defineProperty(container, 'scrollLeft', { configurable: true, value: 50 });
  });

  it('does nothing without a container', () => {
    scrollToActiveElement(null, active);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('does nothing without an active element', () => {
    scrollToActiveElement(container, null);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('centers the active element in the container', () => {
    scrollToActiveElement(container, active);

    expect(scrollTo).toHaveBeenCalledWith({ left: 350, behavior: 'instant' });
  });

  it('uses the requested behavior', () => {
    scrollToActiveElement(container, active, 'smooth');

    expect(scrollTo).toHaveBeenCalledWith({ left: 350, behavior: 'smooth' });
  });

  it('forces an instant scroll when the user prefers reduced motion', () => {
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    scrollToActiveElement(container, active, 'smooth');

    expect(scrollTo).toHaveBeenCalledWith({ left: 350, behavior: 'instant' });
  });
});
