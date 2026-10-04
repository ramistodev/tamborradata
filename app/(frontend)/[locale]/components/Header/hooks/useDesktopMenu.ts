import { useState } from 'react';

export function useDesktopMenu() {
  const [yearsShow, setYearsShow] = useState(false);

  function toggleYearsShow() {
    setYearsShow((prev) => !prev);
  }

  return {
    yearsShow,
    toggleYearsShow,
  };
}
