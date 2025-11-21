'use client';
import { scrollToForm } from '../utils/scrollToForm';
import { useCompanies } from '../hooks/useCompanies';
import { useDropdown } from '../hooks/useDropdown';
import { ArrowDown } from '@/app/(frontend)/icons/icons';

export function SelectCompanies({ defaultValue }: { defaultValue?: string }) {
  const { isOpen, setIsOpen, dropdownRef, selectedCompany, handleSelectCompany } =
    useDropdown(defaultValue);
  const { companies } = useCompanies();

  return (
    <div id="company-select" className="flex flex-col w-full gap-2" ref={dropdownRef}>
      <label className="font-semibold">Selecciona una compañía</label>

      {/* INPUT PERSONALIZADO */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          scrollToForm();
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
          <ArrowDown />
        </div>

        {/* DROP DOWN */}
        {isOpen && (
          <div
            id="company-listbox"
            role="listbox"
            className="absolute -bottom-2 left-0 z-50 translate-y-full sm:min-h-[350px] mt-2 bg-(--color-bg-secondary) border border-(--color-border) shadow-[0_2px_5px_0px_var(--eye-catching-text)] rounded-lg overflow-hidden select-none"
          >
            <div className="flex flex-wrap pb-5 max-h-96 overflow-x-auto hide-scrollbar">
              {companies?.map((company) => (
                <div
                  key={company}
                  onClick={() => handleSelectCompany(company)}
                  aria-label={`Seleccionar compañía ${company}`}
                  role="option"
                  aria-selected={selectedCompany === company}
                  className={`w-full lg:w-1/2 text-sm text-left px-3 py-2 transition-colors border-b border-(--color-border) ${
                    selectedCompany === company
                      ? 'bg-(--select-color) font-semibold'
                      : 'cursor-pointer hover:text-(--color-text-secondary) hover:bg-(--color-bg-secondary-hover)'
                  }`}
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
