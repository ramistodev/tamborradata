import type statistics from '../es/statistics';

export default {
  period: {
    title: "Children's Tamborrada Statistics {period}",
    description:
      "Analysis of the Children's Tamborrada {period}: participants, most common names, leading schools and yearly trends.",
    dataDescription:
      "{participants} participants in the Children's Tamborrada {period}. Most common names: {names}. Surnames, schools and yearly trends.",
    globalTitle: "Children's Tamborrada Historical Statistics ({first}-{last})",
    globalDescription:
      "Data from {first} to {last} of the Children's Tamborrada in Donostia: participants, names, surnames, schools and trends.",
    globalDataDescription:
      "Data from {first} to {last}: {participants} participants registered in the Children's Tamborrada. Most common names and surnames, schools and trends.",
  },
  chapters: {
    ariaLabel: 'Explore the data',
    hero: 'Overview',
    participationDynamics: 'Participation',
    schools: 'Schools',
    schoolsRenewal: 'Renewal',
    schoolsEvolution: 'Evolution',
    names: 'Names',
    surnames: 'Surnames',
    identityDiversity: 'Diversity',
    closing: 'Wrap-up',
  },
  hero: {
    eyebrowYear: 'Yearly edition',
    eyebrowGlobal: 'Edition {period}',
  },
  periodSelector: {
    label: 'Periods',
    missingEdition: 'No edition in {year}',
  },
  closing: {
    eyebrow: 'In summary',
    navLabel: 'Navigate between periods',
    newer: 'More recent',
    older: 'Older',
    edition: 'Edition {period}',
    backToTop: 'Back to top',
  },
  structuredData: {
    home: 'Home',
    statistics: 'Statistics by Year',
    breadcrumbPeriod: "Children's Tamborrada {period}",
    breadcrumbGlobal: 'Full history',
    datasetDescription:
      "Data from the Children's Tamborrada {period} in Donostia / San Sebastián: participants, names, surnames and schools.",
    datasetGlobalDescription:
      "Data from {first} to {last} of the Children's Tamborrada in Donostia / San Sebastián: participation, names, surnames and schools of every edition.",
    keywords:
      "children's tamborrada {period}, children's tamborrada statistics, children's tamborrada participants {period}, most common names, schools, Donostia, San Sebastián, January 20",
    keywordsGlobal:
      "children's tamborrada history, children's tamborrada statistics, children's tamborrada since {first}, participants per year, names, surnames, schools, Donostia, San Sebastián",
    place: 'Donostia / San Sebastián, Gipuzkoa',
    eventName: "Children's Tamborrada of Donostia {period}",
    eventDescription:
      "Parade of the Children's Tamborrada of Donostia / San Sebastián on January 20, {period}.",
    eventSeriesName: "Children's Tamborrada of Donostia",
    eventSeriesDescription:
      'Yearly parade of child drummers and cantineras of Donostia / San Sebastián every January 20.',
    variables: {
      participants: 'Participants',
      growth: 'Change compared with the previous edition',
      record: 'Participants in the record edition',
      distinctNames: 'Distinct names',
      distinctSurnames: 'Distinct surnames',
      multipleNames: 'Participants with a compound name',
      averageSchoolSize: 'Average participants per school',
      schoolCount: 'Participating schools',
    },
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
  metrics: {
    participant_count: 'Participants',
    growth_rate: 'Growth rate',
    record_participant_count: 'Record participants',
    record_year: 'Record year',
    distinct_count: 'Distinct count',
    diversity_percentage: 'Diversity',
    participants_with_multiple_names: 'Participants with multiple names',
    multiple_names_rate: 'Share of resolved participants',
    record_year_count: 'Years with that record',
    observation_count: 'Observations',
    shannon_entropy: 'Shannon entropy',
    herfindahl_index: 'Concentration index',
    leading_count: 'Leader appearances',
    leading_key: 'Most frequent',
    leading_share: 'Leader share',
    top_k_share: 'Share of the top positions',
    average_length: 'Average characters',
    average_school_size: 'Participants per school',
    new_count: 'New schools',
    veteran_count: 'Veteran schools',
    intermediate_count: 'Intermediate schools',
    school_count: 'Schools in total',
    new_vs_veteran_ratio: 'New per veteran',
  },
  categories: {
    totalParticipants: {
      tab: 'Total',
      title: 'Total participants',
      description: 'Drummers and cantineras registered in total.',
    },
    participantsGrowthRate: {
      tab: 'Change',
      title: 'Participants growth',
      description:
        'How much participation grew or shrank, as a percentage, compared with the previous edition.',
    },
    participationRecordYears: {
      tab: 'Record',
      title: 'Participation record',
      description:
        'The edition with the most participants in the whole history, and how many there were.',
    },
    topNames: {
      tab: 'Most frequent',
      title: 'Most frequent names',
      description: 'The most repeated names and how many times each one appears.',
    },
    topSecondNames: {
      tab: 'Second name',
      title: 'Most frequent second names',
      description: 'The most repeated second names among participants with a compound name.',
    },
    nameTrends: {
      tab: 'Trends',
      title: 'Name trends',
      description:
        'How the number of appearances of the leading names has changed, edition by edition.',
    },
    newNames: {
      tab: 'New',
      title: 'Debuting names',
      description: 'Names that appear for the first time in this edition, never seen before.',
    },
    disappearedNames: {
      tab: 'Disappeared',
      title: 'Disappearing names',
      description: 'Names that were in the previous edition and no longer appear in this one.',
    },
    perennialNames: {
      tab: 'Always present',
      title: 'Always present',
      description: 'Names that have been present in every edition.',
    },
    nameComebacks: {
      tab: 'Comebacks',
      title: 'Comebacks',
      description: 'Names that dropped out for one or more editions and then came back.',
    },
    averageNameLength: {
      tab: 'Average length',
      title: 'Average name length',
      description: 'Average number of letters in the registered names.',
    },
    nameInitialDistribution: {
      tab: 'Initials',
      title: 'By initial letter',
      description: 'How names are distributed by the letter they start with.',
    },
    longestNames: {
      tab: 'Longest',
      title: 'Longest names',
      description: 'The names with the most letters, and their length.',
    },
    nameSchoolCorrelation: {
      tab: 'In most schools',
      title: 'Names in the most schools',
      description: 'The names found in the most different schools, and in how many.',
    },
    singleYearNames: {
      tab: 'Single edition',
      title: 'Single-edition names',
      description: 'Names that have appeared in only one edition in the whole history.',
    },
    rareNames: {
      tab: 'Rare',
      title: 'Rare names',
      description: 'Names recorded very few times across the whole history.',
    },
    participantsWithMultipleNames: {
      tab: 'Multiple names',
      title: 'Participants with multiple names',
      description: 'Participants with more than one given name, and what share they make up.',
    },
    topSurnames: {
      tab: 'Most frequent',
      title: 'Most frequent surnames',
      description: 'The most repeated surnames and how many times each one appears.',
    },
    surnameTrends: {
      tab: 'Trends',
      title: 'Surname trends',
      description:
        'How the number of appearances of the leading surnames has changed, edition by edition.',
    },
    newSurnames: {
      tab: 'New',
      title: 'Debuting surnames',
      description: 'Surnames that appear for the first time in this edition, never seen before.',
    },
    disappearedSurnames: {
      tab: 'Disappeared',
      title: 'Disappearing surnames',
      description: 'Surnames that were in the previous edition and no longer appear in this one.',
    },
    perennialSurnames: {
      tab: 'Always present',
      title: 'Always present',
      description: 'Surnames that have been present in every edition.',
    },
    surnameComebacks: {
      tab: 'Comebacks',
      title: 'Comebacks',
      description: 'Surnames that dropped out for one or more editions and then came back.',
    },
    averageSurnameLength: {
      tab: 'Average length',
      title: 'Average surname length',
      description: 'Average number of letters in the registered surnames.',
    },
    surnameInitialDistribution: {
      tab: 'Initials',
      title: 'By initial letter',
      description: 'How surnames are distributed by the letter they start with.',
    },
    longestSurnames: {
      tab: 'Longest',
      title: 'Longest surnames',
      description: 'The surnames with the most letters, and their length.',
    },
    surnameSchoolCorrelation: {
      tab: 'In most schools',
      title: 'Surnames in the most schools',
      description: 'The surnames found in the most different schools, and in how many.',
    },
    singleYearSurnames: {
      tab: 'Single edition',
      title: 'Single-edition surnames',
      description: 'Surnames that have appeared in only one edition in the whole history.',
    },
    rareSurnames: {
      tab: 'Rare',
      title: 'Rare surnames',
      description: 'Surnames recorded very few times across the whole history.',
    },
    topSchools: {
      tab: 'Most participants',
      title: 'Schools with the most participants',
      description: 'The schools with the most participants, and how many each one brings.',
    },
    schoolGrowthRate: {
      tab: 'Growth',
      title: 'School growth',
      description:
        'Percentage change in the participants of each school compared with the previous edition.',
    },
    averageSchoolSize: {
      tab: 'Average size',
      title: 'Average school size',
      description: 'Average number of participants per school.',
    },
    schoolNameDiversity: {
      tab: 'Name variety',
      title: 'Schools with the most name variety',
      description: 'The schools with the most different names among their participants.',
    },
    schoolSurnameDiversity: {
      tab: 'Surname variety',
      title: 'Schools with the most surname variety',
      description: 'The schools with the most different surnames among their participants.',
    },
    commonNameBySchool: {
      tab: 'Common name',
      title: 'Most common name by school',
      description: 'The name that appears most in each school, and how many times it appears.',
    },
    commonSurnameBySchool: {
      tab: 'Common surname',
      title: 'Most common surname by school',
      description: 'The surname that appears most in each school, and how many times it appears.',
    },
    namesDiversity: {
      tab: 'Names',
      title: 'Names diversity',
      description:
        'How much variety there is in names: the more distinct names, the more diversity.',
    },
    surnamesDiversity: {
      tab: 'Surnames',
      title: 'Surnames diversity',
      description:
        'How much variety there is in surnames: the more distinct surnames, the more diversity.',
    },
    nameConcentration: {
      tab: 'Name concentration',
      title: 'Name concentration',
      description:
        'How concentrated participants are in a few names. The more concentration, the less diversity.',
    },
    surnameConcentration: {
      tab: 'Surname concentration',
      title: 'Surname concentration',
      description:
        'How concentrated participants are in a few surnames. The more concentration, the less diversity.',
    },
    nameSurnameDynasties: {
      tab: 'Dynasties',
      title: 'Name and surname dynasties',
      description:
        'Name and surname combinations that repeat across several editions, possibly from the same family.',
    },
    newSchools: {
      tab: 'New',
      title: 'Debuting schools',
      description: 'Schools taking part for the first time in this edition.',
    },
    disappearedSchools: {
      tab: 'Disappeared',
      title: 'Schools that disappear',
      description: 'Schools that were in the previous edition and no longer appear in this one.',
    },
    newVsVeteranSchoolRatio: {
      tab: 'New vs veteran',
      title: 'New versus veteran schools',
      description: 'How many new schools there are for each veteran school.',
    },
    schoolsEvolution: {
      tab: 'Evolution',
      title: 'Schools evolution',
      description:
        'How the number of participants of the largest schools has changed, edition by edition.',
    },
    schoolLongevity: {
      tab: 'Long-standing',
      title: 'Most long-standing',
      description: 'The schools that have taken part in the most editions, and in how many.',
    },
    mostConstantSchools: {
      tab: 'Consistent',
      title: 'Most consistent',
      description:
        'The schools whose participation changes least from one edition to the next; they are not necessarily the largest.',
    },
  },
  layout: {
    showMore: 'Show more',
    showLess: 'Show less',
    seriesLatest: 'Latest',
    seriesPeak: 'Peak',
    groups: { series: 'Series', rankings: 'Rankings', tables: 'Tables' },
    tableValue: 'Times',
    chartHint:
      'Use the left and right arrow keys to move through the editions and read their values.',
    legendLabel: 'Chart series: press to show or hide',
    keyFigures: 'Key figures',
    shown: 'Showing {count} results',
    table: {
      commonNameBySchool: { school: 'School', entity: 'Most common name' },
      commonSurnameBySchool: { school: 'School', entity: 'Most common surname' },
    },
  },
  familyRender: {
    participationDynamics: { title: 'Participation' },
    names: { title: 'Names' },
    surnames: { title: 'Surnames' },
    identityDiversity: { title: 'Diversity' },
    schools: { title: 'Schools' },
    schoolsRenewal: { title: 'Renewal' },
    schoolsEvolution: { title: 'Evolution' },
  },
} satisfies typeof statistics;
