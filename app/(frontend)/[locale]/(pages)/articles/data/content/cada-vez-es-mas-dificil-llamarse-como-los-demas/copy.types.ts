import type { Formatter } from './format';

type Text = (f: Formatter) => string;

export type StoryKind = 'heading' | 'text' | 'highlight';

export interface StoryItem {
  kind: StoryKind;
  text: Text;
}

interface CompareSideCopy {
  value: Text;
  description: Text;
}

export interface ArticleCopy {
  story: StoryItem[];
  data: {
    heading: string;
    ranking: {
      lede: Text;
      seriesLabel2008: string;
      seriesLabel2026: string;
      columns: [string, string, string, string, string, string];
      totalLabel: string;
    };
    topTen: { lede: Text; seriesLabel: string };
    pairs: { lede: Text; seriesLabel: string };
    distinct: {
      lede: Text;
      seriesLabel: string;
      compareCaption: Text;
      left: CompareSideCopy;
      right: CompareSideCopy;
    };
    uncommon: {
      lede: Text;
      left: CompareSideCopy;
      right: CompareSideCopy;
    };
    classics: {
      lede: Text;
      columns: [string, string, string];
      lessThanFive: string;
    };
    unseen: { lede: Text; waffleLabel: Text };
  };
  used: {
    heading: string;
    blocks: Text[];
  };
}
