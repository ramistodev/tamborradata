import type { Locale } from '@/app/types/locale';
import { blockType, type ArticleContent } from '../../../types/article.types';
import type { ArticleCopy } from './copy.types';
import { figures } from './figures';
import { createFormatter } from './format';

export function buildArticleContent(locale: Locale, copy: ArticleCopy): ArticleContent[] {
  const f = createFormatter(locale);

  return [
    ...copy.intro.map((content): ArticleContent => ({ blockType: blockType.text, content })),
    { blockType: blockType.heading, content: copy.data.heading },
    { blockType: blockType.text, content: copy.data.coverage(f) },
    { blockType: blockType.text, content: copy.data.records },
    { blockType: blockType.heading, content: copy.concentration.heading },
    { blockType: blockType.text, content: copy.concentration.opening(f) },
    {
      blockType: blockType.compare,
      caption: copy.concentration.namesCaption,
      left: { label: copy.concentration.earlyLabel, value: f.percent(figures.topTenNames2008, 2) },
      right: { label: copy.concentration.recentLabel, value: f.percent(figures.topTenNames2026, 2), highlighted: true },
    },
    {
      blockType: blockType.compare,
      caption: copy.concentration.surnamesCaption,
      left: { label: copy.concentration.earlyLabel, value: f.percent(figures.topTenSurnames2008, 2) },
      right: { label: copy.concentration.recentLabel, value: f.percent(figures.topTenSurnames2026, 2), highlighted: true },
    },
    { blockType: blockType.text, content: copy.concentration.conclusion },
    { blockType: blockType.heading, content: copy.turnover.heading },
    { blockType: blockType.text, content: copy.turnover.opening },
    {
      blockType: blockType.dataTable,
      caption: copy.turnover.tableCaption,
      columns: ['', 'Top 20', 'Top 100'],
      rows: [
        [copy.turnover.namesLabel, figures.topTwentyNamesRetained, figures.topHundredNamesRetained],
        [copy.turnover.surnamesLabel, figures.topTwentySurnamesRetained, figures.topHundredSurnamesRetained],
      ],
    },
    { blockType: blockType.text, content: copy.turnover.conclusion(f) },
    { blockType: blockType.heading, content: copy.trajectories.heading },
    { blockType: blockType.text, content: copy.trajectories.nora(f) },
    { blockType: blockType.text, content: copy.trajectories.otherNames(f) },
    { blockType: blockType.text, content: copy.trajectories.continuity },
    { blockType: blockType.heading, content: copy.culture.heading },
    { blockType: blockType.text, content: copy.culture.repertoire },
    { blockType: blockType.text, content: copy.culture.legal },
    { blockType: blockType.text, content: copy.culture.coexistence },
    { blockType: blockType.heading, content: copy.conclusion.heading },
    { blockType: blockType.text, content: copy.conclusion.summary },
    { blockType: blockType.text, content: copy.conclusion.method(f) },
    { blockType: blockType.hilightedText, content: copy.conclusion.closing },
  ];
}
