import { getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { Icons } from '../../../components/Icons';
import { ArticlesList } from './ArticlesList';
import { LANDING_ARTICLES_TITLE_ID } from './constants';

export async function ArticlesSection() {
  const t = await getTranslations('Landing.articles');

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start flex flex-col items-start gap-6">
        <h2
          id={LANDING_ARTICLES_TITLE_ID}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance"
        >
          {t('title')}
        </h2>
        <p className="text-sm sm:text-lg lg:text-xl text-text-secondary text-balance">
          {t('description')}
        </p>
        <Link
          href="/articles"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
        >
          {t('cta')}
          <Icons.ArrowRight className="size-4" />
        </Link>
      </div>
      <ArticlesList />
    </div>
  );
}
