import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('Search.hero');

  return (
    <div className="flex flex-col items-start justify-between w-full h-full gap-4">
      <h1 className="text-3xl md:text-4xl lg:text-6xl flex flex-col gap-1 md:gap-2 lg:gap-3 font-bold text-left">
        <span>{t('titleLine1')}</span>
        <span>
          {t.rich('titleLine2', {
            accent: (chunks) => <span className="text-accent">{chunks}</span>,
          })}
        </span>
      </h1>
      <p className="text-lg md:text-xl lg:text-2xl text-text-secondary text-left">
        {t('description')}
      </p>
      <p className="text-sm sm:text-base text-text-tertiary text-left">{t('about')}</p>
    </div>
  );
}
