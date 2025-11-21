export const scrollToForm = () => {
  setTimeout(() => {
    const searchCardForm = document.getElementById('search-card-form');
    if (!searchCardForm) return;

    const searchCardFormRect = searchCardForm.getBoundingClientRect();
    const scrollTop = window.scrollY + searchCardFormRect.top - 50;

    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, 20);
};
