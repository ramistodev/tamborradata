import type { Locale } from '@/app/types/locale';
import { blockType, type ArticleContent } from '../../../types/article.types';
import type { ArticleCopy, StoryKind } from './copy.types';
import {
  arrivals,
  chartEditions,
  expectedDistinctNames,
  figures,
  pairOneIn,
  topNames2008,
  topNames2026,
  topTenShare,
  topTenTotal,
} from './figures';
import { createFormatter } from './format';

const storyBlockType = {
  heading: blockType.heading,
  text: blockType.text,
  highlight: blockType.hilightedText,
} as const satisfies Record<StoryKind, string>;

const evolution = (id: string, label: string, values: readonly number[]) => ({
  id,
  label,
  points: chartEditions.map((x, index) => ({ x, y: values[index] })),
});

const signed = (value: number) => `${value < 0 ? '−' : value > 0 ? '+' : ''}${Math.abs(value)}`;

export function buildArticleContent(locale: Locale, copy: ArticleCopy): ArticleContent[] {
  const f = createFormatter(locale);
  const { data, used } = copy;
  // Each data piece opens with a bold title and a plain sentence (a `text` block, so no extra H2).
  const pieceTitle = (content: string): ArticleContent => ({ blockType: blockType.text, content });

  const rankingRows = topNames2008.map((early, index) => {
    const recent = topNames2026[index];
    return [
      String(index + 1),
      early.name,
      early.count,
      recent.name,
      recent.count,
      signed(recent.count - early.count),
    ];
  });

  return [
    // Layer 1: the story, in full and with no charts, tables or methodology.
    ...copy.story.map(
      ({ kind, text }): ArticleContent => ({
        blockType: storyBlockType[kind],
        content: text(f),
      })
    ),

    // Layer 2: the story in data.
    { blockType: blockType.heading, content: data.heading },

    // 1. The Top 10 gathers fewer participants than in 2008, in a bigger edition.
    pieceTitle(data.ranking.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [
        {
          id: 'ranking2008',
          label: data.ranking.seriesLabel2008,
          points: topNames2008.map(({ count }, index) => ({ x: index + 1, y: count })),
        },
        {
          id: 'ranking2026',
          label: data.ranking.seriesLabel2026,
          points: topNames2026.map(({ count }, index) => ({ x: index + 1, y: count })),
        },
      ],
    },
    {
      blockType: blockType.dataTable,
      columns: [...data.ranking.columns],
      rows: [
        ...rankingRows,
        [
          data.ranking.totalLabel,
          '',
          topTenTotal.y2008,
          '',
          topTenTotal.y2026,
          signed(topTenTotal.y2026 - topTenTotal.y2008),
        ],
      ],
    },

    // 2. Weight of the Top 10 over time.
    pieceTitle(data.topTen.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [evolution('topTenShare', data.topTen.seriesLabel, topTenShare)],
    },

    // 3. Probability of sharing a first name.
    pieceTitle(data.pairs.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [evolution('pairOneIn', data.pairs.seriesLabel, pairOneIn)],
    },

    // 4. Same sample size, more distinct names; same 35 schools, more distinct names.
    pieceTitle(data.distinct.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [evolution('expectedDistinct', data.distinct.seriesLabel, expectedDistinctNames)],
    },
    {
      blockType: blockType.compare,
      caption: data.distinct.compareCaption(f),
      left: {
        label: '2023',
        value: data.distinct.left.value(f),
        description: data.distinct.left.description(f),
      },
      right: {
        label: '2026',
        value: data.distinct.right.value(f),
        description: data.distinct.right.description(f),
        highlighted: true,
      },
    },

    // 5. Uncommon names.
    pieceTitle(data.uncommon.lede(f)),
    {
      blockType: blockType.compare,
      left: {
        label: '2008',
        value: data.uncommon.left.value(f),
        description: data.uncommon.left.description(f),
      },
      right: {
        label: '2026',
        value: data.uncommon.right.value(f),
        description: data.uncommon.right.description(f),
        highlighted: true,
      },
    },

    // 6. Classics and newcomers.
    pieceTitle(data.classics.lede(f)),
    {
      blockType: blockType.dataTable,
      columns: [...data.classics.columns],
      rows: [
        ['María', figures.counts.maria.y2008, figures.counts.maria.y2026],
        ['Leire', figures.counts.leire.y2008, figures.counts.leire.y2026],
        ...arrivals.map(({ name, count2026 }) => [name, data.classics.lessThanFive, count2026]),
      ],
    },

    // 7. Names that were not in any published edition between 2008 and 2016.
    pieceTitle(data.unseen.lede(f)),
    {
      blockType: blockType.waffleChart,
      filled: Math.round(figures.unseen2026.share),
      total: 100,
      columns: 10,
      label: data.unseen.waffleLabel(f),
    },

    // Last section of the article. No external sources, so no `sources` block.
    { blockType: blockType.heading, content: used.heading },
    ...used.blocks.map((text): ArticleContent => ({ blockType: blockType.text, content: text(f) })),
  ];
}
