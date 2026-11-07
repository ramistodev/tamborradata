import type { ArticleId } from '../data/slugs';

export const blockType = {
  heading: 'heading',
  text: 'text',
  hilightedText: 'hilightedText',
  horizontalBarChart: 'horizontalBarChart',
  seriesChart: 'seriesChart',
  waffleChart: 'waffleChart',
  distributionChart: 'distributionChart',
  dataTable: 'dataTable',
  chipList: 'chipList',
  compare: 'compare',
  tokenBreakdown: 'tokenBreakdown',
  variantGroups: 'variantGroups',
  steps: 'steps',
} as const;

export type BlockType = (typeof blockType)[keyof typeof blockType];

export const chipTone = {
  neutral: 'neutral',
  positive: 'positive',
  negative: 'negative',
} as const;

export type ChipTone = (typeof chipTone)[keyof typeof chipTone];

export const tokenRole = {
  given: 'given',
  surname: 'surname',
  unknown: 'unknown',
} as const;

export type TokenRole = (typeof tokenRole)[keyof typeof tokenRole];

export const stepStatus = {
  neutral: 'neutral',
  success: 'success',
  danger: 'danger',
} as const;

export type StepStatus = (typeof stepStatus)[keyof typeof stepStatus];

interface BaseBlock {
  caption?: string;
  source?: string;
}

export interface HeadingBlock extends BaseBlock {
  blockType: typeof blockType.heading;
  content: string;
}

export interface TextBlock extends BaseBlock {
  blockType: typeof blockType.text;
  content: string;
}

export interface HilightedTextBlock extends BaseBlock {
  blockType: typeof blockType.hilightedText;
  content: string;
}

export interface HorizontalBarChartBlock extends BaseBlock {
  blockType: typeof blockType.horizontalBarChart;
  items: { label: string; value: number; highlighted?: boolean }[];
  unit?: string;
}

export interface SeriesChartBlock extends BaseBlock {
  blockType: typeof blockType.seriesChart;
  series: {
    id: string;
    label: string;
    points: { x: string | number; y: number }[];
  }[];
}

export interface WaffleChartBlock extends BaseBlock {
  blockType: typeof blockType.waffleChart;
  filled: number;
  total: number;
  columns: number;
  label?: string;
}

export interface DistributionChartBlock extends BaseBlock {
  blockType: typeof blockType.distributionChart;
  buckets: { label: string; value: number; highlighted?: boolean }[];
}

export interface DataTableBlock extends BaseBlock {
  blockType: typeof blockType.dataTable;
  columns: string[];
  rows: (string | number)[][];
}

export interface ChipListBlock extends BaseBlock {
  blockType: typeof blockType.chipList;
  items: { label: string; value?: string | number }[];
  tone?: ChipTone;
}

export interface CompareSide {
  label: string;
  value: string;
  description?: string;
  highlighted?: boolean;
}

export interface CompareBlock extends BaseBlock {
  blockType: typeof blockType.compare;
  left: CompareSide;
  right: CompareSide;
}

export interface TokenBreakdownBlock extends BaseBlock {
  blockType: typeof blockType.tokenBreakdown;
  tokens: { text: string; role: TokenRole; label: string }[];
}

export interface VariantGroupsBlock extends BaseBlock {
  blockType: typeof blockType.variantGroups;
  groups: { name: string; countLabel: string; variants: string[] }[];
}

export interface StepsBlock extends BaseBlock {
  blockType: typeof blockType.steps;
  steps: { title: string; description?: string; status?: StepStatus; statusLabel?: string }[];
}

export type ArticleContent =
  | HeadingBlock
  | TextBlock
  | HilightedTextBlock
  | HorizontalBarChartBlock
  | SeriesChartBlock
  | WaffleChartBlock
  | DistributionChartBlock
  | DataTableBlock
  | ChipListBlock
  | CompareBlock
  | TokenBreakdownBlock
  | VariantGroupsBlock
  | StepsBlock;

export interface ArticleBase {
  id: ArticleId;
  publishedAt: string;
  modifiedAt: string;
  hilighted?: boolean;
}

export interface ArticleTexts {
  title: string;
  description: string;
  category: string;
  readTime: string;
  articleContent?: ArticleContent[];
}

export interface Article extends ArticleBase, ArticleTexts {
  slug: string;
}
