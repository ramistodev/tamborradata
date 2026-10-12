// Scrolls the page to the chapter with the given `id`, taking into account the height of the sticky nav bar
export function scrollToChapter(id: string, nav: HTMLElement | null) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stickyTop = nav ? Number.parseFloat(getComputedStyle(nav).top) || 0 : 0;
  const offset = nav ? stickyTop + nav.offsetHeight : 0;

  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - offset,
    behavior: prefersReducedMotion ? 'instant' : 'smooth',
  });

  // Focus and URL follow the scroll, so keyboard and screen reader users land in the chapter
  // instead of staying on the link they pressed, and the address can be shared or reloaded.
  target.focus({ preventScroll: true });
  history.replaceState(null, '', `#${id}`);
}
