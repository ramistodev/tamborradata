import { getTranslations } from 'next-intl/server';
import { ArticleList } from './components/ArticleList';
import { Hero } from './components/Hero';

export async function PageContent() {
  const t = await getTranslations('Articles.hero');

  return (
    <div className="flex flex-col gap-15 items-center w-full">
      <Hero location="rightCenter">
        <span className="text-base font-mono uppercase text-accent">{t('eyebrow')}</span>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-balance">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-balance text-text-secondary w-full max-w-200">
            {t('description')}
          </p>
        </div>
      </Hero>
      <ArticleList />
    </div>
  );
}
