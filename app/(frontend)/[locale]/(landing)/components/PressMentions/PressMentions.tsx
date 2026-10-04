import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { buttonStyles, Card, Container } from '@/app/(frontend)/[locale]/components/ui';

const ARTICLE_URL =
  'https://www.diariovasco.com/tamborrada/tamborradatacom-fiesta-datos-20260116073402-nt.html';
const AUTHOR_URL = 'https://www.diariovasco.com/autor/jorge-f-mendiola-709.html';

export async function PressMentions() {
  const t = await getTranslations('Landing.press');

  return (
    <section aria-labelledby="press-title" className="w-full py-24">
      <Container>
        <h2
          id="press-title"
          className="font-title text-[clamp(1.8rem,3.5vw,3rem)] font-bold tracking-[-0.03em] text-text"
        >
          {t('title')}
        </h2>
        <p className="mt-2.5 mb-9 max-w-140 text-text-secondary">{t('subtitle')}</p>

        <div className="grid items-start gap-6 md:grid-cols-[1.1fr_0.9fr]">
          {/* Clipping of the article */}
          <a
            href={ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('readMore')} ${t('newWindow')}`}
            className="group block overflow-hidden rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_56px_rgba(0,0,0,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
          >
            <Image
              src="/images/landing/press-clip-diario-vasco-2026.webp"
              alt={t('imageAlt')}
              width={600}
              height={400}
              className="h-auto w-full"
            />
          </a>

          {/* Source details */}
          <Card title={t('source')} description={`${t('date')} · ${t('by')}`}>
            <p className="mb-5 text-[13.5px] leading-[1.65] text-text-secondary">{t('summary')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={ARTICLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'ghost', size: 'sm' })}
              >
                {t('readMore')} →<span className="sr-only"> {t('newWindow')}</span>
              </a>
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-text-secondary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t('by')}
                <span className="sr-only"> {t('newWindow')}</span>
              </a>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
