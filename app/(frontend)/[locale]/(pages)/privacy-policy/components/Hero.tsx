import { useFormatter, useTranslations } from 'next-intl';
import { PRIVACY_POLICY_PUBLISHED, PRIVACY_POLICY_UPDATED } from '../data/constants';

export function Hero() {
  const t = useTranslations('PrivacyPolicy.hero');
  const format = useFormatter();

  const modified = PRIVACY_POLICY_UPDATED > PRIVACY_POLICY_PUBLISHED;
  const isoDate = modified ? PRIVACY_POLICY_UPDATED : PRIVACY_POLICY_PUBLISHED;

  // Fixed time zone so server and client render the same string (no hydration mismatch)
  const date = format.dateTime(new Date(isoDate), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  });

  return (
    <div className="flex flex-col items-start justify-center gap-4 pt-10 sm:pt-15 lg:pt-20">
      <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold leading-tight tracking-tighter flex flex-col">
        <span>{t('titleLine1')}</span>
        <span className="text-accent">{t('titleLine2')}</span>
      </h1>
      <div className="flex flex-col gap-10">
        <p className="max-w-140 text-lg text-text-secondary sm:text-xl">{t('description')}</p>
        <time dateTime={isoDate} className="text-sm text-text-tertiary">
          {modified ? t('updated', { date }) : t('published', { date })}
        </time>
      </div>
    </div>
  );
}
