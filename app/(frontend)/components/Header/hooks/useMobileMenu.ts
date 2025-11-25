import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useMobileMenu() {
  const pathname = usePathname();
  const [statsShow, setStatsShow] = useState(false);

  function toggleStatsShow() {
    setStatsShow((prev) => !prev);
  }

  useEffect(() => {
    if (pathname.includes('/statistics')) {
      setStatsShow(true);
    } else {
      setStatsShow(false);
    }
  }, [pathname]);

  return {
    statsShow,
    toggleStatsShow,
  };
}
