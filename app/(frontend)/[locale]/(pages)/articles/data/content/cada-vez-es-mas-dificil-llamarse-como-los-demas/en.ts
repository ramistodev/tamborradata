import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import {
  arrivals,
  coreShareOfAll,
  currentTopTwentyShare,
  figures,
  nameCounts,
  namedParticipants,
  noraHistory,
  noraShare,
  oldTopTwentyShare,
  pairDropPercent,
  sampledIncrease,
  sampledIncreasePercent,
  singleEditionShareOfNames,
  topTenShare,
  topTenStaying,
} from './figures';

const [martina, noa, laia, luka, leo] = arrivals;

const copy: ArticleCopy = {
  intro: {
    lead: 'Every year it gets a little harder to find another Children’s Tamborrada participant with the same name as you. The familiar names have not disappeared: what has changed is that they are now shared among many more.',
    moreNames:
      'The simplest reason is that there are more different names. When participants are spread across more options, it is less likely that any of them will coincide, and that happens even when the lists are the same size.',
    topWeighs:
      'Another reason lies at the top of the list. The most common name in each edition now covers a smaller share of the participants than at the start of our data, and the same is true of the group of names that leads the list. Being the most popular name still exists, but it no longer means the same: there are fewer children behind each name.',
    classics:
      'Besides, the classics are losing weight and nobody quite takes their place. Some of the most common names of the past are much less frequent today, and the ones on the rise do not gather as many children as the older ones did.',
    newNames:
      'And new names arrive every year. A growing share of the participants has a name that was not on the lists before, and each new name takes a share of the children the others used to have.',
    stable:
      'All of this coexists with a very stable top. A few names stay up there edition after edition, and the change is not a revolution but a slow, steady movement. That is why it is hard to notice from year to year, and why it shows clearly when compared over time.',
    summaryLabel: 'In short',
    summary:
      'Sharing a name with others is still possible, but every year a little less so: there are more names, the most popular ones weigh less and the classics fade. What follows is the proof, with the data from the Children’s Tamborrada.',
  },
  data: {
    heading: 'The data we used',
    coverage: (f) =>
      `Here we use the lists of ${f.int(figures.editionCount)} editions, from ${figures.firstEdition} to ${figures.lastEdition}; there is no data for 2009, 2010 or 2021. In total there are ${f.int(figures.namedParticipations)} entries with an identified name. For each participant we count only the first name: Jon Ander counts as Jon.`,
    caveats: () =>
      'Two important caveats. We count entries, not people: a child who marches for several years appears in every edition, and in the latest editions around half of the list was already on the previous one. Also, each list is a snapshot of children of different ages, so comparing editions shows how that snapshot changes, not how a particular generation does.',
    partial: (f) =>
      `The 2012 and 2022 lists include around ${f.int(figures.partialEditionSchools)} schools, compared with ${f.int(figures.regularEditionSchoolsMin)} or more in the others. We use them in the overall counts, but they do not appear in the evolution charts because they are not comparable with the rest. 2009, 2010 and 2021, for which there is no data, do not appear either.`,
  },
  concentration: {
    heading: 'Sharing a name is less and less likely',
    question: () =>
      'A simple way to measure how often names repeat is to pick two participants at random from the same edition and ask whether they share a name.',
    pairValue: (f, oneIn) => `1 in ${f.int(oneIn)}`,
    pairDescription: 'pairs of participants with the same name',
    pairCaption:
      'Probability that two participants chosen at random from the same edition have the same first name.',
    conclusion: (f) =>
      `Put another way, sharing a name with another participant is now ${f.percent(pairDropPercent, 0)} less likely than in ${figures.firstEdition}. What follows explains why.`,
  },
  variety: {
    heading: 'There are more names to spread across',
    trap: (f) =>
      `It might be enough to count different names: there were ${f.int(figures.distinct2008)} in ${figures.firstEdition} and ${f.int(figures.distinct2026)} in ${figures.lastEdition}. But that comparison is unfair. In ${figures.lastEdition} there were more participants (${f.int(namedParticipants[2026])} compared with ${f.int(namedParticipants[2008])}), and the more participants there are, the more different names appear even if tastes do not change.`,
    sample: (f) =>
      `To compare them on equal terms we ran a draw. From each edition we picked ${f.int(figures.sampleSize)} participants at random, the size of the smallest list; we repeated the draw ${f.int(figures.sampleDraws)} times and kept the average. By that yardstick, about ${f.int(figures.sampledDistinct2008)} different names appear in ${figures.firstEdition} and about ${f.int(figures.sampledDistinct2026)} in ${figures.lastEdition}: ${f.int(sampledIncrease)} more, a ${f.int(sampledIncreasePercent)}% increase.`,
    chartLabel: 'Expected different names',
    chartCaption: (f) =>
      `Different names to be expected in a draw of ${f.int(figures.sampleSize)} participants from each edition (average of ${f.int(figures.sampleDraws)} draws).`,
    panel: (f) =>
      `The result does not depend on how we measure. If we look only at the ${f.int(figures.panelSchools)} schools present in all ${f.int(figures.completeEditionCount)} complete editions, the increase holds: between 2023 and ${figures.lastEdition}, with almost the same number of participants (from ${f.int(figures.panelMinParticipants)} to ${f.int(figures.panelMaxParticipants)} each year), the number of different names goes from ${f.int(figures.panelDistinct2023)} to ${f.int(figures.panelDistinct2026)}.`,
    conclusion:
      'In other words: there are more names to spread across, and that variety is not down to the size of the lists.',
  },
  top: {
    heading: 'The most popular names weigh less',
    lead: (f) =>
      `The first thing that changes is the top. The ten most common names of ${figures.firstEdition} accounted for ${f.percent(topTenShare[2008])} of the participants; in ${figures.lastEdition}, ${f.percent(topTenShare[2026])}. Behind each popular name there are fewer children.`,
    chartLabel: 'The ten most common names',
    chartCaption:
      'Percentage of the participants in each edition who have one of the ten most common names of that edition.',
    paradoxLabel: 'The paradox',
    paradox: (f) =>
      `Being the most common name means less and less: Nora in ${figures.lastEdition} accounts for **${f.percent(figures.leaderShare2026)}** of the participants; Ane, which led in ${figures.firstEdition}, accounted for **${f.percent(figures.leaderShare2008)}**.`,
  },
  classics: {
    heading: 'The classics are losing weight',
    fading: (f) =>
      `The twenty most common names of ${figures.firstEdition} (among them Ane, Jon, Iñigo, Leire, María, Ander, Mikel and Asier) accounted for ${f.percent(oldTopTwentyShare[2008])} of the participants. In ${figures.lastEdition}, those same twenty names account for ${f.percent(oldTopTwentyShare[2026])}.`,
    oldLabel: 'The twenty most common names of 2008',
    currentLabel: 'The twenty most common names of 2026',
    chartCaption:
      'Percentage of the participants in each edition who have one of the twenty most common names of 2008 and of 2026.',
    spread: (f) =>
      `The twenty favourites of ${figures.lastEdition} (Nora, Ane, Jon, Sara, Maddi, Telmo, June…) add up to ${f.percent(currentTopTwentyShare[2026])}: less than the ${figures.firstEdition} ones did.`,
    individual: (f) =>
      `The individual cases show it. María went from ${f.int(nameCounts.maria[2008])} participants in ${figures.firstEdition} (rank ${f.int(figures.mariaPosition2008)}) to ${f.int(nameCounts.maria[2026])} in ${figures.lastEdition} (rank ${f.int(figures.mariaPosition2026)}). Leire, from ${f.int(nameCounts.leire[2008])} to ${f.int(nameCounts.leire[2026])}. Iñaki, from ${f.int(nameCounts.inaki[2008])} to ${f.int(nameCounts.inaki[2026])}. And at the same time others are rising: Martina and Laia now outnumber all of them.`,
    trajectoriesCaption: 'Participants with each name per thousand participants in the edition.',
    conclusion:
      'The classics lose children as other names gain, but none of the rising ones gathers what the classics once did. That is why the split is increasingly wide.',
  },
  arrivals: {
    heading: 'More new names arrive every year',
    intro: (f) =>
      `Some names hardly appeared a decade ago. In 2013 there was ${f.int(martina.in2013)} participant called Martina; in ${figures.lastEdition}, ${f.int(martina.in2026)}. Luka went from ${f.int(luka.in2013)} to ${f.int(luka.in2026)}, Laia from ${f.int(laia.in2013)} to ${f.int(laia.in2026)} and Noa from ${f.int(noa.in2013)} to ${f.int(noa.in2026)}. Leo was not among the 2013 participants; in ${figures.lastEdition} there are ${f.int(leo.in2026)}.`,
    nameColumn: 'Name',
    tableCaption: (f) =>
      `Participants with each name in the 2013 and 2026 editions, which have ${f.int(namedParticipants[2013])} and ${f.int(namedParticipants[2026])} participants with an identified name, respectively.`,
    renewal: (f) =>
      `The renewal is visible across the whole list. Of the ${f.int(namedParticipants[2026])} participants in ${figures.lastEdition}, ${f.int(figures.unseenParticipants2026)} have a name that does not appear in any of the editions from ${figures.firstEdition} to 2016: one in ten. In 2017, the figure was ${f.percent(figures.unseenShare2017)}.`,
    waffleLabel: 'One in ten participants in 2026 has a name that did not appear between 2008 and 2016',
    waffleCaption: (f) =>
      `${f.int(figures.unseenParticipants2026)} out of ${f.int(namedParticipants[2026])} participants (${f.percent(figures.unseenShare2026, 2)}). There is no data for 2009 and 2010, so some of these names may have appeared in those years.`,
    conclusion:
      'Each new name that enters the lists takes a share of the children the others used to have. So even if the top barely moves, each name ends up with fewer participants.',
  },
  repertoire: {
    heading: 'The shared stock is narrowing',
    core: (f) =>
      `Of all the names that have appeared on the lists, ${f.int(figures.coreNames)} have been present in all ${f.int(figures.editionCount)} editions: they are the familiar names, the Tamborrada’s common stock. Together they account for ${f.percent(coreShareOfAll)} of all entries. But every year they cover fewer participants: from ${f.percent(figures.coreShare2008)} in ${figures.firstEdition} to ${f.percent(figures.coreShare2026)} in ${figures.lastEdition}.`,
    chartLabel: 'Participants with one of the familiar names',
    chartCaption: (f) =>
      `Percentage of the participants in each edition who have one of the ${f.int(figures.coreNames)} names present in all ${f.int(figures.editionCount)} editions.`,
    tail: (f) =>
      `At the other extreme, ${f.int(figures.singleEditionNames)} names, more than a third (${f.percent(singleEditionShareOfNames, 0)}) of all the different names, have appeared in only one edition.`,
    conclusion:
      'The common stock is still the majority, but it covers fewer and fewer children: more and more of them have uncommon names.',
  },
  staying: {
    heading: 'The top changes slowly',
    top: (f) =>
      `Amid so much change, some names have never left the top. Ane and Jon have been among the five most common in all ${f.int(figures.editionCount)} editions. Ander has been in the top ten in ${f.int(topTenStaying[2].editions)} of them.`,
    chipsCaption: (f) =>
      `Editions, out of ${f.int(figures.editionCount)}, in which each name has been among the ten most common.`,
    overlap: (f) =>
      `That stability explains why the top changes slowly: from one edition to the next, between ${f.int(figures.topTenOverlapMin)} and ${f.int(figures.topTenOverlapMax)} of the ten most common names stay in the top 10.`,
  },
  nora: {
    heading: 'Nora: the changeover at the top',
    opening: (f) =>
      `Nora is the best example of that changeover. In ${figures.firstEdition}, of the ${f.int(namedParticipants[2008])} participants with an identified name, only ${f.int(figures.noraCount2008)} were called **Nora**: it ranked number ${f.int(figures.noraPosition2008)} on the list. In ${figures.lastEdition} it is the most common name: *${f.int(figures.noraCount2026)} out of ${f.int(namedParticipants[2026])}*.`,
    chartCaption: (f) =>
      `Percentage of the participants in each edition called Nora, Ane or Jon. Nora goes from ${f.percent(noraShare[2008], 2)} to ${f.percent(noraShare[2026], 2)}.`,
    rise: (f) =>
      `Its rise is real, but it comes with nuances. It ranked number ${f.int(noraHistory[2].position)} in 2013, number ${f.int(noraHistory[3].position)} in 2016 and number ${f.int(noraHistory[4].position)} in 2020. It also topped the 2022 list, but that edition is incomplete and we do not take it as evidence.`,
    editionColumn: 'Edition',
    participantsColumn: 'Participants',
    shareColumn: '% of the edition',
    positionColumn: 'Rank',
    tableCaption:
      'Participants called Nora, their percentage of the edition and their rank on the list of most common names.',
    nuance: (f) =>
      `In the complete editions, Nora was second in 2020, 2023 and 2024, always behind Ane, and first only in 2025 and ${figures.lastEdition}: by ${f.int(figures.noraCount2025 - figures.aneCount2025)} participants in 2025 (${f.int(figures.noraCount2025)} against ${f.int(figures.aneCount2025)}) and by ${f.int(figures.noraCount2026 - figures.aneCount2026)} in ${figures.lastEdition} (${f.int(figures.noraCount2026)} against ${f.int(figures.aneCount2026)}). Since 2020 its weight has barely moved: it sits between ${f.percent(figures.noraShareSince2020Min)} and ${f.percent(figures.noraShareSince2020Max)} of the participants. Nora is no longer growing; it has levelled off at the top.`,
    conclusion:
      'Who leads changes, but not how much the leader weighs: whoever tops the list today covers a smaller share of the participants than whoever topped it before.',
  },
  limits: {
    heading: 'What the data say and what they do not',
    shows: () =>
      `These data allow us to say that, between ${figures.firstEdition} and ${figures.lastEdition}, the participants’ first names are more varied: at equal size, each edition brings together more different names, and the most common ones weigh less.`,
    doesNot: () =>
      `They do not tell us why. The lists include neither age nor year of birth, so we cannot talk about generations or attribute the changes to any cause. Nor do they distinguish variants of the same name (Xabier and Javier, Iñaki and Ignacio or Ane and Ana count as different names), and the ${figures.firstEdition} and 2011 editions may be somewhat incomplete.`,
  },
  conclusion: {
    heading: 'Choosing among many',
    summary: () =>
      'What the Children’s Tamborrada lists show is not the disappearance of the traditional names, but a different distribution. Ane and Jon are still among the five most common, and from one edition to the next almost the whole top 10 stays. But around them more and more names appear, and the most popular ones account for a smaller part of each edition.',
    synthesis:
      'That is the underlying explanation: more names, tops that weigh less, classics that fade and newcomers that keep arriving. Each of those pieces, however small, takes away some of the chance of finding another child with your name.',
    closing: 'The familiar names are still there. What has changed is everything around them.',
  },
};

const texts: ArticleTexts = {
  title: 'It is getting harder to share a name with anyone else',
  description:
    'The Children’s Tamborrada keeps the names we always recognise. But, edition after edition, it makes room for many more.',
  category: 'Names',
  readTime: '8 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
