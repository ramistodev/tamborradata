import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useMobileMenu() {
  const pathname = usePathname();
  const [yearsShow, setYearsShow] = useState(false);
  const [listOverflow, setListOverflow] = useState<'hidden' | 'visible'>('hidden');

  function toggleYearsShow() {
    setYearsShow((prev) => !prev);
  }

  useEffect(() => {
    if (pathname.includes('/statistics')) {
      setYearsShow(true);
    } else {
      setYearsShow(false);
    }
  }, [pathname]);

  return {
    yearsShow,
    toggleYearsShow,
    listOverflow,
    setListOverflow,
  };
}
