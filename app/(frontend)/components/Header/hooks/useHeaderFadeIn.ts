import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useHeaderFadeIn() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  const handleScroll = () => {
    if (isVisible) return;

    if (window.scrollY > window.innerHeight) {
      setIsVisible(true);
    }
  };

  useEffect(() => {
    if (pathname !== '/') {
      setIsVisible(true);
    }

    handleScroll();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isVisible };
}
