'use client';
import { useCompanies } from '../hooks/useCompanies';
import { useDropdown } from '../hooks/useDropdown';
import { ArrowDown } from '@/app/(frontend)/icons/icons';

export function SelectCompany() {
  const { companies } = useCompanies();
  const { isOpen, setIsOpen, dropdownRef, selectedCompany, handleSelectCompany } = useDropdown();

  return (
    <div className="flex flex-col w-full gap-2" ref={dropdownRef}>
      <label className="font-semibold">Selecciona una compañía</label>

      {/* Input personalizado */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="relative w-full rounded-md bg-(--color-bg-secondary) text-(--color-text) flex items-center justify-between transition-all"
        aria-label="Selector de compañías"
      >
        <input
          type="text"
          name="company"
          value={selectedCompany || ''}
          placeholder="Selecciona una compañía"
          autoComplete="off"
          required
          readOnly
          aria-label={'Compañía seleccionada: ' + (selectedCompany || 'Ninguna')}
          className={`w-full px-3 py-2 bg-transparent outline-none cursor-pointer caret-transparent ${selectedCompany ? '' : 'text-(--color-text-secondary)'}`}
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-400"
          style={{
            transform: isOpen ? 'rotate(0deg) ' : 'rotate(180deg) ',
          }}
        >
          <ArrowDown />
        </div>

        {/* Drop Down*/}
        {isOpen && (
          <div className="absolute -bottom-2 left-0 z-50 translate-y-full sm:max-h-[325px] mt-2 bg-(--color-bg-secondary) border border-(--color-border) rounded-lg overflow-hidden select-none">
            <div className="flex flex-wrap max-h-96 overflow-x-auto hide-scrollbar">
              {companies?.map((company) => (
                <div
                  key={company}
                  onClick={() => handleSelectCompany(company)}
                  aria-label={`Seleccionar compañía ${company}`}
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
