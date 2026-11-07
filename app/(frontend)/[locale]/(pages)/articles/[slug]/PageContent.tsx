import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/app/(frontend)/i18n/navigation';
import { RendererArticle } from '../components/RendererArticle';
import type { Article } from '../types/article.types';
import { Icons } from '../../../components';
import { Hero } from '../components/Hero';
import { ProgressBar } from '../components/ProgressBar';
import { RelatedArticles } from '../components/RelatedArticles';

const CONTENT_ID = 'article-content';
const TITLE_ID = 'article-title';

export async function PageContent({ article }: { article: Article }) {
  const [format, t] = await Promise.all([getFormatter(), getTranslations('Articles.article')]);

  return (
    <>
      <ProgressBar targetId={CONTENT_ID} />
      <article aria-labelledby={TITLE_ID} className="flex flex-col gap-15 items-center w-full">
        <Hero location="rightTop">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2 text-text-secondary font-mono text-sm ">
            <Link
              href="/articles"
              className="flex gap-2 items-center uppercase group hover:text-text-tertiary"
            >
              <Icons.ArrowLeft className="relative w-3 h-3 group-hover:-translate-x-2 transition-transform" />
              <span>{t('backToList')}</span>
            </Link>
            <time dateTime={article.publishedAt}>
              {t('published', {
                date: format.dateTime(new Date(article.publishedAt), {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                }),
              })}
            </time>
          </div>
          <div className="flex flex-col gap-6">
            <h1 id={TITLE_ID} className="text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-balance">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-balance text-text-secondary w-full max-w-200">
              {article.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-text-tertiary text-sm">
              {t('readTime', { time: article.readTime })}
            </span>
          </div>
        </Hero>

        <div
          id={CONTENT_ID}
          className="lg:w-2/3 w-full flex flex-col gap-8 py-10 md:gap-10 px-4 sm:px-5 pb-8 md:pb-15"
        >
          {article.articleContent && <RendererArticle content={article.articleContent} />}
        </div>
      </article>
      <RelatedArticles current={article} />
    </>
  );
}
