import type { Locale } from '@/app/types/locale';
import { blockType, chipTone, type ArticleContent } from '../../../types/article.types';
import type { ArticleCopy } from './copy.types';
import {
  aneShare,
  arrivals,
  chartEditions,
  coreShare,
  currentTopTwentyShare,
  figures,
  jonShare,
  nameCounts,
  namedParticipants,
  noraHistory,
  noraShare,
  oldTopTwentyShare,
  sampledDistinctNames,
  topTenShare,
  topTenStaying,
  type ByEdition,
} from './figures';
import { createFormatter } from './format';

function shareToPoints(values: ByEdition) {
  return chartEditions.map((year) => ({ x: year, y: values[year] }));
}

function perThousandPoints(counts: ByEdition) {
  return chartEditions.map((year) => ({
    x: year,
    y: Math.round((counts[year] * 10000) / namedParticipants[year]) / 10,
  }));
}

export function buildArticleContent(locale: Locale, copy: ArticleCopy): ArticleContent[] {
  const f = createFormatter(locale);

  return [
    { blockType: blockType.text, content: copy.intro.lead },
    { blockType: blockType.text, content: copy.intro.moreNames },
    { blockType: blockType.text, content: copy.intro.topWeighs },
    { blockType: blockType.text, content: copy.intro.classics },
    { blockType: blockType.text, content: copy.intro.newNames },
    { blockType: blockType.text, content: copy.intro.stable },
    {
      blockType: blockType.hilightedText,
      caption: copy.intro.summaryLabel,
      content: copy.intro.summary,
    },

    { blockType: blockType.heading, content: copy.data.heading },
    { blockType: blockType.text, content: copy.data.coverage(f) },
    { blockType: blockType.text, content: copy.data.caveats(f) },
    { blockType: blockType.text, content: copy.data.partial(f) },

    { blockType: blockType.heading, content: copy.concentration.heading },
    { blockType: blockType.text, content: copy.concentration.question(f) },
    {
      blockType: blockType.compare,
      caption: copy.concentration.pairCaption,
      left: {
        label: String(figures.firstEdition),
        value: copy.concentration.pairValue(f, figures.pairOneIn2008),
        description: copy.concentration.pairDescription,
      },
      right: {
        label: String(figures.lastEdition),
        value: copy.concentration.pairValue(f, figures.pairOneIn2026),
        description: copy.concentration.pairDescription,
        highlighted: true,
      },
    },
    { blockType: blockType.text, content: copy.concentration.conclusion(f) },

    { blockType: blockType.heading, content: copy.variety.heading },
    { blockType: blockType.text, content: copy.variety.trap(f) },
    { blockType: blockType.text, content: copy.variety.sample(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.variety.chartCaption(f),
      series: [
        {
          id: 'sampled-distinct',
          label: copy.variety.chartLabel,
          points: shareToPoints(sampledDistinctNames),
        },
      ],
    },
    { blockType: blockType.text, content: copy.variety.panel(f) },
    { blockType: blockType.text, content: copy.variety.conclusion },

    { blockType: blockType.heading, content: copy.top.heading },
    { blockType: blockType.text, content: copy.top.lead(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.top.chartCaption,
      series: [
        {
          id: 'top-ten',
          label: copy.top.chartLabel,
          points: shareToPoints(topTenShare),
        },
      ],
    },
    {
      blockType: blockType.hilightedText,
      caption: copy.top.paradoxLabel,
      content: copy.top.paradox(f),
    },

    { blockType: blockType.heading, content: copy.classics.heading },
    { blockType: blockType.text, content: copy.classics.fading(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.classics.chartCaption,
      series: [
        {
          id: 'old-top-twenty',
          label: copy.classics.oldLabel,
          points: shareToPoints(oldTopTwentyShare),
        },
        {
          id: 'current-top-twenty',
          label: copy.classics.currentLabel,
          points: shareToPoints(currentTopTwentyShare),
        },
      ],
    },
    { blockType: blockType.text, content: copy.classics.spread(f) },
    { blockType: blockType.text, content: copy.classics.individual(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.classics.trajectoriesCaption,
      series: [
        { id: 'maria', label: 'María', points: perThousandPoints(nameCounts.maria) },
        { id: 'leire', label: 'Leire', points: perThousandPoints(nameCounts.leire) },
        { id: 'inaki', label: 'Iñaki', points: perThousandPoints(nameCounts.inaki) },
        { id: 'martina', label: 'Martina', points: perThousandPoints(nameCounts.martina) },
        { id: 'laia', label: 'Laia', points: perThousandPoints(nameCounts.laia) },
      ],
    },
    { blockType: blockType.text, content: copy.classics.conclusion },

    { blockType: blockType.heading, content: copy.arrivals.heading },
    { blockType: blockType.text, content: copy.arrivals.intro(f) },
    {
      blockType: blockType.dataTable,
      caption: copy.arrivals.tableCaption(f),
      columns: [copy.arrivals.nameColumn, '2013', '2026'],
      rows: arrivals.map(({ name, in2013, in2026 }) => [name, in2013, in2026]),
    },
    { blockType: blockType.text, content: copy.arrivals.renewal(f) },
    {
      blockType: blockType.waffleChart,
      caption: copy.arrivals.waffleCaption(f),
      filled: Math.round(figures.unseenShare2026),
      total: 100,
      columns: 10,
      label: copy.arrivals.waffleLabel,
    },
    { blockType: blockType.text, content: copy.arrivals.conclusion },

    { blockType: blockType.heading, content: copy.repertoire.heading },
    { blockType: blockType.text, content: copy.repertoire.core(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.repertoire.chartCaption(f),
      series: [
        {
          id: 'core-names',
          label: copy.repertoire.chartLabel,
          points: shareToPoints(coreShare),
        },
      ],
    },
    { blockType: blockType.text, content: copy.repertoire.tail(f) },
    { blockType: blockType.text, content: copy.repertoire.conclusion },

    { blockType: blockType.heading, content: copy.staying.heading },
    { blockType: blockType.text, content: copy.staying.top(f) },
    {
      blockType: blockType.chipList,
      caption: copy.staying.chipsCaption(f),
      tone: chipTone.neutral,
      items: topTenStaying.map(({ name, editions }) => ({
        label: name,
        value: `${editions}/${figures.editionCount}`,
      })),
    },
    { blockType: blockType.text, content: copy.staying.overlap(f) },

    { blockType: blockType.heading, content: copy.nora.heading },
    { blockType: blockType.text, content: copy.nora.opening(f) },
    {
      blockType: blockType.seriesChart,
      caption: copy.nora.chartCaption(f),
      series: [
        { id: 'nora', label: 'Nora', points: shareToPoints(noraShare) },
        { id: 'ane', label: 'Ane', points: shareToPoints(aneShare) },
        { id: 'jon', label: 'Jon', points: shareToPoints(jonShare) },
      ],
    },
    { blockType: blockType.text, content: copy.nora.rise(f) },
    {
      blockType: blockType.dataTable,
      caption: copy.nora.tableCaption,
      columns: [
        copy.nora.editionColumn,
        copy.nora.participantsColumn,
        copy.nora.shareColumn,
        copy.nora.positionColumn,
      ],
      rows: noraHistory.map(({ year, count, share, position }) => [
        String(year),
        count,
        f.percent(share, 2),
        position,
      ]),
    },
    { blockType: blockType.text, content: copy.nora.nuance(f) },
    { blockType: blockType.text, content: copy.nora.conclusion },

    { blockType: blockType.heading, content: copy.limits.heading },
    { blockType: blockType.text, content: copy.limits.shows(f) },
    { blockType: blockType.text, content: copy.limits.doesNot(f) },

    { blockType: blockType.heading, content: copy.conclusion.heading },
    { blockType: blockType.text, content: copy.conclusion.summary(f) },
    { blockType: blockType.text, content: copy.conclusion.synthesis },
    { blockType: blockType.hilightedText, content: copy.conclusion.closing },
  ];
}
