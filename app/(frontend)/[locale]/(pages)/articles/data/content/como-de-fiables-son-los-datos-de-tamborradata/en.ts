import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, participations, ambiguous } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = participations.length - 1;

const copy: ArticleCopy = {
  story: [
    {
      kind: 'text',
      text: (f) =>
        `In 2026, Tamborradata records ${f.int(participations[last])} participants in the Children’s Tamborrada. Of these, ${ambiguous[last]} appear in no ranking of names: the program that sorts the data could not decide which part was the first name and which the surname, and preferred to leave them out rather than guess.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `It is a very small share, but it sums up the question of this article. Every time Tamborradata says that Nora is the most repeated name or that García is the most frequent surname, behind it there are ${f.int(figures.total)} rows copied from lists published over sixteen editions. They are lists written by different people, in different formats, and sometimes with errors that were already there at the source. So how reliable is Tamborradata’s data?`,
    },
    text(
      'To answer, we ran three tests. First, comparing the data with external sources, starting with the most demanding one: the organisers’ own figures. Second, checking that the numbers add up on their own terms. And third, the least comfortable: showing what could not be cleaned.'
    ),

    heading('The toughest test: the organisers’ figures'),
    {
      kind: 'text',
      text: (f) =>
        `Donostia Kultura, which organises the Tamborrada, publishes every year how many children march in the Children’s Tamborrada and how many schools and other centres they come from. At first sight, Tamborradata’s figures do not match, and the difference goes in two directions. Up to 2020 they are somewhat lower: ${f.int(4807)} participants in 2017 against ${f.int(4977)}, and ${f.int(4683)} in 2020 against ${f.int(4828)}. From 2023 they are between 10% and 12% higher: ${f.int(5219)} against ${f.int(4731)} in 2023, ${f.int(5320)} against ${f.int(4732)} in 2024 and ${f.int(5149)} against ${f.int(4625)} in 2025.`,
    },
    text(
      'The explanation seems to lie in four companies. Since 2022, Tamborradata’s data include the children’s parades of three societies, Amaratarra Txiki, Kresala Txiki and Gaztelubide Txiki, and that of the Unión Artesana. The organisers list them separately in their annual reports, and the Unión Artesana’s parade took place on 19 January 2023, a day before the main parade.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `If those four are subtracted, the figures almost meet: ${f.int(4672)} against ${f.int(4731)} in 2023, ${f.int(4710)} against ${f.int(4732)} in 2024 and ${f.int(4506)} against ${f.int(4625)} in 2025, between 0.5% and 2.6% lower. The companies match too: the organisers speak of 41 centres in 2023 and 2024 and of 38 in 2025, and without those four Tamborradata counts 41, 41 and 38. In 2017 both give 42. Without those companies, moreover, the 2023 total (${f.int(4672)}) is somewhat lower than that of 2020 (${f.int(4683)}): a good part of the apparent jump is due to the database adding new companies, not to more children marching.`,
    },
    text(
      'It is an explanation that fits the numbers, but it is not confirmed: the organisers do not say exactly what their count includes. And a remainder is left. Tamborradata has between 0.5% and 3.4% fewer participants than the organisers in every year compared, and in 2020 one company fewer (40 against 41). It may be due to incomplete lists at the source or to other differences in counting; the data do not allow us to say.'
    ),
    highlight('Without the Txiki companies, Tamborradata’s 2023 data are somewhat lower than those of 2020.'),

    heading('Do they agree with other sources?'),
    text(
      'Surnames are the cleanest comparison. The ten most repeated surnames in the Children’s Tamborrada in 2026 (García, González, Martínez, Fernández, Rodríguez, Pérez, López, Sánchez, Martín and Gómez) are exactly the ten most frequent first surnames among residents of Gipuzkoa according to the INE on 1 January 2025. Some change places: Martínez is third in the Tamborrada and eighth in Gipuzkoa. But none is missing and none is extra.'
    ),
    text(
      'With first names the comparison is weaker, although it points in the same direction. Eustat, the Basque statistics institute, publishes the names of newborns in Gipuzkoa. Those that led between 2022 and 2025 were Nora and June among girls, and Luka, Martin and Markel among boys. Four of those five, Nora, June, Martin and Markel, are among the top ten of the 2026 Tamborrada.'
    ),
    text(
      'These matches say something specific and are silent on something else. That the Tamborrada’s surnames coincide with those of Gipuzkoa indicates that the participants resemble the population around them. It does not show that every row has been copied correctly: a list with errors scattered at random would give a similar result, because noise does not change the most common surnames. And the populations are not the same: the INE counts residents of all ages and only the first surname, and Eustat counts newborns, not participants.'
    ),
    highlight('That the data resemble their surroundings shows they are representative, not that they are correctly copied.'),

    heading('Do the numbers add up?'),
    {
      kind: 'text',
      text: (f) =>
        `To know whether they are correctly copied, we have to look inward. Each edition has two figures: the participations in the database and the identified names that the published rankings add up to. They do not match. In 2026 there are ${f.int(participations[last])} participations and ${f.int(participations[last] - ambiguous[last])} identified names; in 2008, ${f.int(participations[0])} and ${f.int(participations[0] - ambiguous[0])}.`,
    },
    text(
      'The difference is not a mismatch, but a sum that explains itself. Edition by edition, the participations missing from the rankings are exactly the ambiguous ones: 22 in 2026, 28 in 2008, 10 in 2013. All sixteen editions add up, case by case. An independent count of Nora, made from scratch on the rows, also matches the published rankings: 14 in 2008 and 110 in 2026.'
    ),

    heading('What could not be cleaned?'),
    text(
      'This is the part that most needs to be shown. Tamborradata does not invent the data: it copies them from published lists and sorts them with a program. But some things were already wrong at the source, and no program can fix them without guessing.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `The most visible are the ${figures.ambiguous} ambiguous participations, ${f.decimal(figures.ambiguousPct, 1)}% of the total. In ${figures.ambiguousShortNames} of them the written name has one or two words and in ${figures.ambiguousThreeWords}, three: with so few words there is little to go on to separate the first name from the surnames. They are left out of the rankings of names. There are also ${figures.noPrimaryName} participations in which the program could not settle on a main name.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Then there are the source formats. In 2008, ${f.decimal(figures.commaShare2008, 1)}% of the entries were written as “Surnames, Name”, and in 2017, ${f.decimal(figures.commaShare2017, 1)}%; in the other editions, almost none. There are ${figures.singleWord} single-word entries (11 of them in 2012 and 5 in 2017), ${figures.parentheses} with parentheses and ${figures.sixOrMoreWords} with six or more words. Most have been resolved, but every row that departs from the usual form is more likely to end up wrongly assigned.`,
    },
    highlight('When in doubt, Tamborradata leaves the participation out of the names rather than guess it.'),
    {
      kind: 'text',
      text: (f) =>
        `And there is a larger grey area: ${f.int(figures.lowConfidence)} participations, ${f.decimal(figures.lowConfidencePct, 1)}%, were resolved with low confidence. The program assigned them a name, but with less certainty than usual. Their weight is not constant: it was ${f.decimal(figures.lowConfidence2008Pct, 1)}% in 2008, fell to ${f.decimal(figures.lowConfidenceMin, 1)}% around 2018 and 2020, and has risen again to ${f.decimal(figures.lowConfidence2026Pct, 1)}% in 2026. We do not know why: the data only allow us to record the change.`,
    },
    {
      kind: 'text',
      text: () =>
        `There is more noise at the source in what looks simplest. The ${figures.companiesRegistered} companies in the database appear written in ${figures.companyAliases} different ways, up to ${figures.maxAliases} for a single one, and they are unified with an equivalence table. And the data carry no accents or eñes, so Iñigo appears as “Inigo”, and Ane and Ana count as different names.`,
    },

    heading('Three incomplete editions'),
    {
      kind: 'text',
      text: (f) =>
        `The most serious limitation lies not in the rows, but in the editions. In 2012 and 2022 whole companies are missing: there are data for only ${figures.partial2012.companies} and ${figures.partial2022.companies}, against the 40 to 45 of the other editions. Those that do appear have their usual size: the ${figures.partial2012.sizeVs2013.common} companies from 2012 that are also in 2013 add up to ${f.int(figures.partial2012.sizeVs2013.edition)} participants against ${f.int(figures.partial2012.sizeVs2013.reference)} the following year, and the ${figures.partial2022.sizeVs2020.common} from 2022 that were in 2020 add up to ${f.int(figures.partial2022.sizeVs2020.edition)} against ${f.int(figures.partial2022.sizeVs2020.reference)}. The gap is in companies, not in participants within each one.`,
    },
    text(
      'In 2011 the opposite happens: almost all the companies are there, 45, but many with half-complete lists. Of the 42 that also appear in 2013, 15 have fewer than 60% of the participants they register two years later, and 21 have fewer than 80%.'
    ),
    text(
      'We do not know whether they are missing because they did not march or because the source did not publish them. The data only allow us to say that they are not there, and that is why comparisons between editions are better made with proportions than with absolute figures.'
    ),

    heading('What they are good for and what they are not'),
    text(
      'The honest answer has three parts. Within a complete edition, the rankings of names and surnames are reliable: the numbers add up and the surnames match those of Gipuzkoa. Between editions, proportions hold up better than absolute figures, especially with 2011, 2012 and 2022. And in fine detail, a specific company in a specific year, a single badly resolved case can move a name up or down a place.'
    ),
    {
      kind: 'text',
      text: () =>
        `Back to those ${ambiguous[last]} participants from 2026 who were left out of the names: they are proof that the system hesitates when it should. A list that never hesitates would be far less trustworthy.`,
    },
  ],
  data: {
    heading: 'The story in data',
    surnames: {
      lede: '**The ten most repeated surnames in the Tamborrada are the top ten in Gipuzkoa.** Rank of each surname in the 2026 Children’s Tamborrada and among residents of Gipuzkoa (INE, 2025).',
      columns: ['Surname', 'Tamborrada 2026', 'Gipuzkoa (INE, 2025)'],
    },
    names: {
      lede: '**Four of the five names leading births in Gipuzkoa are in the Tamborrada’s top 10.** Names in the 2026 top 10 that also led births in Gipuzkoa between 2022 and 2025 (Eustat).',
      caption: 'Names in common',
    },
    official: {
      lede: '**Without the four Txiki companies, Tamborradata is between 0.5% and 3.4% below the organisers’ figures.** Participants and centres according to Donostia Kultura (the 2025 figure, according to Orain) and according to Tamborradata, excluding Unión Artesana, Amaratarra Txiki, Kresala Txiki and Gaztelubide Txiki. There is no comparable figure for the other editions.',
      columns: [
        'Edition',
        'Participants (organisers)',
        'Participants (Tamborradata)',
        'Difference',
        'Centres (organisers)',
        'Companies (Tamborradata)',
      ],
    },
    reconcile: {
      lede: '**The difference between participations and identified names matches the ambiguous cases, edition by edition.** Participations, names identified in the published rankings and ambiguous cases (there are no data for 2009, 2010 or 2021).',
      columns: ['Edition', 'Participations', 'Identified names', 'Difference', 'Ambiguous cases'],
    },
    residue: {
      lede: (f) =>
        `**${f.decimal(figures.lowConfidencePct, 1)}% of participations were resolved with low confidence and ${f.decimal(figures.ambiguousPct, 1)}% are ambiguous.** Participations with problems out of a total of ${f.int(figures.total)} over sixteen editions. The same participation may appear in several rows.`,
      columns: ['What', 'Participations', 'Share of total'],
      rows: {
        lowConfidence: 'Resolved with low confidence',
        commaFormat: 'Written as “Surnames, Name”',
        ambiguous: 'Ambiguous (left out of the rankings of names)',
        noPrimaryName: 'No main name',
        sixOrMoreWords: 'With six or more words',
        singleWord: 'Single-word',
        parentheses: 'With parentheses',
      },
    },
    confidence: {
      lede: (f) =>
        `**The weight of doubtful resolutions fell from ${f.decimal(figures.lowConfidence2008Pct, 1)}% to ${f.decimal(figures.lowConfidenceMin, 1)}% and has risen again to ${f.decimal(figures.lowConfidence2026Pct, 1)}%.** Share of each edition’s participations resolved with low confidence (there are no data for 2009, 2010 or 2021).`,
      label: 'Low confidence (%)',
    },
    coverage: {
      lede: '**Three editions are incomplete, for different reasons.** Companies with data in each one and what is missing.',
      columns: ['Edition', 'Companies', 'What happens'],
      rows: [
        {
          edition: '2011',
          detail: () =>
            `Almost all, but ${figures.partial2011.under60} of ${figures.partial2011.common} with fewer than 60% of their 2013 participants`,
        },
        {
          edition: '2012',
          detail: () => 'Whole companies are missing; those present have their usual size',
        },
        {
          edition: '2022',
          detail: () => 'Whole companies are missing; those present have their usual size',
        },
      ],
    },
  },
  used: {
    heading: 'Data used',
    blocks: [
      (f) =>
        `**What data.** Tamborradata’s published statistics on ${f.int(figures.editions)} editions of the Children’s Tamborrada: 2008, 2011 to 2020 and 2022 to 2026 (there are no data for 2009, 2010 or 2021), and aggregate counts over the participations of those editions. Queried on 9 November 2026, on the versions published on 18 October 2026.`,
      () =>
        '**What each figure counts.** We count participations, not people. “Ambiguous” is a participation whose name the program could not separate from the surnames with certainty; it does not enter the rankings of names. “Low confidence” is a resolution assigned with a program confidence below 0.8 out of 1; it does enter the rankings. The categories in the table of what could not be cleaned may overlap.',
      () =>
        '**How external sources are compared.** The INE gives the most frequent first surname by province of residence on 1 January 2025, for residents of all ages. Eustat gives the most frequent names of newborns in Gipuzkoa between 2022 and 2025. These are different populations from that of the Tamborrada: the comparison indicates resemblance, not exactness. Donostia Kultura gives participants and centres for the Children’s Tamborrada parade; the 2025 figure comes from Orain, which cites 4,625 participants in the text and “5000” in the headline, and the 2024 press release gives 4,732 and 4,731. The type of entity counted as a “centre” varies between releases (schools, entities, associations). The 2022 edition was organised as five neighbourhood parades and has no comparable figure.',
      () =>
        '**Incomplete editions.** The size of each company is compared with its size in a nearby complete edition (2013 for 2011 and 2012; 2020 for 2022). A list is considered half-complete if it holds fewer than 60% of the participants of that reference.',
      () =>
        '**Limits.** The data carry no accents or eñes, and each spelling of a surname counts as a different surname. We do not know why companies are missing in 2012 and 2022, nor why the share of doubtful resolutions has risen. We have not been able to check official figures for 2008, 2011 to 2016, 2018, 2019 or 2026. That the four Txiki companies explain the difference with the organisers is an explanation that fits the numbers, not a confirmed fact.',
      (f) =>
        `**Privacy.** Only aggregates are published; no figure below 5 appears (the smallest is ${f.int(figures.smallestFigure)}).`,
    ],
    sourcesLead: '**Verified external sources.**',
  },
};

const texts: ArticleTexts = {
  title: 'How reliable is Tamborradata’s data?',
  description:
    'We compare Tamborradata’s data with the organisers’ figures, the INE and Eustat, check that the numbers add up and show what could not be cleaned: ambiguities, source formats and three incomplete editions.',
  category: 'Data',
  readTime: '9 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
