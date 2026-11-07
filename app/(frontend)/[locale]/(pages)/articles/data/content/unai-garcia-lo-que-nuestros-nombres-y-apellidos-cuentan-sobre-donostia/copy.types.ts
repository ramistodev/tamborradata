import type { Formatter } from './format';

type Text = (f: Formatter) => string;

export interface ArticleCopy {
  intro: string[];
  data: { heading: string; coverage: Text; records: string };
  concentration: {
    heading: string;
    opening: Text;
    namesCaption: string;
    surnamesCaption: string;
    earlyLabel: string;
    recentLabel: string;
    conclusion: string;
  };
  turnover: {
    heading: string;
    opening: string;
    tableCaption: string;
    namesLabel: string;
    surnamesLabel: string;
    conclusion: Text;
  };
  trajectories: { heading: string; nora: Text; otherNames: Text; continuity: string };
  culture: { heading: string; repertoire: string; legal: string; coexistence: string };
  conclusion: { heading: string; summary: string; method: Text; closing: string };
}
