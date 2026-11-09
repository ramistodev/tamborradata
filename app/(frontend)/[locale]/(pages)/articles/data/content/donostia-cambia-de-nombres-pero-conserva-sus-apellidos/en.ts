import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { concentration, figures, perThousand, share, trajectories } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const copy: ArticleCopy = {
  story: [
    text(
      'In 2008, Ane and Jon were the most repeated first names among the boys and girls of Donostia’s Children’s Tamborrada. They were followed by Iñigo, Leire, María, Ander and Mikel. These were the names you heard again and again among the children of that generation.'
    ),
    text('Eighteen years later, that list looks like it belongs to another era.'),
    text(
      'In 2026, the most repeated first name is Nora. It is followed by Ane, Jon, Sara and Maddi. Of the ten names that headed the 2008 ranking, only two, Ane and Jon, are still among the first ten. The other eight have dropped out of the top of the list.'
    ),
    text('But when we look at the surnames of those same editions, something surprising happens.'),
    text(
      'García, Fernández, González, Martínez, Rodríguez, Pérez, Sánchez, López, Gómez and Martín were the ten most frequent surnames in 2008. In 2026 they are still the first ten. Nobody has come in and nobody has left: they have only swapped places among themselves.'
    ),
    text(
      'How can the way we name our children change so much while surnames stay practically intact?'
    ),
    text(
      'To find out, we went through the sixteen editions published on Tamborradata, from 2008 to 2026, and looked for answers outside the data: in official archives, in studies of twentieth-century migration and in the history of one family. Along the way, a second puzzle appeared.'
    ),

    heading('A list that renews itself little by little'),
    text(
      'The first thing the intermediate editions reveal is that the turnover of first names was no sudden stroke. From one edition to the next, between one and three of the first ten names usually change. They are small changes which, added up over almost two decades, leave an unrecognisable list. With surnames the opposite happens: in fourteen of the other fifteen editions, the top 10 shares nine or ten surnames with the 2008 one.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Nora is the best example of that slowness. In 2008 it was a discreet name, with ${f.int(trajectories.nora.count2008)} appearances. It grew steadily until it reached ${f.int(trajectories.nora.count2026)} in 2026, about ${f.int(perThousand.nora[perThousand.nora.length - 1])} in every thousand first names recorded, and that was enough to head the list. Alongside it, Telmo, Markel and Martin also added appearances, with ups and downs, until they entered the top 10.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `On the other side of the scale, María went from ${f.int(trajectories.maria.count2008)} appearances in 2008 to ${f.int(trajectories.maria.count2026)} in 2026, and Andrea from ${f.int(trajectories.andrea.count2008)} to ${f.int(trajectories.andrea.count2026)}. Iñigo and Leire, who were third and fourth, have lost more than half of their weight. Ane and Jon held on near the top, although with somewhat less weight than back then.`,
    },
    text(
      'This renewal is not a peculiarity of the Tamborrada. Eustat, the Basque statistics institute, records that the leading names among births in Gipuzkoa between 2022 and 2025 were Nora and June for girls, and Luka, Martin and Markel for boys. Four of them (Nora, June, Martin and Markel) are in the Tamborrada’s top 10 for 2026.'
    ),

    heading('A fashion and an archive'),
    text(
      'The simplest explanation lies in how each thing is decided. A first name is chosen: parents pick it at a particular moment, with the tastes of their generation, which is why fashions come and go. A surname is not chosen: it arrives already written, from two families, and is passed on to the next.'
    ),
    highlight('First names resemble a fashion; surnames resemble an archive.'),
    {
      kind: 'text',
      text: (f) =>
        `The Tamborrada’s records reflect those two mechanisms clearly. In 2008 the top 10 first names made up one in five of the first names recorded, and today they make up one in seven: the distribution has opened up and there is more variety. With surnames it is the other way round: the first ten account for a little more than before, from ${f.percent(share(concentration.y2008.topSurnames, concentration.y2008.surnameAppearances), 1)} to ${f.percent(share(concentration.y2026.topSurnames, concentration.y2026.surnameAppearances), 1)} of appearances. While children are spread across more first names, surnames concentrate a little more on the usual ones.`,
    },
    text(
      'Nor is this a peculiarity of the Tamborrada. According to Spain’s National Statistics Institute (INE), on 1 January 2025 the ten most frequent surnames among residents of Gipuzkoa are exactly these ten, with García at the head. The INE counts only the first surname, but the result matches.'
    ),
    highlight(
      'The Children’s Tamborrada’s surname list reproduces the province’s surname map.'
    ),

    heading('Basque first names, Castilian surnames'),
    text(
      'There is a detail in those lists that seems not to fit. Among the ten most repeated first names of 2008, eight have a Basque form: Ane, Jon, Iñigo, Leire, Ander, Mikel, Asier and Iker. In 2026 there are still five: Ane, Jon, Maddi, Nahia and Markel. Among the ten most repeated surnames, by contrast, there is not a single one of Basque origin, either in 2008 or in 2026.'
    ),
    text(
      'How can a city full of Basque first names inherit Castilian surnames? The answer begins with a prohibition. On 18 May 1938, an order of the Ministry of Justice of Franco’s government ruled that, “in the case of Spaniards, names must be recorded in Castilian”. Its preamble expressly cited Iñaki, Kepa and Koldobika as names that “denounce an indisputable separatist meaning”.'
    ),
    text(
      'The records of the time show the effect. According to the study by Gorrotxategi Nieto, of Euskaltzaindia’s Onomastics Service, almost a quarter of those born in 1937 in Bilbao’s Siete Calles had a Basque-language name; from July of that year, the author found no registration of a Basque name at all. Among the strategies he records is registering a girl as María Teresa so as to call her Maite at home.'
    ),
    text(
      'Everything changed with Law 17/1977 of 4 January, which allowed names to be recorded “in any of the Spanish languages”, and with the regulation that implemented it, approved in December of that year. Eustat sees the result in its birth statistics: among parents born between 1979 and 1993, Basque-language names were already the predominant ones, and eight of the ten most frequent names of mothers born between 1982 and 1995 were too. Basque went from being a forbidden name to being one of the preferred ones.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `But the story is not a straight line. Among the thirty most repeated first names of each edition, those of Basque form numbered ${f.int(figures.basqueTop30.y2008)} in 2008, rose to ${f.int(figures.basqueTop30.peakLow)} or ${f.int(figures.basqueTop30.peakHigh)} between 2013 and 2019, and have fallen every year since to ${f.int(figures.basqueTop30.y2026)} in 2026. The decline since 2019 appears under every criterion we tried, stricter or broader. What changes with the criterion is the comparison with 2008: depending on how you count, 2026 ends up anywhere from about four points above to fifteen below that year’s level. Basque first names are still very present, but since 2019 they have been losing ground in the top 30.`,
    },

    heading('Where surnames come from'),
    text(
      'Surnames tell another story, because they do not respond to the taste of the moment but to who arrived and who stayed. The Valentín de Foronda Institute of Social History (UPV/EHU) describes internal migration to the Basque Country as “a phenomenon of extraordinary importance during the twentieth century”. For Gipuzkoa, the study by Castells, Hernando, Izaola, Juaristi, López Romo and Zubero for the Ramón Rubial Foundation, published in 2018 and reported by EFE, puts the population at around 374,000 inhabitants in 1950 and 631,000 in 1970.'
    ),
    text(
      'According to that same work, around half of Gipuzkoa’s current population has its origin outside Euskadi. Among those who came, the 1986 census pointed mostly to Castilla y León (35%), followed by Extremadura (almost 19%), Navarre, Galicia and Andalusia.'
    ),
    text(
      'Those people settled, raised families and passed on their surnames. There are Basque surnames, but in the INE list for Gipuzkoa the first one to appear is Larrañaga, at number 13, followed by Garmendia. And mixing is common: a study of the 1998 census, cited by Montero in 2015, calculated that in Euskadi one in four inhabitants combined a Basque surname with a non-Basque one, and a little over half had no Basque surname at all.'
    ),
    text(
      'It is best not to go beyond what is known. The Tamborrada data do not say where each family comes from, and a Castilian surname does not by itself prove a recent arrival: it may have settled here long before. What we do know is that the twentieth-century Basque Country received a great many people with those surnames, and that surnames, unlike first names, are not renewed with every fashion: they are inherited.'
    ),

    heading('One family, two paths'),
    text(
      'I am an example myself. My name is Julen Ramos Arruti. Ramos came to me from my father, who inherited it from my grandfather: my grandfather was born in Segovia and came to Tolosa in search of a better life, and he found it. My paternal grandmother was always from Tolosa.'
    ),
    text(
      'Arruti comes from my mother’s family. My grandmother was from Igantzi and my aitona, from Gernika, came to Donostia after the bombing of Gernika on 26 April 1937. Today almost all of my close family lives in Donostia, and I have cousins and second uncles and aunts in Gernika, Igantzi, Tolosa and other places.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `In my name and surnames, then, two different journeys live together: that of someone who came to Gipuzkoa from outside Euskadi and that of someone who moved to Donostia from Bizkaia. Julen is a first name of Basque form that appears ${f.int(figures.given.count2008)} times in 2008 and ${f.int(figures.given.count2026)} in 2026; Ramos, ${f.int(figures.surname.count2008)} times in 2008 and ${f.int(figures.surname.count2026)} in 2026, the same relative weight in both editions. It proves nothing: a single case does not demonstrate a trend. But it helps to understand one.`,
    },

    heading('Names that pass, surnames that stay'),
    text(
      'Ordered year after year, the first names and surnames of the Children’s Tamborrada reveal two different rhythms.'
    ),
    text(
      'First names tell of a city that changes its tastes and that, after decades of prohibition, has recovered Basque-language names. Surnames hold the traces of families who came to Donostia from many places, and of others who were already here.'
    ),
    text(
      'Every child who marches today received a name chosen for their time and a surname that came from earlier generations.'
    ),
    highlight(
      'First names change because each generation chooses. Surnames remain because they are inherited.'
    ),
    text(
      'And every edition of the Children’s Tamborrada brings them together again in the same parade.'
    ),
  ],
  data: {
    heading: 'The story in data',
    names: {
      lede: '**Only Ane and Jon remain in the top 10 of first names.** The ten most repeated first names in the Children’s Tamborrada in 2008 and in 2026.',
      label2008: '2008',
      label2026: '2026',
    },
    overlap: {
      lede: '**First names drift away from the 2008 top 10; surnames hardly move.** How many of each edition’s first ten were already among the first ten of 2008 (there are no data for 2009, 2010 or 2021).',
      namesLabel: 'First names',
      surnamesLabel: 'Surnames',
    },
    surnames: {
      lede: '**The ten most repeated surnames are the same in the Tamborrada and in Gipuzkoa.** Rank of each surname in the Children’s Tamborrada (2008 and 2026) and among residents of Gipuzkoa (INE, 2025).',
      surnameColumn: 'Surname',
      tamborrada2008Column: 'Tamborrada 2008',
      tamborrada2026Column: 'Tamborrada 2026',
      gipuzkoaColumn: 'Gipuzkoa (INE, 2025)',
    },
    perThousand: {
      lede: (f) =>
        `**Nora went from ${f.int(perThousand.nora[0])} to ${f.int(perThousand.nora[perThousand.nora.length - 1])} in every thousand first names; María, from ${f.int(perThousand.maria[0])} to ${f.int(perThousand.maria[perThousand.maria.length - 1])}.** Appearances per thousand first names recorded in each edition (there are no data for 2009, 2010 or 2021).`,
      noraLabel: 'Nora',
      telmoLabel: 'Telmo',
      mariaLabel: 'María',
      aneLabel: 'Ane',
    },
    compare: {
      lede: '**Basque first names among the favourites, Castilian surnames at the head.**',
      leftLabel: 'First names of Basque form in the top 10',
      rightLabel: 'Surnames of Basque origin in the top 10',
      value: (early, recent) => `${early} of 10 in 2008 · ${recent} of 10 in 2026`,
    },
    basque: {
      lede: '**First names of Basque form have been falling since 2019.** Share of the appearances of each edition’s thirty most repeated first names that belong to names of Basque form, under three criteria (there are no data for 2009, 2010 or 2021).',
      strictLabel: 'Strict criterion',
      restrictiveLabel: 'Restrictive',
      broadLabel: 'Broad',
      chipsCaption: 'The first names we counted as being of Basque form (strict criterion)',
    },
  },
  used: {
    heading: 'Data used',
    blocks: [
      (f) =>
        `**What data.** Tamborradata’s published statistics on ${f.int(figures.editions)} editions of the Children’s Tamborrada: 2008, 2011 to 2020 and 2022 to 2026 (there are no data for 2009, 2010 or 2021). Queried on 9 November 2026, on the versions published on 18 October 2026.`,
      () =>
        '**What each figure counts.** We count participations, not people: someone who marches several years appears several times. For surnames, both the first and the second are counted, which is why they add up to more than first names. “Per thousand” means appearances per thousand first names recorded in that edition. The data carry no accents or eñes (for example, “Inigo”) and each spelling of a surname counts as a different surname (Etxeberria and Echeverria, for example).',
      () =>
        '**What a first name of Basque form is.** It is our own classification, because the database does not record it, applied to the thirty most repeated first names of each edition. The strict criterion counts names whose own form is Basque; the restrictive one leaves out Nerea, Ainhoa, Iñigo, Aitor, Ander and Alain; the broad one adds Nora, June, Aitana, Alain, Laia, Luka and Telmo. The decline since 2019 appears under all three; the comparison with 2008 does not.',
      () =>
        '**Limits.** The data do not say where each family comes from or why a name is chosen. The 2011, 2012 and 2022 editions are smaller (between 2,800 and 3,300 participants) and their comparisons less stable. The INE counts only the first surname, and the 1998 census figure covers the whole of Euskadi and is second-hand.',
      (f) =>
        `**Privacy.** Only aggregates are published; no figure below 5 appears (the smallest is ${f.int(figures.smallestFigure)}).`,
    ],
    sourcesLead:
      '**Verified external sources.** Titles are given in their original language; quotations in the text are our translations.',
    sourceNotes: {
      castells: 'Figures as reported by EFE/Noticias de Gipuzkoa on 23-10-2018.',
      montero: 'Cites a study of the 1998 census (Basque Country as a whole, second-hand).',
    },
  },
};

const texts: ArticleTexts = {
  title: 'Donostia changes its names, but keeps its surnames',
  description:
    'Only two of the ten most repeated first names in the 2008 Children’s Tamborrada are still in the 2026 top 10, while the ten leading surnames are the same: a story of fashions, prohibitions and migrations.',
  category: 'Names and surnames',
  readTime: '11 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
