import type { StepStatus } from '../../../types/article.types';
import type { Formatter } from '../shared/format';

type Text = (f: Formatter) => string;

export interface CopyStep {
  title: string;
  description?: string;
  status?: StepStatus;
  statusLabel?: string;
}

export interface ArticleCopy {
  intro: {
    simple: string;
    hands: string;
    questionLabel: string;
    question: string;
    problemsCaption: string;
    problems: string[];
    promise: string;
  };
  names: {
    heading: string;
    person: string;
    personCaption: string;
    givenLabel: string;
    surnameLabel: string;
    program: string;
    programCaption: string;
    unknownLabel: string;
    trouble: Text;
    counting: Text;
    nlp: string;
    tableCaption: string;
    wordColumn: string;
    asGivenColumn: string;
    asSurnameColumn: string;
    firstColumn: string;
    middleColumn: string;
    lastColumn: string;
    reading: Text;
    humility: string;
    decision: Text;
    recordIntro: string;
    recordCaption: string;
    fieldColumn: string;
    valueColumn: string;
    primaryNameField: string;
    namesField: string;
    surnamesField: string;
    confidenceField: string;
    statusField: string;
    statusResolved: string;
    secondNames: Text;
    ambiguous: Text;
    limit: string;
  };
  schools: {
    heading: string;
    problem: string;
    groupsCaption: string;
    formsLabel: (f: Formatter, count: number) => string;
    how: string;
    dictionary: string;
    limits: string;
    figures: Text;
  };
  journey: {
    heading: string;
    intro: string;
    caption: string;
    steps: CopyStep[];
    canary: Text;
  };
  statistics: {
    heading: string;
    categories: Text;
    ripple: string;
    reuse: string;
    blanks: Text;
  };
  publication: {
    heading: string;
    problem: string;
    unsafeCaption: string;
    unsafeSteps: CopyStep[];
    safeCaption: string;
    safeSteps: CopyStep[];
    analogy: string;
    verified: string;
    web: string;
    limits: string;
    figures: Text;
  };
  ai: {
    heading: string;
    problem: string;
    how: Text;
    placeholders: string;
    benefits: string;
    translations: string;
    limits: string;
    glitches: string;
    failure: string;
    figures: Text;
  };
  quality: {
    heading: string;
    intro: string;
    tableCaption: string;
    indicatorColumn: string;
    valueColumn: string;
    participantsRow: string;
    editionsRow: string;
    schoolsRow: string;
    pagesRow: string;
    resolvedRow: string;
    ambiguousRow: string;
    compareCaption: string;
    resolvedLabel: string;
    resolvedDescription: Text;
    checkedLabel: string;
    checkedValue: string;
    checkedDescription: string;
    confusion: string;
    coverage: Text;
    dirty: string;
    duplicates: Text;
    integrity: string;
    closing: string;
  };
  conclusion: {
    heading: string;
    summary: string;
    twoUses: string;
    closing: string;
  };
}
