import { useEffect, useRef, useState } from 'react';

export function useDropdown(defaultValue?: string) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(defaultValue || null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Seleccionar compañía
  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    selectedCompany,
    handleSelectCompany,
  };
}
