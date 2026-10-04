export const scrollToTopTable = (el: HTMLElement | null, offset: number = 120) => {
  if (!el) return;

  const header = document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const rect = el.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;

  window.scrollTo({
    top: Math.max(0, absoluteTop - headerHeight - offset),
    behavior: 'smooth',
  });
};
