import type { Locale } from '@/app/types/locale';
import { blockType, type ArticleContent } from '../../../types/article.types';
import { createFormatter } from '../shared/format';
import type { ArticleCopy, StoryKind } from './copy.types';
import {
  aneCount,
  companyLeaders2026,
  editions,
  eustatRanks,
  externalSources,
  figures,
  leaders,
  milestoneRows,
  noraCompanies,
  noraCount,
  noraPerCompany,
  type LeaderCell,
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

  const leaderCell = (cell: LeaderCell): string => {
    if (cell === 'many') {
      return data.persistence.many;
    }

    if (cell.length === 1) {
      return cell[0];
    }

    const names = `${cell.slice(0, -1).join(', ')} ${data.persistence.and} ${cell[cell.length - 1]}`;
    return `${names} ${data.persistence.tie}`;
  };

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

    pieceTitle(data.rise.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [
        series('nora', data.rise.noraLabel, noraCount),
        series('ane', data.rise.aneLabel, aneCount),
      ],
    },

    pieceTitle(data.milestones.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.milestones.columns],
      rows: milestoneRows.map(({ edition, rank, count, companies, registered }) => [
        edition,
        rank,
        count,
        data.milestones.companiesCell(companies, registered),
      ]),
    },

    pieceTitle(data.leaders.lede),
    {
      blockType: blockType.horizontalBarChart,
      unit: data.leaders.barUnit,
      items: companyLeaders2026.map(({ company, name, value, nora }) => ({
        label: `${company} · ${name}`,
        value,
        highlighted: nora,
      })),
    },

    pieceTitle(data.position.lede(f)),
    {
      blockType: blockType.distributionChart,
      buckets: [
        { label: data.position.first, value: figures.noraRankBuckets.first, highlighted: true },
        { label: data.position.secondThird, value: figures.noraRankBuckets.second3 },
        { label: data.position.fourthToTenth, value: figures.noraRankBuckets.fourTo10 },
        { label: data.position.eleventhOrLower, value: figures.noraRankBuckets.eleven },
        { label: data.position.none, value: figures.noraRankBuckets.none },
      ],
    },

    pieceTitle(data.waffles.lede),
    {
      blockType: blockType.waffleChart,
      filled: figures.y2008.companiesWithNora,
      total: figures.y2008.companies,
      columns: 11,
      label: data.waffles.label2008(f),
    },
    {
      blockType: blockType.waffleChart,
      filled: figures.y2026.companiesWithNora,
      total: figures.y2026.companies,
      columns: 11,
      label: data.waffles.label2026(f),
    },

    pieceTitle(data.spread.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [series('companies', data.spread.label, noraCompanies)],
    },

    pieceTitle(data.perCompany.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [series('perCompany', data.perCompany.label, noraPerCompany)],
    },

    pieceTitle(data.persistence.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.persistence.columns],
      rows: leaders.map(({ company, cells }) => [company, ...cells.map(leaderCell)]),
    },

    pieceTitle(data.overlap.lede),
    {
      blockType: blockType.compare,
      left: {
        label: data.overlap.leftLabel,
        value: data.overlap.value(f.decimal(figures.top10Overlap.shuffled, 1)),
      },
      right: {
        label: data.overlap.rightLabel,
        value: data.overlap.value(f.decimal(figures.top10Overlap.real, 1)),
        highlighted: true,
      },
    },

    pieceTitle(data.eustat.lede),
    {
      blockType: blockType.dataTable,
      columns: [...data.eustat.columns],
      rows: eustatRanks.map(({ year, euskadi, gipuzkoa, donostia }) => [
        year,
        euskadi,
        gipuzkoa,
        donostia,
      ]),
    },

    // Last section of the article.
    { blockType: blockType.heading, content: used.heading },
    ...used.blocks.map((text): ArticleContent => ({ blockType: blockType.text, content: text(f) })),
    { blockType: blockType.text, content: used.sourcesLead },
    { blockType: blockType.sources, items: externalSources },
  ];
}
