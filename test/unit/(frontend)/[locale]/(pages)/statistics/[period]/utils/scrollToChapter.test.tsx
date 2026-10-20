import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scrollToChapter } from '@/app/(frontend)/[locale]/(pages)/statistics/[period]/utils/scrollToChapter';
import { installMatchMedia } from '@/test/helpers/matchMedia';

function makeNav(top: string): HTMLElement {
  const nav = document.createElement('nav');
  nav.style.top = top;
  Object.defineProperty(nav, 'offsetHeight', { configurable: true, value: 60 });
  return nav;
}

describe('scrollToChapter', () => {
  let target: HTMLElement;
  let focus: ReturnType<typeof vi.spyOn>;
  let replace: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    target = document.createElement('div');
    target.id = 'c1';
    target.tabIndex = -1;
    document.body.appendChild(target);

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({ top: 300 } as DOMRect);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 });
    focus = vi.spyOn(target, 'focus');
    replace = vi.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    target.remove();
  });

  it('does nothing when the chapter does not exist', () => {
    scrollToChapter('missing', makeNav('16px'));

    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('scrolls below the sticky nav', () => {
    scrollToChapter('c1', makeNav('16px'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 324, behavior: 'smooth' });
  });

  it('scrolls to the chapter itself without a nav', () => {
    scrollToChapter('c1', null);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 400, behavior: 'smooth' });
  });

  it('jumps instantly when the user prefers reduced motion', () => {
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true });

    scrollToChapter('c1', makeNav('16px'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 324, behavior: 'instant' });
  });

  it('focuses the chapter without scrolling again', () => {
    scrollToChapter('c1', makeNav('16px'));

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('puts the chapter id in the address', () => {
    scrollToChapter('c1', makeNav('16px'));

    expect(replace).toHaveBeenCalledWith(null, '', '#c1');
  });

  it('treats a non numeric nav top as zero', () => {
    scrollToChapter('c1', makeNav('auto'));

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 340, behavior: 'smooth' });
  });
});
