import type { ReactNode } from 'react';
import { getArticleStaticParams } from '../data/staticParams';

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getArticleStaticParams(params.locale);
}

export default function ArticleLayout({ children }: { children: ReactNode }) {
  return children;
}
