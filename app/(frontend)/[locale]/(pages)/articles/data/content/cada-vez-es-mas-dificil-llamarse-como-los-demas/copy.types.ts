import type { Formatter } from './format';

type Text = (f: Formatter) => string;

export interface ArticleCopy {
  intro: {
    lead: string;
    moreNames: string;
    topWeighs: string;
    classics: string;
    newNames: string;
    stable: string;
    summaryLabel: string;
    summary: string;
  };
  data: {
    heading: string;
    coverage: Text;
    caveats: Text;
    partial: Text;
  };
  concentration: {
    heading: string;
    question: Text;
    pairValue: (f: Formatter, oneIn: number) => string;
    pairDescription: string;
    pairCaption: string;
    conclusion: Text;
  };
  variety: {
    heading: string;
    trap: Text;
    sample: Text;
    chartLabel: string;
    chartCaption: Text;
    panel: Text;
    conclusion: string;
  };
  top: {
    heading: string;
    lead: Text;
    chartLabel: string;
    chartCaption: string;
    paradoxLabel: string;
    paradox: Text;
  };
  classics: {
    heading: string;
    fading: Text;
    oldLabel: string;
    currentLabel: string;
    chartCaption: string;
    spread: Text;
    individual: Text;
    trajectoriesCaption: string;
    conclusion: string;
  };
  arrivals: {
    heading: string;
    intro: Text;
    nameColumn: string;
    tableCaption: Text;
    renewal: Text;
    waffleLabel: string;
    waffleCaption: Text;
    conclusion: string;
  };
  repertoire: {
    heading: string;
    core: Text;
    chartLabel: string;
    chartCaption: Text;
    tail: Text;
    conclusion: string;
  };
  staying: {
    heading: string;
    top: Text;
    chipsCaption: Text;
    overlap: Text;
  };
  nora: {
    heading: string;
    opening: Text;
    chartCaption: Text;
    rise: Text;
    editionColumn: string;
    participantsColumn: string;
    shareColumn: string;
    positionColumn: string;
    tableCaption: string;
    nuance: Text;
    conclusion: string;
  };
  limits: {
    heading: string;
    shows: Text;
    doesNot: Text;
  };
  conclusion: {
    heading: string;
    summary: Text;
    synthesis: string;
    closing: string;
  };
}
