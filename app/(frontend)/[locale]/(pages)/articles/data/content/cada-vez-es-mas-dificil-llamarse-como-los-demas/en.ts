import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import {
  derived,
  expectedDistinctNames,
  figures,
  pairOneIn,
  participants,
  sampleSize,
  topNames2008,
  topNames2026,
  topTenShare,
  topTenTotal,
  totalParticipations,
} from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = <T>(values: readonly T[]) => values[values.length - 1];
const noData = '(without 2009, 2010, 2012, 2021 or 2022)';

const copy: ArticleCopy = {
  story: [
    text('Picture two school playgrounds, eighteen years apart.'),
    {
      kind: 'text',
      text: (f) =>
        `In the first, in 2008, there are about 4,000 Children’s Tamborrada participants. The most common name is ${topNames2008[0].name}, which appears ${f.int(topNames2008[0].count)} times. The second is ${topNames2008[1].name}, with ${f.int(topNames2008[1].count)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Now we travel to 2026. There are almost a third more children: over 5,200. And yet the most repeated name, ${topNames2026[0].name}, appears ${f.int(topNames2026[0].count)} times, and the second, ${topNames2026[1].name}, ${f.int(topNames2026[1].count)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `And it is not only the top two. If we keep going down the ranking, from first place to tenth, we find that each of the ten most popular names gathers fewer participants than its 2008 equivalent. The fourth in that edition had ${f.int(topNames2008[3].count)}; the one in 2026, ${f.int(topNames2026[3].count)}.`,
    },
    text('How can there be more participants, yet the most popular names repeat less?'),
    text(
      'The answer lies in a change that has been taking place for almost two decades and is hard to notice from one year to the next. To find it, we went through the lists of the sixteen editions published on Tamborradata, from 2008 to 2026.'
    ),

    heading('The top ten, place by place'),
    {
      kind: 'text',
      text: (f) =>
        `The ten most repeated names of 2008 added up to ${f.int(topTenTotal.y2008)} participants. The ten of 2026 add up to ${f.int(topTenTotal.y2026)}, even though the edition has over 1,200 more participants. Rank by rank, the result is the same: every one gathers fewer than its equivalent from eighteen years ago, by a little at the top and by quite a bit more in the middle of the ranking.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `In proportions, eighteen years ago one in five participants had one of those ten names: ${f.percent(topTenShare[0])}. Today it is one in seven: ${f.percent(last(topTenShare))}.`,
    },
    highlight('Being the most popular name still exists, but it no longer means the same.'),

    heading('Where did everyone else go?'),
    {
      kind: 'text',
      text: (f) =>
        `The participants have not disappeared: their names are spread across many more options. In 2008, ${f.int(figures.distinct2008)} different names were registered; in 2026, ${f.int(figures.distinct2026)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `But that comparison would be unfair, because the more participants there are, the more different names appear even if tastes do not change. To compare them on equal terms, we measured how many different names to expect when picking ${f.int(sampleSize)} participants at random from each edition, which is the size of the smallest list. In 2008 that would be about ${f.int(expectedDistinctNames[0])}; in 2026, about ${f.int(last(expectedDistinctNames))}: ${f.int(derived.expectedIncreasePercent)}% more.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Nor does it seem to be only a matter of which schools take part. In the ${f.int(figures.panelSchools)} schools that were in every complete edition there were ${f.int(figures.panel2023.participants)} participants in 2023 and ${f.int(figures.panel2026.participants)} in 2026: almost the same number of children. Their number of different names went from ${f.int(figures.panel2023.distinctNames)} to ${f.int(figures.panel2026.distinctNames)}.`,
    },
    text(
      'With so many names to choose from, sharing one is harder. Just imagine picking two participants at random from the same edition and asking how likely it is that they have the same name.'
    ),
    {
      kind: 'highlight',
      text: (f) =>
        `In 2008, one in every ${f.int(pairOneIn[0])} pairs of participants shared a first name; in 2026, only one in ${f.int(last(pairOneIn))}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `The difference shows most in the tail of the list. Today almost one in four participants (${f.percent(figures.uncommon2026.share, 0)}) has an uncommon name, one that fewer than five participants have in the edition; in 2008 it was one in five (${f.percent(figures.uncommon2008.share, 0)}). And the names borne by a single participant went from ${f.int(figures.uncommon2008.singleBearerNames)} to ${f.int(figures.uncommon2026.singleBearerNames)}.`,
    },

    heading('What happened to yesterday’s favourites?'),
    {
      kind: 'text',
      text: (f) =>
        `The classics are losing participants. María went from ${f.int(figures.counts.maria.y2008)} in 2008 to ${f.int(figures.counts.maria.y2026)} in 2026, and Leire from ${f.int(figures.counts.leire.y2008)} to ${f.int(figures.counts.leire.y2026)}. They are still there, but no longer at the top.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `At the same time, others that were barely heard in 2008 are rising. Martina, Noa and Laia each had fewer than five participants in 2008; in 2026 they have ${f.int(figures.counts.martina.y2026)}, ${f.int(figures.counts.noa.y2026)} and ${f.int(figures.counts.laia.y2026)}. But none reaches the ${f.int(figures.counts.maria.y2008)} and ${f.int(figures.counts.leire.y2008)} that put María and Leire among the top five. Popularity is no longer concentrated in a few names: it passes from one to another and is shared among more.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Every year, moreover, names arrive that had not been seen before. In 2026, one in ten participants has a name that did not appear in any of the editions published between 2008 and 2016. In 2017, it was just over ${f.percent(figures.unseen2017.share, 0)}.`,
    },

    heading('Did it happen suddenly?'),
    // Q10: the Top 10 keeps between 7 and 9 names from one published edition to the next.
    text(
      'No. Comparing the editions one by one, what we see are small steps. From one edition to the next, between seven and nine of the ten most repeated names usually stay, and Ane and Jon have been among the top five in all sixteen editions.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `The spread has been widening for years, with ups and downs. The probability of sharing a name with another participant went from one in ${f.int(pairOneIn[0])} in 2008 to one in ${f.int(pairOneIn[2])} in 2013, one in ${f.int(pairOneIn[8])} in 2019 and one in ${f.int(last(pairOneIn))} in 2026. There were editions where it went backwards, such as 2020. The same goes for the top: the weight of the ten leading names has fallen unevenly, with rebounds such as those of 2018 and 2020. These are small changes that, added together, transform the whole.`,
    },

    heading('Back to the two playgrounds'),
    {
      kind: 'text',
      text: (f) =>
        `Let us go back to the two playgrounds. In the 2008 one, one in every ${f.int(derived.leaderOneIn2008)} participants was called ${topNames2008[0].name}, the most repeated name. In the 2026 one, the most repeated name, ${topNames2026[0].name}, belongs to one in every ${f.int(derived.leaderOneIn2026)}.`,
    },
    text('Ane and Jon are still there, among the top three. The familiar names have not disappeared.'),
    highlight(
      'What has changed is everything around them: hundreds more names, each with a few children.'
    ),
    text(
      'The Children’s Tamborrada still brings together thousands of participants. What is no longer so likely is to run into someone with your name among them.'
    ),
  ],
  data: {
    heading: 'The story in data',
    ranking: {
      lede: (f) =>
        `**The ten most repeated names now gather fewer participants than in 2008, in a bigger edition.** Participants at each rank, in an edition of ${f.int(participants.y2008)} participants with an identified name (2008) and another of ${f.int(participants.y2026)} (2026).`,
      seriesLabel2008: '2008',
      seriesLabel2026: '2026',
      columns: ['Rank', 'Name 2008', 'Participants 2008', 'Name 2026', 'Participants 2026', 'Difference'],
      totalLabel: 'Total',
    },
    topTen: {
      lede: (f) =>
        `**The ten most repeated names now gather a smaller share than in 2008: from ${f.percent(topTenShare[0])} to ${f.percent(last(topTenShare))}.** Percentage of each edition’s participants who have one of that edition’s ten most repeated names ${noData}.`,
      seriesLabel: 'Percentage of participants',
    },
    pairs: {
      lede: (f) =>
        `**With so many names, sharing one is harder: from 1 in ${f.int(pairOneIn[0])} to 1 in ${f.int(last(pairOneIn))}.** If two participants are picked at random from the same edition, one pair in this many has the same first name ${noData}.`,
      seriesLabel: 'One in every…',
    },
    distinct: {
      lede: (f) =>
        `**With the same number of participants, there are now more different names.** Different names to expect when picking ${f.int(sampleSize)} participants at random from each edition ${noData}.`,
      seriesLabel: 'Expected different names',
      compareCaption: (f) =>
        `In the same ${f.int(figures.panelSchools)} schools and with almost the same number of children, there are ${f.int(derived.panelExtraNames)} more names.`,
      left: {
        value: (f) => `${f.int(figures.panel2023.distinctNames)} different names`,
        description: (f) =>
          `${f.int(figures.panel2023.participants)} participants from ${f.int(figures.panelSchools)} schools`,
      },
      right: {
        value: (f) => `${f.int(figures.panel2026.distinctNames)} different names`,
        description: (f) =>
          `${f.int(figures.panel2026.participants)} participants from the same ${f.int(figures.panelSchools)} schools`,
      },
    },
    uncommon: {
      lede: () => '**Today more participants than in 2008 have an uncommon name.**',
      left: {
        value: (f) => f.percent(figures.uncommon2008.share, 0),
        description: (f) =>
          `of participants have a name that fewer than five participants share (${f.int(figures.uncommon2008.participants)} of ${f.int(participants.y2008)}). ${f.int(figures.uncommon2008.singleBearerNames)} names are borne by a single participant.`,
      },
      right: {
        value: (f) => f.percent(figures.uncommon2026.share, 0),
        description: (f) =>
          `(${f.int(figures.uncommon2026.participants)} of ${f.int(participants.y2026)}). ${f.int(figures.uncommon2026.singleBearerNames)} names are borne by a single participant.`,
      },
    },
    classics: {
      lede: () =>
        '**María and Leire lose participants; Martina, Noa and Laia gain them.** Participants with each name.',
      columns: ['Name', '2008', '2026'],
      lessThanFive: 'fewer than 5',
    },
    unseen: {
      lede: (f) =>
        `**One in ten participants in 2026 has a name that did not appear between 2008 and 2016.** In 2017 it was ${f.percent(figures.unseen2017.share)}. There is no data for 2009 or 2010: some of these names may have appeared in those years.`,
      waffleLabel: (f) =>
        `${f.int(figures.unseen2026.participants)} of ${f.int(participants.y2026)} participants (${f.percent(figures.unseen2026.share)})`,
    },
  },
  used: {
    heading: 'Data used',
    blocks: [
      (f) =>
        `**What data.** Published Tamborradata statistics on ${f.int(figures.editions)} editions of the Children’s Tamborrada: 2008, 2011 to 2020 and 2022 to 2026 (there is no data for 2009, 2010 or 2021). Queried on 9 November 2026, on the versions published on 18 October 2026. The evolution charts use 14 editions: they leave out 2012 and 2022, which have about 25 schools, compared with 40 or more in the others. The 2008 and 2011 editions may be somewhat incomplete.`,
      (f) =>
        `**What each figure counts.** “Participants” are entries whose first name is identified without ambiguity: ${f.int(participants.y2008)} in 2008 and ${f.int(participants.y2026)} in 2026, out of ${f.int(totalParticipations.y2008)} and ${f.int(totalParticipations.y2026)} total entries (the rest are ambiguous names that are not counted). We count entries, not people: a child who marches for several years appears in every edition. Only the first name is counted (Jon Ander counts as Jon), without accents or tildes in the original data, and variants (Xabier and Javier, Ane and Ana) count as different names.`,
      (f) =>
        `**How the measures are calculated.** The probability of sharing a name is the proportion of pairs of participants in an edition with the same first name. The “expected” different names are the average that results from picking ${f.int(sampleSize)} participants at random from each edition (the size of the smallest list), calculated exactly. The panel brings together the ${f.int(figures.panelSchools)} schools with participants in the 12 complete editions (2013 to 2020 and 2023 to 2026). “Uncommon” names are those borne by fewer than five participants in that edition.`,
      () =>
        '**Limits.** The lists include neither age nor year of birth, so the changes cannot be attributed to any cause and we cannot talk about generations. Each list is a snapshot of children of different ages.',
      () =>
        '**Privacy.** Only aggregates are published. Figures below five are not shown.',
    ],
  },
};

const texts: ArticleTexts = {
  title: 'It is getting harder to share a name with anyone else',
  description:
    'With more participants, the most popular names in the Children’s Tamborrada repeat less than in 2008: there are more different names and sharing one is rarer. How the spread changed over eighteen years.',
  category: 'Names',
  readTime: '8 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
