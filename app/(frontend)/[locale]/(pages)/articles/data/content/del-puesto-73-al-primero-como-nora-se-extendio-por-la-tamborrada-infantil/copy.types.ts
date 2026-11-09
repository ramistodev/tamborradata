import type { Formatter } from '../shared/format';

type Text = (f: Formatter) => string;

export type StoryKind = 'heading' | 'text' | 'highlight';

export interface StoryItem {
  kind: StoryKind;
  text: Text;
}

export interface ArticleCopy {
  story: StoryItem[];
  data: {
    heading: string;
    rise: {
      lede: Text;
      noraLabel: string;
      aneLabel: string;
    };
    milestones: {
      lede: string;
      columns: [string, string, string, string];
      companiesCell: (withNora: number, registered: number) => string;
    };
    waffles: {
      lede: string;
      label2008: Text;
      label2026: Text;
    };
    spread: {
      lede: Text;
      label: string;
    };
    perCompany: {
      lede: Text;
      label: string;
    };
    leaders: {
      lede: string;
      barUnit: string;
    };
    position: {
      lede: Text;
      first: string;
      secondThird: string;
      fourthToTenth: string;
      eleventhOrLower: string;
      none: string;
    };
    persistence: {
      lede: string;
      columns: [string, string, string, string, string];
      and: string;
      tie: string;
      many: string;
    };
    overlap: {
      lede: string;
      leftLabel: string;
      rightLabel: string;
      value: (shared: string) => string;
    };
    eustat: {
      lede: string;
      columns: [string, string, string, string];
    };
  };
  used: {
    heading: string;
    blocks: Text[];
    sourcesLead: string;
  };
}
