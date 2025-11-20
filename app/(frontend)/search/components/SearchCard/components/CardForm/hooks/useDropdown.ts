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

  useEffect(() => {
    if (!isOpen) return; // Salir si el dropdown no está abierto

    // Scroll suave al abrir el dropdown
    const el = dropdownRef.current;
    const cardHeader = document.getElementById('search-card-title');
    if (el && cardHeader) {
      const selectHeader = cardHeader.getBoundingClientRect();
      const selectRect = el.getBoundingClientRect();
      const absoluteTop = window.scrollY + selectRect.top;
      const offset = window.scrollY + selectHeader.top - 140;
      if (window.scrollY < absoluteTop - offset)
        window.scrollTo({ top: absoluteTop - offset, behavior: 'smooth' });
    }
  }, [isOpen]);

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
