import { useEffect, useRef, useState } from 'react';
import { scrollToForm } from '../../../utils/scrollToForm';

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
    setTimeout(() => {
      scrollToForm();
    }, 20);
  };

  return {
    isOpen,
    setIsOpen,
    dropdownRef,
    selectedCompany,
    handleSelectCompany,
  };
}
