'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Icons } from '../../../../components/Icons';
import { Button } from '../../../../components/ui';
import { StatusPanel } from './StatusPanel';

/**
 * Takes the place of the search form when the school list could not be loaded, so the rest of the
 * page keeps working. It reserves roughly the height of the form plus its results panel, so the
 * sections below do not jump when the search comes back.
 */
export function SchoolsUnavailable() {
  const t = useTranslations('Search.status.schoolsUnavailable');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    // aria-disabled keeps the button focusable, so the click has to be ignored here
    if (isPending) return;
    // Asks the server for the page again; the transition keeps the button locked meanwhile
    startTransition(() => router.refresh());
  };

  return (
    <div className="flex flex-col">
      <StatusPanel
        tone="danger"
        icon={<Icons.ExclamationCircle className="size-5" />}
        title={t('title')}
        action={
          <Button variant="danger" size="sm" aria-disabled={isPending} onClick={handleRetry}>
            <Icons.RetryIcon className="size-3.5" />
            {isPending ? t('retrying') : t('retry')}
          </Button>
        }
      >
        {t('description')}
      </StatusPanel>
    </div>
  );
}
