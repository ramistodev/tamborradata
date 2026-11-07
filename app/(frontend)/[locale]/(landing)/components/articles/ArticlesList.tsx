import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { getArticles } from '../../../(pages)/articles/data/getArticles';
import { LANDING_ARTICLE_COUNT, LANDING_ARTICLES_TITLE_ID } from './constants';

export async function ArticlesList() {
  const locale = await getLocale();
  const t = await getTranslations('Articles.article');
  const articles = getArticles(locale, LANDING_ARTICLE_COUNT);

  return (
    <ul
      aria-labelledby={LANDING_ARTICLES_TITLE_ID}
      className="flex w-full flex-col border-t border-border"
    >
      {articles.map((article) => (
        <li key={article.id} className="border-b border-border">
          <Link
            href={`/articles/${article.slug}`}
            className="group flex flex-col gap-4 px-2 py-6 transition-colors duration-200 hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none sm:px-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-accent">
                {article.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-balance transition-colors duration-200 group-hover:text-accent motion-reduce:transition-none">
                {article.title}
              </h3>
              <p className="line-clamp-2 text-base text-text-secondary text-pretty">
                {article.description}
              </p>
              <span className="font-mono text-sm text-text-tertiary">
                {t('readTime', { time: article.readTime })}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
