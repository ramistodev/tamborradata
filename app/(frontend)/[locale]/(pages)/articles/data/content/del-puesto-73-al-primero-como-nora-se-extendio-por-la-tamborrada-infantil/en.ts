import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, oneIn } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const copy: ArticleCopy = {
  story: [
    // Introduction: 2008 and 2026, without revealing the companies.
    {
      kind: 'text',
      text: (f) =>
        `In 2008, Ane was the most repeated name in Donostia’s Children’s Tamborrada. Of the ${f.int(figures.y2008.participants)} participants in that edition, ${f.int(figures.y2008.ane)} were called that. It was followed by Jon, Iñigo, Leire and María, names heard again and again among the city’s companies.`,
    },
    text('Much further down that ranking appeared Nora.'),
    {
      kind: 'text',
      text: () =>
        `Only fourteen participants were called that. They were spread across eight of the ${figures.y2008.companies} registered companies, and the name ranked number ${figures.y2008.rank}.`,
    },
    text('Eighteen years later, that list looks like it belongs to another generation.'),
    {
      kind: 'text',
      text: () =>
        `In 2026, Nora heads the ranking. There are ${figures.y2026.nora} participants with that name, ahead of Ane (${figures.y2026.ane}), Jon (${figures.y2026.jon}) and Sara (${figures.y2026.sara}). No other name surpasses it.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `In 2008, roughly one in every ${f.int(oneIn.y2008)} participants was called Nora. Today, it is one in ${f.int(oneIn.y2026)}. In under twenty years, an uncommon name has become the most repeated in the Children’s Tamborrada.`,
    },
    text(
      'How did a name that was barely heard in 2008 reach the top of the ranking? To find out, we have to follow it year by year and then look at it more closely.'
    ),

    heading('A name begins to be heard'),
    {
      kind: 'text',
      text: () =>
        'The first obstacle is that the data do not cover every year. Tamborradata has sixteen editions, those of 2008, 2011 to 2020 and 2022 to 2026, and there are no records for 2009, 2010 or 2021. That is why Nora’s first jump appears so suddenly: in 2008 it was number 73, with 14 participants, and by 2011 it was already number 25, with 30. In three years, more than double.',
    },
    {
      kind: 'text',
      text: () =>
        `After that the climb becomes more gradual. In 2013 Nora was 16th, with 55 participants, and it repeated both position and figure in 2014. In ${figures.top10Year} it entered the top ten for the first time: ninth, with 65. Since 2008 it had climbed ${figures.placesClimbed2015} places.`,
    },

    heading('A challenger to Ane and Jon'),
    text(
      'The next leap came in 2016. Nora was fourth, with 78 participants, behind Ane (108), Ander (86) and Jon (85). Between 2016 and 2019 it moved between fourth and fifth place, always with between 75 and 82 participants. It was a long plateau, but already in the upper part of the ranking.'
    ),
    {
      kind: 'text',
      text: () =>
        `In 2020 the plateau broke: Nora was second, with 93 participants. Only Ane, with 113, was ahead. The distance between them, ${figures.gap2008} participants in 2008, had shrunk to ${figures.gap2020}.`,
    },

    heading('First place, with an asterisk'),
    {
      kind: 'text',
      text: (f) =>
        `After the gap of 2021 came a very different edition. The 2022 one was exceptional, with ${figures.y2022.companies} companies and ${f.int(figures.y2022.participants)} participants, compared with the ${figures.y2020.companies} companies and ${f.int(figures.y2020.participants)} participants of 2020. In it Nora was first for the first time, with ${figures.y2022.nora} participants against Ane’s ${figures.y2022.ane}. A difference of two participants is not enough to speak of a changing of the guard, and the data confirm it: in 2023 and 2024 Ane was ahead again, with 118 against 106 and with 114 against 103.`,
    },
    text(
      'Confirmation came in 2025. Nora was first with 101 participants and Ane second with 93. In 2026 first place was repeated with the highest figure in Nora’s whole series: 110 against 99. This time there was no reduced edition in between.'
    ),
    {
      kind: 'text',
      text: () =>
        `Between 2008 and 2026 Nora has added ${figures.y2026.nora - figures.y2008.nora} participants, while Ane has gone from ${figures.y2008.ane} to ${figures.y2026.ane}, fifteen fewer. Its rise is part of a broader turnover of names, which we tell in “Donostia changes its names, but keeps its surnames”.`,
    },
    highlight('Nora got to the top more through what it gained itself than through what Ane lost.'),

    heading('The Tamborrada’s first is not every company’s first'),
    text(
      'So far we have talked about the Children’s Tamborrada as a whole. But the Tamborrada is not a single parade: each company has its own. If Nora is the most repeated name overall, it seems reasonable to expect it to be so in most companies too.'
    ),
    {
      kind: 'text',
      text: () =>
        `It is not. In 2026 Nora is the most repeated name in only four of the ${figures.y2026.companies} companies: Amara Berri (10 participants), Kresala Txiki (9), Sagrado Corazón Mundaiz (7) and Zurriola Ikastola (6). In the rest the favourite is another: Martín at Ekintza, Martina at the Deutsche Schule, Ane at Santo Tomás, June at Ikasbide.`,
    },
    text(
      'Ane, second overall, leads three companies outright and shares first place in two others. Nora, first overall, leads four outright.'
    ),
    {
      kind: 'text',
      text: () =>
        `That the overall first should be first in so few companies has an explanation: they are two different races. To head a company, between 6 and 10 participants are enough: in the four that Nora leads, which have between 133 and ${figures.amaraBerri2026} participants each, that is the figure that gives it first place. To head the whole, you have to add up everywhere. Nora reaches ${figures.y2026.nora} with an average of a little over three participants in each of the ${figures.y2026.companiesWithNora} companies where it appears, without piling up in any: the largest, Amara Berri, gathers ten, ${figures.biggestCompanySharePct}% of the total.`,
    },
    text(
      'At La Salle, for example, Ane has 10 participants and Nora 8. Ane wins there, but those 8 are also 8 of Nora’s 110. A first place in a company is worth a lot in that company; a second or a third adds just the same to the total.'
    ),
    {
      kind: 'text',
      text: () =>
        `The full count shows it. Nora is among the top three names of ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} companies: first in ${figures.noraRankBuckets.first} and second or third in another ${figures.noraRankBuckets.second3}. It ranks between fourth and tenth in ${figures.noraRankBuckets.fourTo10} more, lower in ${figures.noraRankBuckets.eleven}, and in ${figures.noraRankBuckets.none} it has no participants.`,
    },
    highlight('Being the most repeated name in the Tamborrada is not the same as being so in every company.'),

    heading('How did Nora reach so many companies?'),
    {
      kind: 'text',
      text: () =>
        `The answer begins with a comparison. In 2008 there were Noras in ${figures.y2008.companiesWithNora} of the ${figures.y2008.companies} companies. In 2026, in ${figures.y2026.companiesWithNora}. The paradox is explained here: Nora became present in almost the whole Children’s Tamborrada without becoming the favourite of most companies.`,
    },
    {
      kind: 'text',
      text: () =>
        `And that expansion came before the leadership. In 2011 there were Noras in ${figures.companies2011} companies. In 2013, when Nora was still ${figures.companies2013Rank}th overall, it was already in ${figures.companies2013}. Between 2014 and 2020 the figure moved between 32 and 34, and in 2023 it reached ${figures.companies2023} of the ${figures.registered2023} companies in that edition, its maximum. In 2026 it is ${figures.y2026.companiesWithNora}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `There is one more detail. Between 2008 and 2013 Nora went from 14 to 55 participants, but that increase coincides with its arrival in new companies rather than with more participants in each: the average barely changed, from ${f.decimal(figures.perCompany2008, 2)} per company to ${f.decimal(figures.perCompany2013, 2)}. In those years the name grew by moving from one company to another. From 2013 the opposite happened: it was already in almost all of them, and what grew was the number of Noras within each, up to ${f.decimal(figures.perCompany2020, 2)} in 2020 and ${f.decimal(figures.perCompany2026, 2)} in 2026.`,
    },
    highlight('First it spread; then it took root.'),

    heading('Do all companies choose the same names?'),
    text(
      'Nora’s paradox raises another question: if each company has its favourites, we can measure how much they resemble one another.'
    ),
    text(
      'Some preferences are persistent. At the Deutsche Schule, Martina has been the most repeated name in all four editions from 2023 to 2026. At Ekintza, Martín has headed or shared first place in all four, and was the sole leader in 2025 and 2026. But these are exceptions. In most companies first place changes almost every year. At Santo Tomás it was Jon in 2023, Jon and Mikel in 2024, Maddi in 2025 and Ane in 2026. At La Salle, Lucía in 2023 and 2024, Ane and Nora level in 2025 and Ane in 2026.'
    ),
    text(
      'Nora’s leadership in its four companies is, moreover, recent. In 2023 it headed none of the four; today it heads all of them. At Amara Berri, for example, first place belonged to Nahia in 2023 and 2024, was shared by Maddi and Nora in 2025 and passed to Nora in 2026.'
    ),
    {
      kind: 'text',
      text: () =>
        `The ten favourite names of each company also resemble one another little. Comparing the ${figures.top10Overlap.companies} companies present in all four editions from 2023 to 2026, any two companies share, on average, fewer than two of their ten most repeated names. If participants were distributed at random among those same companies, they would share a little over four. The companies resemble one another less than would be expected if the distribution were down to chance.`,
    },
    {
      kind: 'text',
      text: () =>
        `And some leading names barely appear in certain schools. Ane, second in the Tamborrada, does not appear even once among the ${figures.amaraBerri2026} participants of Amara Berri in 2026. As for Nora, none has appeared at San José Ikastetxea in the ${figures.sanJoseEditions} editions in which the company is registered, and the Deutsche Schule, which appears in all ${figures.deutscheEditions}, has had one in ${figures.deutscheEditionsWithNora} of them, but always in very small numbers.`,
    },
    text(
      'The data show these differences, not their cause. They do not record families’ economic level, their origin or each company’s language model, so we do not attribute the differences to any of those factors.'
    ),

    heading('Why Nora?'),
    {
      kind: 'text',
      text: () =>
        `It is the question that remains, and the one that can least be answered. An external reference helps place the name. Eustat, the Basque statistics institute, publishes the names of girls born in Euskadi, and between 2022 and 2025 Nora is always near the top. In Gipuzkoa it was the most frequent girl’s name in 2022 and 2023, the second in 2024 and the third in 2025. In Donostia it was second, first, second and third. Across Euskadi it ranked seventh, fourth, third and fourth, with between 90 and 113 births a year.`,
    },
    text(
      'Nora is not a name exclusive to the Tamborrada: it remains one of the most chosen among girls now born in Gipuzkoa. What the data do not allow is to reconstruct its earlier history or to measure how long a name takes to pass from births to the Tamborrada. The Eustat tables we have been able to check cover only 2022 to 2025, and our data do not include each participant’s age.'
    ),
    text(
      'Nor have we found any verified source explaining why families choose Nora. It is an open question, and we prefer to leave it so rather than invent an answer.'
    ),

    heading('Fourteen Noras in eight companies'),
    {
      kind: 'text',
      text: () =>
        `In 2008, being called Nora was an exception: fourteen participants spread across eight companies, and in the other ${figures.y2008.companies - figures.y2008.companiesWithNora} there was none. Eighteen years later, the proportion has turned around. ${figures.y2026.companiesWithNora} companies have at least one Nora and ${figures.y2026.companiesWithoutNora} have none.`,
    },
    text(
      'But it has not become the favourite everywhere. In most companies the most repeated name is still another, and each keeps its own preferences. Nora’s story is not that of a name that became every company’s favourite, but of one that managed to be present in almost all of them.'
    ),
    text(
      'Each edition of the Children’s Tamborrada is a photograph of a generation. Whoever marched in 2008 had Ane and Jon everywhere. Whoever marches now may find a Nora in more than four out of five companies.'
    ),
  ],
  data: {
    heading: 'The story in data',
    rise: {
      lede: (f) =>
        `**Nora goes from ${figures.y2008.nora} to ${figures.y2026.nora} participants and overtakes Ane in three editions: 2022, 2025 and 2026.** Participants with each name in each edition. The 2022 one was exceptional, with ${f.int(figures.y2022.participants)} participants (there are no data for 2009, 2010 or 2021).`,
      noraLabel: 'Nora',
      aneLabel: 'Ane',
    },
    milestones: {
      lede: '**Nora enters the Top 10 in 2015 and is first in 2022, 2025 and 2026.** Its position in each edition’s ranking, its number of participants and the companies in which it appears.',
      columns: ['Edition', 'Rank', 'Participants', 'Companies with Nora'],
      companiesCell: (withNora, registered) => `${withNora} of ${registered}`,
    },
    leaders: {
      lede: '**Each company has its favourite.** The most repeated name in some companies in 2026 and how many participants bear it (only companies with six or more). Nora highlighted.',
      barUnit: 'participants',
    },
    position: {
      lede: () =>
        `**Nora is first in ${figures.noraRankBuckets.first} of the ${figures.y2026.companies} companies, is among the top three in ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} and has no participants in ${figures.noraRankBuckets.none}.** Nora’s position within each company in 2026 (ties share a position).`,
      first: '1st',
      secondThird: '2nd or 3rd',
      fourthToTenth: '4th to 10th',
      eleventhOrLower: '11th or lower',
      none: 'None',
    },
    waffles: {
      lede: '**In 2008 there were Noras in eight companies; in 2026, in 35.** Companies with at least one participant named Nora. Each circle is a company.',
      label2008: () =>
        `2008: ${figures.y2008.companiesWithNora} of ${figures.y2008.companies} companies with a Nora`,
      label2026: () =>
        `2026: ${figures.y2026.companiesWithNora} of ${figures.y2026.companies} companies with a Nora`,
    },
    spread: {
      lede: () =>
        `**Nora was already in ${figures.companies2013} companies in 2013, when it ranked ${figures.companies2013Rank}th overall.** Companies with a Nora in each edition. In 2012 and 2022 there were fewer companies (25 and 26, against between 40 and 45 in the other editions). There are no data for 2009, 2010 or 2021.`,
      label: 'Companies with a Nora',
    },
    perCompany: {
      lede: (f) =>
        `**The average number of Noras per company rises from ${f.decimal(figures.perCompany2013, 2)} in 2013 to ${f.decimal(figures.perCompany2026, 2)} in 2026.** Participants named Nora divided by the companies in which they appear.`,
      label: 'Noras per company where it appears',
    },
    persistence: {
      lede: '**Some favourites hold; most change almost every year.** Most repeated name in selected companies in each edition.',
      columns: ['Company', '2023', '2024', '2025', '2026'],
      and: 'and',
      tie: '(tie)',
      many: 'Several names tied',
    },
    overlap: {
      lede: '**Two companies share on average fewer than two of their ten favourite names; with a random distribution they would share more than four.** Names in common among the ten most repeated of two companies, for the 41 present in all four editions from 2023 to 2026.',
      leftLabel: 'Random distribution among the same companies',
      rightLabel: 'Actual companies',
      value: (shared) => `${shared} of 10 names in common`,
    },
    eustat: {
      lede: '**Among girls born from 2022 to 2025, Nora was always among the top three names in Gipuzkoa and Donostia.** Nora’s position among girls’ names for each year of birth (Eustat).',
      columns: ['Year of birth', 'Euskadi', 'Gipuzkoa', 'Donostia'],
    },
  },
  used: {
    heading: 'Data used',
    blocks: [
      (f) =>
        `**What data.** Tamborradata’s published statistics on ${f.int(figures.editions)} editions of the Children’s Tamborrada: 2008, 2011 to 2020 and 2022 to 2026 (there are no data for 2009, 2010 or 2021), and aggregate counts over the participations of those editions. Queried on 9 November 2026, on the versions published on 18 October 2026.`,
      (f) =>
        `**What each figure counts.** We count participations, not people: someone who marches several years appears several times. Each participant counts once by their main name, and compound names count by the first one. The data carry no accents or eñes (for example, “Inigo”). The rankings are the published ones. With the same number of participants, the order is set by the publication: in 2008 four names gathered 14 participants and Nora’s is the last in that group, number 73, with 69 names above it; something similar happens in 2013, 2015 and 2017. The published lists add up to ${f.int(4012)} identified names in 2008 and ${f.int(5276)} in 2026, out of ${f.int(figures.y2008.participants)} and ${f.int(figures.y2026.participants)} participants.`,
      () =>
        '**What a company is.** Each of the entities registered in Tamborradata: schools, ikastolas and other groups. In 2026 there are 43; the number varies by edition (45 in 2011, 2023 and 2024; 25 in 2012 and 26 in 2022). A name “heads” a company when it gathers more participants than any other; if there is a tie, we say so. Ane leads three companies outright and shares first place in two others; Nora leads four outright. Nora’s position within each company, in the chart, lets ties share a position.',
      () =>
        '**How the companies’ favourites are compared.** We take the 41 companies present in all four editions from 2023 to 2026, add up the four editions and calculate the ten most repeated names of each (ties for tenth place are resolved alphabetically). We count the names shared by the 820 possible pairs of companies. For the random distribution, participants are reassigned among the same companies, respecting the size of each, and the calculation is repeated: three repetitions gave between 4.1 and 4.2 names in common.',
      () =>
        '**Limits.** The data do not record participants’ age, gender or origin, nor each family’s reasons. The 2012 and 2022 editions are smaller (2,768 and 2,849 participants) and their comparisons less stable. The Eustat tables we have been able to check cover only those born from 2022 to 2025 and show rankings, not births by territory. We have not been able to check an entry from Euskaltzaindia on the name or an earlier series of births, so we do not measure time lags or explain causes.',
      (f) =>
        `**Privacy.** Only aggregates are published; no participant figure below 5 appears (the smallest is ${f.int(figures.smallestFigure)}). When a count by company and edition is lower, it is shown only as a tie or not shown at all.`,
    ],
    sourcesLead: '**Verified external sources.**',
  },
};

const texts: ArticleTexts = {
  title: 'From 73rd place to first: how Nora spread across the Tamborrada Infantil',
  description:
    'In 2008, Nora ranked 73rd in Donostia’s Children’s Tamborrada, with 14 participants in eight companies. In 2026 it is the most repeated name, with 110 across 35 companies, although it heads only four.',
  category: 'Names',
  readTime: '11 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
