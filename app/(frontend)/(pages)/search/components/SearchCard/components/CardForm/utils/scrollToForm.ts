export const scrollToForm = (
  searchCardForm: HTMLElement = document.getElementById('search-card-form')
) => {
  setTimeout(() => {
    if (!searchCardForm) return;

    const searchCardFormRect = searchCardForm.getBoundingClientRect();
    const scrollTop = window.scrollY + searchCardFormRect.top - 100;

    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, 20);
};
