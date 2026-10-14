import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { StatusPanel } from './StatusPanel';

export function NoResults() {
  const t = useTranslations('Search.status.noResults');

  return (
    <StatusPanel icon={<Icons.QuestionIcon />} title={t('title')}>
      {t('description')}
    </StatusPanel>
  );
}
