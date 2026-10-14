import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { Button } from '../../../../components/ui';
import { StatusPanel } from './StatusPanel';

export function SearchError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations('Search.status.error');

  return (
    <StatusPanel
      tone="danger"
      icon={<Icons.ExclamationCircle className="size-5" />}
      title={t('title')}
      action={
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <Icons.RetryIcon className="size-3.5" />
          {t('retry')}
        </Button>
      }
    >
      {t('description')}
    </StatusPanel>
  );
}
