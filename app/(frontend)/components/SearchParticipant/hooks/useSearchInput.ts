import { useRef, useState } from 'react';

export function useSearchInput() {
  const [inputValue, setInputValue] = useState('');
  const previousValueRef = useRef('');

  const onChange = (value: string) => {
    if (value !== previousValueRef.current) previousValueRef.current = inputValue;
    setInputValue(value);
  };

  const onBlur = () => {
    if (inputValue !== previousValueRef.current) redirectToSearch(inputValue);
  };

  const onEnterPress = () => {
    if (!inputValue.trim()) return;
    if (inputValue.trim().length < 3) return;

    redirectToSearch(inputValue);
  };

  const onFocusIn = (inputEl: HTMLElement) => {
    setTimeout(() => {
      if (!inputEl) return;

      const isMobile = window.innerWidth < 768; // Tailwind 'md' breakpoint

      if (isMobile) {
        const inputRect = inputEl.getBoundingClientRect();
        const scrollTop = window.scrollY + inputRect.top - 300;
        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        return;
      }

      inputEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 20);
  };

  const redirectToSearch = (searchTerm: string) => {
    window.location.href = `/search?name=${encodeURIComponent(searchTerm.trim())}`;
  };

  return { inputValue, onChange, onBlur, onEnterPress, onFocusIn };
}
