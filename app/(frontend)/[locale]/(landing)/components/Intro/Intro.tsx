import { getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '@/app/(frontend)/[locale]/components';
import { buttonStyles, Container } from '@/app/(frontend)/[locale]/components/ui';

export async function Intro() {
  const t = await getTranslations('Landing.hero');

  return (
    <section className="relative flex min-h-[calc(100dvh-61px)] w-full items-center py-16">
      <Container className="flex flex-col items-start gap-6">
        <h1 className="font-title text-[clamp(1.8rem,4.5vw,4.8rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
          {t('titleLead')} <span className="text-accent">{t('titleAccent')}</span>
        </h1>

        <p className="max-w-160 text-[clamp(0.95rem,1.6vw,1.1rem)] leading-[1.65] text-balance text-text-secondary">
          {t('subtitle')}
        </p>

        <Link href="/statistics/global" className={buttonStyles({ className: 'mt-4' })}>
          {t('cta')} <Icons.ArrowRight />
        </Link>
      </Container>
    </section>
  );
}
