import { useState } from 'react';

export function useMobileMenu() {
  const [statsShow, setStatsShow] = useState(false);

  function toggleStatsShow() {
    setStatsShow((prev) => !prev);
  }

  return {
    statsShow,
    toggleStatsShow,
  };
}
