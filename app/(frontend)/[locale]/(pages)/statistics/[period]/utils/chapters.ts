/** Id of the hero section: the first "chapter" of the nav, always present. */
export const OVERVIEW_CHAPTER_ID = 'overview';

// Order of the chapters in the page. Each id is a family name, and the chapter's section must use
// it as its `id`. A family that is not listed here gets no chapter.
export const CHAPTER_ORDER = [
  'participationDynamics',
  'names',
  'surnames',
  'identityDiversity',
  'schools',
  'schoolsRenewal',
  'schoolsEvolution',
] as const;
