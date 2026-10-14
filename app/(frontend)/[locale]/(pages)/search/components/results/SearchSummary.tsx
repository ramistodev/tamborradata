import { useTranslations } from 'next-intl';
import { Button } from '../../../../components/ui';

type SearchSummaryProps = {
  records: number;
  participations: number;
  participant: string;
  school: string;
  onClear: () => void;
};

export function SearchSummary({
  records,
  participations,
  participant,
  school,
  onClear,
}: SearchSummaryProps) {
  const t = useTranslations('Search.results.summary');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="flex min-w-0 flex-col gap-1 font-mono text-xs text-text-tertiary sm:block">
        <span>
          {t('records', { count: records })} · {t('participations', { count: participations })}
        </span>
        <span aria-hidden="true" className="hidden sm:inline">
          {' · '}
        </span>
        <span className="wrap-break-word">{t('query', { participant, school })}</span>
      </p>
      <Button variant="ghost" size="sm" onClick={onClear} className="w-full shrink-0 sm:w-auto">
        {t('clear')}
      </Button>
    </div>
  );
}
