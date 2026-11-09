import type { Locale } from '@/app/types/locale';
import { blockType, chipTone, type ArticleContent } from '../../../types/article.types';
import { createFormatter } from '../shared/format';
import type { ArticleCopy, StoryKind } from './copy.types';
import {
  basqueNamesStrict,
  basqueShare,
  editions,
  externalSources,
  figures,
  highlightedNames,
  overlapNames,
  overlapSurnames,
  perThousand,
  surnameRanks,
  topNames2008,
  topNames2026,
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

const barItems = (items: readonly { label: string; value: number }[]) =>
  items.map(({ label, value }) => ({
    label,
    value,
    highlighted: (highlightedNames as readonly string[]).includes(label),
  }));

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

    pieceTitle(data.names.lede),
    { blockType: blockType.horizontalBarChart, caption: data.names.label2008, items: barItems(topNames2008) },
    { blockType: blockType.horizontalBarChart, caption: data.names.label2026, items: barItems(topNames2026) },

    pieceTitle(data.overlap.lede),
    {
      blockType: blockType.seriesChart,
      series: [
        series('overlapNames', data.overlap.namesLabel, overlapNames),
        series('overlapSurnames', data.overlap.surnamesLabel, overlapSurnames),
      ],
    },

    pieceTitle(data.surnames.lede),
    {
      blockType: blockType.dataTable,
      columns: [
        data.surnames.surnameColumn,
        data.surnames.tamborrada2008Column,
        data.surnames.tamborrada2026Column,
        data.surnames.gipuzkoaColumn,
      ],
      rows: surnameRanks.map(({ surname, y2008, y2026, gipuzkoa }) => [
        surname,
        y2008,
        y2026,
        gipuzkoa,
      ]),
    },

    pieceTitle(data.perThousand.lede(f)),
    {
      blockType: blockType.seriesChart,
      series: [
        series('nora', data.perThousand.noraLabel, perThousand.nora),
        series('telmo', data.perThousand.telmoLabel, perThousand.telmo),
        series('maria', data.perThousand.mariaLabel, perThousand.maria),
        series('ane', data.perThousand.aneLabel, perThousand.ane),
      ],
    },

    pieceTitle(data.compare.lede),
    {
      blockType: blockType.compare,
      left: {
        label: data.compare.leftLabel,
        value: data.compare.value(
          figures.basqueTop10.names.y2008,
          figures.basqueTop10.names.y2026
        ),
      },
      right: {
        label: data.compare.rightLabel,
        value: data.compare.value(
          figures.basqueTop10.surnames.y2008,
          figures.basqueTop10.surnames.y2026
        ),
        highlighted: true,
      },
    },

    pieceTitle(data.basque.lede),
    {
      blockType: blockType.seriesChart,
      series: [
        series('basqueStrict', data.basque.strictLabel, basqueShare.strict),
        series('basqueRestrictive', data.basque.restrictiveLabel, basqueShare.restrictive),
        series('basqueBroad', data.basque.broadLabel, basqueShare.broad),
      ],
    },
    {
      blockType: blockType.chipList,
      caption: data.basque.chipsCaption,
      tone: chipTone.neutral,
      items: basqueNamesStrict.map((label) => ({ label })),
    },

    // Last section of the article.
    { blockType: blockType.heading, content: used.heading },
    ...used.blocks.map((text): ArticleContent => ({ blockType: blockType.text, content: text(f) })),
    { blockType: blockType.text, content: used.sourcesLead },
    {
      blockType: blockType.sources,
      items: externalSources.map(({ noteId, ...source }) => ({
        ...source,
        ...(noteId && { note: used.sourceNotes[noteId] }),
      })),
    },
  ];
}
