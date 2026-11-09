import type { Formatter } from '../shared/format';
import type { SourceNoteId } from './figures';

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
    names: { lede: string; label2008: string; label2026: string };
    overlap: { lede: string; namesLabel: string; surnamesLabel: string };
    surnames: {
      lede: string;
      surnameColumn: string;
      tamborrada2008Column: string;
      tamborrada2026Column: string;
      gipuzkoaColumn: string;
    };
    perThousand: {
      lede: Text;
      noraLabel: string;
      telmoLabel: string;
      mariaLabel: string;
      aneLabel: string;
    };
    compare: {
      lede: string;
      leftLabel: string;
      rightLabel: string;
      value: (early: number, recent: number) => string;
    };
    basque: {
      lede: string;
      strictLabel: string;
      restrictiveLabel: string;
      broadLabel: string;
      chipsCaption: string;
    };
  };
  used: {
    heading: string;
    blocks: Text[];
    sourcesLead: string;
    sourceNotes: Record<SourceNoteId, string>;
  };
}
