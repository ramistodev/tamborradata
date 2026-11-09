import type { Formatter } from '../shared/format';
import type { ResidueId } from './figures';

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
    surnames: {
      lede: string;
      columns: [string, string, string];
    };
    names: {
      lede: string;
      caption: string;
    };
    official: {
      lede: string;
      columns: [string, string, string, string, string, string];
    };
    reconcile: {
      lede: string;
      columns: [string, string, string, string, string];
    };
    residue: {
      lede: Text;
      columns: [string, string, string];
      rows: Record<ResidueId, string>;
    };
    confidence: {
      lede: Text;
      label: string;
    };
    coverage: {
      lede: string;
      columns: [string, string, string];
      rows: { edition: '2011' | '2012' | '2022'; detail: Text }[];
    };
  };
  used: {
    heading: string;
    blocks: Text[];
    sourcesLead: string;
  };
}
