import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { Button } from '../../../../components/ui';
import { useCountdown } from '../../hooks/useCountdown';
import { StatusPanel } from './StatusPanel';

const SECONDS_PER_MINUTE = 60;

type SearchRateLimitedProps = {
  retryAfterSeconds: number;
  onRetry: () => void;
};

export function SearchRateLimited({ retryAfterSeconds, onRetry }: SearchRateLimitedProps) {
  const t = useTranslations('Search.status.rateLimited');
  const remaining = useCountdown(retryAfterSeconds);
  const isReady = remaining === 0;

  return (
    <StatusPanel
      tone="warning"
      icon={<Icons.ClockIcon />}
      title={t('title')}
      action={
        <Button variant="warning" size="sm" disabled={!isReady} onClick={onRetry}>
          <Icons.RetryIcon className="size-3.5" />
          {t('retry')}
        </Button>
      }
    >
      {isReady
        ? t('ready')
        : t('countdown', {
            minutes: Math.floor(remaining / SECONDS_PER_MINUTE),
            seconds: remaining % SECONDS_PER_MINUTE,
          })}
    </StatusPanel>
  );
}
