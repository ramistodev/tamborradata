import type { Locale } from '@/app/types/locale';
import {
  blockType,
  chipTone,
  tokenRole,
  type ArticleContent,
} from '../../../types/article.types';
import { createFormatter } from '../shared/format';
import type { ArticleCopy } from './copy.types';
import {
  ambiguousShare,
  evidenceRows,
  exampleConfidence,
  exampleRecord,
  figures,
  resolvedShare,
  variantGroups,
} from './figures';

const EXAMPLE_WORDS = ['Aitor', 'Goikoetxea', 'Lasa'] as const;

export function buildArticleContent(locale: Locale, copy: ArticleCopy): ArticleContent[] {
  const f = createFormatter(locale);

  return [
    { blockType: blockType.text, content: copy.intro.simple },
    { blockType: blockType.text, content: copy.intro.hands },
    {
      blockType: blockType.hilightedText,
      caption: copy.intro.questionLabel,
      content: copy.intro.question,
    },
    {
      blockType: blockType.chipList,
      caption: copy.intro.problemsCaption,
      tone: chipTone.neutral,
      items: copy.intro.problems.map((label) => ({ label })),
    },
    { blockType: blockType.text, content: copy.intro.promise },

    { blockType: blockType.heading, content: copy.names.heading },
    { blockType: blockType.text, content: copy.names.person },
    {
      blockType: blockType.tokenBreakdown,
      caption: copy.names.personCaption,
      tokens: [
        { text: EXAMPLE_WORDS[0], role: tokenRole.given, label: copy.names.givenLabel },
        { text: EXAMPLE_WORDS[1], role: tokenRole.surname, label: copy.names.surnameLabel },
        { text: EXAMPLE_WORDS[2], role: tokenRole.surname, label: copy.names.surnameLabel },
      ],
    },
    { blockType: blockType.text, content: copy.names.program },
    {
      blockType: blockType.tokenBreakdown,
      caption: copy.names.programCaption,
      tokens: EXAMPLE_WORDS.map((text) => ({
        text,
        role: tokenRole.unknown,
        label: copy.names.unknownLabel,
      })),
    },
    { blockType: blockType.text, content: copy.names.trouble(f) },
    { blockType: blockType.text, content: copy.names.counting(f) },
    { blockType: blockType.text, content: copy.names.nlp },
    {
      blockType: blockType.dataTable,
      caption: copy.names.tableCaption,
      columns: [
        copy.names.wordColumn,
        copy.names.asGivenColumn,
        copy.names.asSurnameColumn,
        copy.names.firstColumn,
        copy.names.middleColumn,
        copy.names.lastColumn,
      ],
      rows: evidenceRows.map(({ word, asName, asSurname, first, middle, last }) => [
        word,
        asName,
        asSurname,
        first,
        middle,
        last,
      ]),
    },
    { blockType: blockType.text, content: copy.names.reading(f) },
    { blockType: blockType.text, content: copy.names.humility },
    { blockType: blockType.text, content: copy.names.decision(f) },
    { blockType: blockType.text, content: copy.names.recordIntro },
    {
      blockType: blockType.dataTable,
      caption: copy.names.recordCaption,
      columns: [copy.names.fieldColumn, copy.names.valueColumn],
      rows: [
        [copy.names.primaryNameField, exampleRecord.primaryName],
        [copy.names.namesField, exampleRecord.names.join(', ')],
        [copy.names.surnamesField, exampleRecord.surnames.join(', ')],
        [copy.names.confidenceField, f.decimal(exampleConfidence, 2)],
        [copy.names.statusField, copy.names.statusResolved],
      ],
    },
    { blockType: blockType.text, content: copy.names.secondNames(f) },
    { blockType: blockType.text, content: copy.names.ambiguous(f) },
    { blockType: blockType.text, content: copy.names.limit },

    { blockType: blockType.heading, content: copy.schools.heading },
    { blockType: blockType.text, content: copy.schools.problem },
    {
      blockType: blockType.variantGroups,
      caption: copy.schools.groupsCaption,
      groups: variantGroups.map(({ name, variants }) => ({
        name,
        countLabel: copy.schools.formsLabel(f, variants.length),
        variants: [...variants],
      })),
    },
    { blockType: blockType.text, content: copy.schools.how },
    { blockType: blockType.text, content: copy.schools.dictionary },
    { blockType: blockType.text, content: copy.schools.limits },
    { blockType: blockType.text, content: copy.schools.figures(f) },

    { blockType: blockType.heading, content: copy.journey.heading },
    { blockType: blockType.text, content: copy.journey.intro },
    {
      blockType: blockType.steps,
      caption: copy.journey.caption,
      steps: copy.journey.steps,
    },
    { blockType: blockType.text, content: copy.journey.canary(f) },

    { blockType: blockType.heading, content: copy.statistics.heading },
    { blockType: blockType.text, content: copy.statistics.categories(f) },
    { blockType: blockType.text, content: copy.statistics.ripple },
    { blockType: blockType.text, content: copy.statistics.reuse },
    { blockType: blockType.text, content: copy.statistics.blanks(f) },

    { blockType: blockType.heading, content: copy.publication.heading },
    { blockType: blockType.text, content: copy.publication.problem },
    {
      blockType: blockType.steps,
      caption: copy.publication.unsafeCaption,
      steps: copy.publication.unsafeSteps,
    },
    {
      blockType: blockType.steps,
      caption: copy.publication.safeCaption,
      steps: copy.publication.safeSteps,
    },
    { blockType: blockType.text, content: copy.publication.analogy },
    { blockType: blockType.text, content: copy.publication.verified },
    { blockType: blockType.text, content: copy.publication.web },
    { blockType: blockType.text, content: copy.publication.limits },
    { blockType: blockType.text, content: copy.publication.figures(f) },

    { blockType: blockType.heading, content: copy.ai.heading },
    { blockType: blockType.text, content: copy.ai.problem },
    { blockType: blockType.text, content: copy.ai.how(f) },
    { blockType: blockType.text, content: copy.ai.placeholders },
    { blockType: blockType.text, content: copy.ai.benefits },
    { blockType: blockType.text, content: copy.ai.translations },
    { blockType: blockType.text, content: copy.ai.limits },
    { blockType: blockType.text, content: copy.ai.glitches },
    { blockType: blockType.text, content: copy.ai.failure },
    { blockType: blockType.text, content: copy.ai.figures(f) },

    { blockType: blockType.heading, content: copy.quality.heading },
    { blockType: blockType.text, content: copy.quality.intro },
    {
      blockType: blockType.dataTable,
      caption: copy.quality.tableCaption,
      columns: [copy.quality.indicatorColumn, copy.quality.valueColumn],
      rows: [
        [copy.quality.participantsRow, f.int(figures.participants)],
        [
          copy.quality.editionsRow,
          `${f.int(figures.editions)} (${figures.firstEdition}–${figures.lastEdition})`,
        ],
        [copy.quality.schoolsRow, f.int(figures.schools)],
        [copy.quality.pagesRow, f.int(figures.sourcePages)],
        [
          copy.quality.resolvedRow,
          `${f.int(figures.resolved)} (${f.percent(resolvedShare, 2)})`,
        ],
        [
          copy.quality.ambiguousRow,
          `${f.int(figures.ambiguous)} (${f.percent(ambiguousShare, 2)})`,
        ],
      ],
    },
    {
      blockType: blockType.compare,
      caption: copy.quality.compareCaption,
      left: {
        label: copy.quality.resolvedLabel,
        value: f.percent(resolvedShare, 2),
        description: copy.quality.resolvedDescription(f),
      },
      right: {
        label: copy.quality.checkedLabel,
        value: copy.quality.checkedValue,
        description: copy.quality.checkedDescription,
        highlighted: true,
      },
    },
    { blockType: blockType.text, content: copy.quality.confusion },
    { blockType: blockType.text, content: copy.quality.coverage(f) },
    { blockType: blockType.text, content: copy.quality.dirty },
    { blockType: blockType.text, content: copy.quality.duplicates(f) },
    { blockType: blockType.text, content: copy.quality.integrity },
    { blockType: blockType.text, content: copy.quality.closing },

    { blockType: blockType.heading, content: copy.conclusion.heading },
    { blockType: blockType.text, content: copy.conclusion.summary },
    { blockType: blockType.text, content: copy.conclusion.twoUses },
    { blockType: blockType.hilightedText, content: copy.conclusion.closing },
  ];
}
