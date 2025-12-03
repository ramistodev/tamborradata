'use client';
import { scrollToForm } from '../../utils/scrollToForm';
import { useDropdown } from './hooks/useDropdown';
import { ChevronDown } from '@/app/(frontend)/icons/icons';
import { SelectOptions } from './SelectOptions';

export function SelectCompanies({ defaultValue }: { defaultValue?: string }) {
  const dropDownHook = useDropdown(defaultValue);
  const { isOpen, setIsOpen, dropdownRef, selectedCompany } = dropDownHook;

  return (
    <div id="company-select" className="flex flex-col w-full gap-2" ref={dropdownRef}>
      <label className="font-semibold">Selecciona una compañía</label>

      {/* INPUT PERSONALIZADO */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          scrollToForm(dropdownRef.current);
        }}
        type="button"
        aria-label="Selector de compañías"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="company-listbox"
        className="relative w-full rounded-md bg-(--color-bg-secondary) text-(--color-text) flex items-center justify-between transition-all"
      >
        <input
          required
          readOnly
          type="text"
          name="company"
          autoComplete="off"
          value={selectedCompany || ''}
          placeholder="Selecciona una compañía"
          aria-label={'Compañía seleccionada: ' + (selectedCompany || 'Ninguna')}
          className={`w-full px-3 py-2 bg-transparent outline-none cursor-pointer caret-transparent ${selectedCompany ? '' : 'text-(--color-text-secondary)'}`}
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-400"
          style={{
            transform: isOpen ? 'rotate(180deg) ' : 'rotate(0deg) ',
          }}
        >
          <ChevronDown />
        </div>

        {/* DROP DOWN */}
        {isOpen && (
          <div
            id="company-listbox"
            role="listbox"
            className="absolute -bottom-2 left-0 z-50 translate-y-full sm:min-h-[350px] mt-2 bg-(--color-bg-secondary) border border-(--color-border) shadow-[0_2px_5px_0px_var(--eye-catching-text)] rounded-lg overflow-hidden select-none"
          >
            <SelectOptions {...dropDownHook} />
          </div>
        )}
      </button>
    </div>
  );
}
