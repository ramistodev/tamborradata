import type { Locale } from '@/app/types/locale';
import { blockType, chipTone, type ArticleContent } from '../../../types/article.types';
import { createFormatter } from '../shared/format';
import type { ArticleCopy, StoryKind } from './copy.types';
import {
  ambiguous,
  companies,
  editions,
  externalSources,
  figures,
  identified,
  lowConfidencePct,
  officialComparison,
  officialGapPct,
  participations,
  residue,
  sharedNames,
  surnameRanks,
} from './figures';

const storyBlockType = {
  heading: blockType.heading,
  text: blockType.text,
  highlight: blockType.hilightedText,
} as const satisfies Record<StoryKind, string>;

const series = (id: string, label: string, values: readonly number[]) => ({
  id,
  label,
  points: editions.map((x, index) => ({ x, y: values[index] })),
});

export function buildArticleContent(locale: Locale, copy: ArticleCopy): ArticleContent[] {
  const f = createFormatter(locale);
  const { data, used } = copy;
  const pieceTitle = (content: string): ArticleContent => ({ blockType: blockType.text, content });

  return [
    // Layer 1: the story, in full and with no charts, tables or methodology.
    ...copy.story.map(
      ({ kind, text }): ArticleContent => ({
        blockType: storyBlockType[kind],
        content: text(f),
      })
    ),

    // Layer 2: the story in data. Each piece opens with a bold title (a `text` block, so no extra H2).
    { blockType: blockType.heading, content: data.heading },

    pieceTitle(data.surnames.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.surnames.columns],
      rows: surnameRanks.map(({ surname, y2026, gipuzkoa }) => [surname, y2026, gipuzkoa]),
    },

    pieceTitle(data.names.lede),
    {
      blockType: blockType.chipList,
      caption: data.names.caption,
      tone: chipTone.neutral,
      items: sharedNames.map((label) => ({ label })),
    },

    pieceTitle(data.official.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.official.columns],
      rows: officialComparison.map(
        ({ year, official, officialCentres, own, ownCompanies }, index) => [
          year,
          f.int(official),
          f.int(own),
          `${officialGapPct[index] > 0 ? '+' : ''}${f.decimal(officialGapPct[index], 1)} %`,
          officialCentres,
          ownCompanies,
        ]
      ),
    },

    pieceTitle(data.reconcile.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.reconcile.columns],
      rows: editions.map((edition, index) => [
        edition,
        f.int(participations[index]),
        f.int(identified[index]),
        f.int(participations[index] - identified[index]),
        f.int(ambiguous[index]),
      ]),
    },

    pieceTitle(data.residue.lede(f)),
    {
      blockType: blockType.dataTable,
      columns: [...data.residue.columns],
      rows: residue.map(({ id, value }) => [
        data.residue.rows[id],
        f.int(value),
        f.percent((value / figures.total) * 100, 1),
      ]),
    },

    pieceTitle(data.confidence.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [series('lowConfidence', data.confidence.label, lowConfidencePct)],
    },

    pieceTitle(data.coverage.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.coverage.columns],
      rows: data.coverage.rows.map(({ edition, detail }) => [
        edition,
        companies[editions.indexOf(edition)],
        detail(f),
      ]),
    },

    // Last section of the article.
    { blockType: blockType.heading, content: used.heading },
    ...used.blocks.map((text): ArticleContent => ({ blockType: blockType.text, content: text(f) })),
    { blockType: blockType.text, content: used.sourcesLead },
    { blockType: blockType.sources, items: externalSources },
  ];
}
