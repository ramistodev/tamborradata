/** Scrolls `container` horizontally so `active` ends up as centered as the scroll limits allow. */
export function scrollToActiveElement(
  container: HTMLElement | null,
  active: HTMLElement | null,
  behavior: ScrollBehavior = 'instant'
) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!active || !container) return;

  const a = active.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  const distanceToCenter = a.left - c.left - (c.width - a.width) / 2;

  container.scrollTo({
    left: container.scrollLeft + distanceToCenter,
    behavior: prefersReducedMotion ? 'instant' : behavior,
  });
}
