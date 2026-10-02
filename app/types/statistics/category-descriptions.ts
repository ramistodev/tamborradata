import { StatisticCategories } from './category.types';

/**
 * One-line semantic definition per category, written to disambiguate categories the agent
 * has historically confused with one another (e.g. `newX` vs `disappearedX` vs `topX`).
 * Injected into the summary-agent prompt as a glossary so it cannot attribute a fact from
 * one category to another.
 */
export const categoryDescriptions = {
  totalParticipants:
    'Total number of participants recorded in the target period. A single fact, not a trend.',
  participantsGrowthRate:
    'Percentage change in total participants versus the prior comparable period.',
  participationRecordYears: 'Editions that set a record high or low in total participants.',

  topNames:
    'Ranking of the most frequent given names in the target period — the current leaderboard, not a change signal.',
  namesDiversity:
    'Aggregate diversity index (e.g. Shannon/Herfindahl) of given names across the whole target period.',
  nameTrends:
    "Time series of a given name's occurrences across editions. Describe growth or decline only when the series moves consistently in one direction across most points.",
  newNames:
    'Names observed in this edition that were absent from every prior edition — debuts. Never describe a newNames entry as "top" or "most prominent".',
  disappearedNames:
    'Names present in the prior edition but absent from this one — the opposite of newNames. Never describe a disappearedNames entry as "new".',
  perennialNames:
    'Names present in every observed edition — a continuity signal, not a frequency ranking.',
  nameComebacks:
    'Names that disappeared for one or more editions and then reappeared. Neither "new" (never seen before) nor "top" (frequency-based).',
  averageNameLength: 'Mean character length of given names in the target period.',
  nameInitialDistribution: 'Distribution of given names by their first letter.',
  nameConcentration:
    'How concentrated the given-name pool is among a few dominant names — the inverse of diversity.',
  singleYearNames:
    'Names observed in exactly one edition across the whole history — extreme rarity, not popularity.',
  rareNames:
    'Names with very low overall occurrence count across history — low frequency, unrelated to being new or disappeared.',
  longestNames: 'The given names with the most characters.',
  nameSchoolCorrelation: 'Association between given names and the schools where they occur.',
  topSecondNames:
    'Ranking of the most frequent second given name among resolved participants with two or more given names — distinct from topNames, which ranks only the first/primary given name.',
  participantsWithMultipleNames:
    'Count and rate of resolved participants who have two or more given names, out of resolved participants only.',

  topSurnames:
    'Ranking of the most frequent surnames in the target period — the current leaderboard, not a change signal.',
  surnamesDiversity: 'Aggregate diversity index of surnames across the whole target period.',
  surnameTrends:
    "Time series of a surname's occurrences across editions. Describe growth or decline only when the series moves consistently in one direction across most points.",
  newSurnames:
    'Surnames observed in this edition that were absent from every prior edition — debuts. Never describe a newSurnames entry as "top".',
  disappearedSurnames:
    'Surnames present in the prior edition but absent from this one — the opposite of newSurnames. Never describe a disappearedSurnames entry as "new" or "top".',
  perennialSurnames:
    'Surnames present in every observed edition — continuity, not a frequency ranking.',
  surnameComebacks: 'Surnames that disappeared for one or more editions and then reappeared.',
  averageSurnameLength: 'Mean character length of surnames in the target period.',
  surnameInitialDistribution: 'Distribution of surnames by their first letter.',
  surnameConcentration:
    'How concentrated the surname pool is among a few dominant surnames — the inverse of diversity.',
  singleYearSurnames:
    'Surnames observed in exactly one edition across the whole history — extreme rarity, not popularity.',
  rareSurnames:
    'Surnames with very low overall occurrence count across history — low frequency, unrelated to being new or disappeared.',
  longestSurnames: 'The surnames with the most characters.',
  surnameSchoolCorrelation: 'Association between surnames and the schools where they occur.',

  nameSurnameDynasties:
    'Given-name + surname combinations that recur across multiple editions, suggesting the same family line.',

  topSchools:
    'Ranking of schools by participant count in the target period — the current leaderboard.',
  newSchools:
    'Schools observed in this edition that never appeared in any earlier edition — debuts. Never describe a newSchools entry as "disappeared".',
  disappearedSchools:
    'Schools present in the prior edition but absent from this one — the opposite of newSchools. Never describe a disappearedSchools entry as "new".',
  schoolLongevity: 'How many editions a school has participated in, in total.',
  schoolGrowthRate: "A school's year-over-year percentage change in participant count.",
  averageSchoolSize: 'Mean number of participants per school in the target period.',
  schoolNameDiversity: 'Diversity measure of given names within schools.',
  schoolSurnameDiversity: 'Diversity measure of surnames within schools.',
  commonNameBySchool:
    'The most frequent given name within each individual school group. Always attribute each entry to its own school; never compare or merge across schools.',
  commonSurnameBySchool:
    'The most frequent surname within each individual school group. Always attribute each entry to its own school; never compare or merge across schools.',
  schoolsEvolution: 'Time series of participant counts per school across the full observed range.',
  mostConstantSchools:
    'Schools with the most consistent participation across editions (least variance), not necessarily the largest.',
  newVsVeteranSchoolRatio:
    'Ratio of newly observed schools to long-standing (veteran) schools in the period.',
} as const satisfies Record<StatisticCategories, string>;
