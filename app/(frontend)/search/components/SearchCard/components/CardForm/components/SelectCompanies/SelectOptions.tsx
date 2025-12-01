import { useCompanies } from '@/app/(frontend)/search/hooks/useCompanies';
import { useDropdown } from './hooks/useDropdown';
import { CompaniesLoading } from './CompaniesLoading';

export function SelectOptions({
  selectedCompany,
  handleSelectCompany,
}: ReturnType<typeof useDropdown>) {
  const { companies, isLoading, isFetching } = useCompanies();

  if (isLoading || isFetching) return <CompaniesLoading />;

  return (
    <>
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
    </>
  );
}
