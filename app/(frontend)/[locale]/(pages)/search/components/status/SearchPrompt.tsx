import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { StatusPanel } from './StatusPanel';

export function SearchPrompt() {
  const t = useTranslations('Search.status.prompt');

  return (
    <StatusPanel icon={<Icons.SearchIcon className="size-5" />} title={t('title')}>
      {t('description')}
    </StatusPanel>
  );
}
