import { getFormatter, getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { getArticles } from '../data/getArticles';

export async function ArticleList() {
  const locale = await getLocale();
  const [format, t] = await Promise.all([getFormatter(), getTranslations('Articles.list')]);
  const articles = getArticles(locale);

  return (
    <section
      aria-label={t('ariaLabel')}
      className="lg:w-2/3 w-full flex flex-col px-4 sm:px-5 pb-8 md:pb-15"
    >
      <ul className="flex flex-col border-t border-border">
        {articles.map((article) => (
          <li key={article.id} className="border-b border-border">
            <Link
              href={`/articles/${article.slug}`}
              className="group relative flex flex-col gap-6 py-8 md:py-10 px-4 transition-colors duration-200 hover:bg-bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent">
                    {article.category}
                  </span>
                  {article.hilighted && (
                    <span className="rounded-full border border-accent/30 bg-accent-glow px-2.5 py-0.5 text-xs font-mono uppercase text-accent">
                      {t('highlighted')}
                    </span>
                  )}
                </div>

                <div className="flex items-start">
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance transition-colors duration-200 group-hover:text-accent motion-reduce:transition-none">
                    {article.title}
                  </h2>
                </div>

                <p className="text-base md:text-lg text-text-secondary text-balance max-w-200">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 font-mono text-sm text-text-tertiary">
                <span>{article.readTime}</span>
                <time dateTime={article.publishedAt}>
                  {format.dateTime(new Date(article.publishedAt), {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
