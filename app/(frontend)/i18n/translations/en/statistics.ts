import type statistics from '../es/statistics';

export default {
  title: 'Statistics',
  period: {
    title: "Children's Tamborrada statistics {period}",
    description:
      "Analysis of the {period} Children's Tamborrada: participants, most common names, standout schools and yearly trends.",
  },
  chapters: {
    explore: 'Explore',
    ariaLabel: 'Explore the data',
    overview: 'Overview',
    participationDynamics: 'Participation',
    schools: 'Schools',
    schoolsRenewal: 'Renewal',
    schoolsEvolution: 'Evolution',
    names: 'Names',
    surnames: 'Surnames',
    identityDiversity: 'Diversity',
  },
  hero: {
    eyebrowYear: 'Yearly edition',
    eyebrowGlobal: 'Edition {period}',
    titleYear: "Children's Tamborrada {period}",
    titleGlobal: 'Complete history',
  },
  periodSelector: {
    missingEdition: 'No edition in {year}',
  },
  structuredData: {
    datasetDescription:
      '{description} Detailed dataset with participation, names, surnames and schools.',
    home: 'Home',
    statistics: 'Statistics by year',
    breadcrumbPeriod: "Children's Tamborrada {period}",
    namesQuestion: "What were the most common names in the Children's Tamborrada {period}?",
    namesAnswer:
      "Ranking of the most common names in the Children's Tamborrada {period}, with the ones leading the yearly ranking.",
    surnamesQuestion: "Which surnames stood out in the Children's Tamborrada {period}?",
    surnamesAnswer: 'List of the most frequent surnames recorded in the {period} edition.',
    schoolsQuestion: 'Which schools had the highest participation in {period}?',
    schoolsAnswer:
      "Schools with the largest presence in the Children's Tamborrada {period} and newly joined centres.",
    newNamesQuestion: "Were there new names in the Children's Tamborrada {period}?",
    newNamesAnswer: "Names that appear for the first time in the Children's Tamborrada {period}.",
    participantsQuestion: "How many participants were there in the Children's Tamborrada {period}?",
    participantsAnswer: 'Estimated total participation of child drummers and cantineras in {period}.',
    summaryQuestion: "Where can I see the summary of the Children's Tamborrada {period}?",
  },
  publishDates: {
    published: 'Published on {date}',
    updated: 'Updated on {date}',
  },
  overview: {
    title: 'Overview · {period}',
    participants: 'Participants',
    participantsSub: 'Drummers and cantineras registered in {period}',
    participantsGlobalSub: 'Drummers and cantineras registered across all editions',
    growth: 'Change vs. previous edition',
    growthSub: '{previous} → {current} participants',
    record: 'All-time record',
    recordSub: 'Edition {year}',
    distinctNames: 'Distinct first names',
    distinctSurnames: 'Distinct surnames',
    diversitySub: '{percentage} diversity',
    multipleNames: 'Compound names',
    multipleNamesSub: '{percentage} of participants',
  },
} satisfies typeof statistics;
