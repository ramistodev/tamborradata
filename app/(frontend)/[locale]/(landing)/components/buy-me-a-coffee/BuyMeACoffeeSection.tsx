import { useTranslations } from 'next-intl';
import { BuyMeACoffee } from '../../../components/ui/BuyMeACoffee';

export function BuyMeACoffeeSection() {
  const t = useTranslations('Landing.buyMeACoffee');

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {t('title')}
        </h2>
        <p className="text-lg text-text-secondary text-balance">{t('paragraph1')}</p>
        <p className="text-lg text-text-secondary text-balance">{t('paragraph2')}</p>
      </div>

      <div className="flex w-full flex-col items-start gap-5 rounded-2xl border border-border bg-bg p-6 sm:p-8">
        <p className="font-mono text-xs tracking-widest text-text-tertiary uppercase">
          {t('cardLabel')}
        </p>
        <p className="text-text-secondary text-balance">{t('cardText')}</p>
        <BuyMeACoffee />
      </div>
    </div>
  );
}
