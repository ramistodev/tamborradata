import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { getArticles } from '../data/getArticles';
import type { Article } from '../types/article.types';

const RELATED_COUNT = 2;
const TITLE_ID = 'related-articles-title';

function pickRelated(articles: Article[], currentId: string) {
  const index = articles.findIndex((article) => article.id === currentId);
  const others = [...articles.slice(index + 1), ...articles.slice(0, Math.max(index, 0))];

  return others.slice(0, RELATED_COUNT);
}

export async function RelatedArticles({ current }: { current: Article }) {
  const locale = await getLocale();
  const t = await getTranslations('Articles.article');
  const related = pickRelated(getArticles(locale), current.id);

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby={TITLE_ID}
      className="lg:w-2/3 w-full flex flex-col gap-6 px-4 sm:px-5 pb-12 md:pb-20"
    >
      <h2
        id={TITLE_ID}
        className="border-t border-border pt-8 font-mono text-sm uppercase tracking-widest text-text-secondary"
      >
        {t('keepReading')}
      </h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {related.map((article) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-accent">
                {article.category}
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-balance transition-colors duration-200 group-hover:text-accent motion-reduce:transition-none">
                {article.title}
              </h3>
              <p className="line-clamp-3 text-base text-text-secondary text-pretty">
                {article.description}
              </p>
              <span className="mt-auto font-mono text-sm text-text-tertiary">
                {article.readTime}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
