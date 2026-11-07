import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { figures } from './figures';

const copy: ArticleCopy = {
  intro: [
    'It is 20 January, and the morning has that recognisable Donostia sound that arrives before the parade. Around the Children’s Tamborrada school groups, jackets are being adjusted, drums located, and children called back from a few steps away. A departure list may include Ane, Unai, Jon, Maddi, Nahia and Leire. Nobody has to stop the march to recognise them.',
    'The same page contains the words at the end of every line. García, González, Rodríguez, Fernández, Martínez and López recur. Read quickly, first name and surname make one practical unit: they check who is present, order a row and issue a pass. Taken apart, though, they raise a question about the record itself.',
    'Why do the first names at the head of these lists change more easily than first surnames? This is not a question designed to decide who belongs more, or to reconstruct anyone’s origins. It observes two repertoires living together in a public celebration and arriving on a registration sheet by different routes.',
    'A first name is usually chosen at a particular time. It may express a family preference, a literary reference, a sound becoming more familiar, or a form already close at hand. A surname does not enter a list in that way. It arrives through filiation and Article 109 of the Spanish Civil Code governs its order. That legal and social difference cannot explain every case, but it helps explain why the two rankings should not be expected to move at the same speed.',
    'Tamborradata lets us look at this difference without leaving the parade. It gathers the available Children’s Tamborrada lists and turns them into counts of participations. There are no interviews here, and no family stories concealed in a cell. There are first names and first surnames as recorded, ordered by edition and compared carefully.',
    'The result has a clear shape. The top of the first-name list renews itself. Nora and Maddi gain ground, Telmo reaches the leading positions, and Leire falls from its place years ago. First surnames change less at the front. García, González, Fernández, Rodríguez, Martínez, Pérez, López, Gómez, Hernández and Ruiz are in the top twenty in every observed year.',
    'That stability does not turn a surname into an identity, or a first name into proof of language, origin or family. It is worth saying once and plainly: these lists describe participations in a celebration, not biographies. Their interest is in the collective movement of words, not in assigning a personal story to the person carrying one.',
    'This is therefore a story of two tempos. We first locate the difference and its boundary. Then we follow several first names across editions and place the repertoires in their cultural and legal context. What remains is a more precise reading of what a Tamborrada list can say, and of everything it cannot. That precision matters in ordinary conversation too. Saying that a name rises is not celebrating or regretting a trend. Saying that a surname persists is not putting anyone in a box. It is observing how a shared tradition retains memory while also making room for new forms.',
  ],
  data: {
    heading: 'A comparison that does not mix incomplete years',
    coverage: (f) => `The main comparison sets two equally long periods with complete years against each other: ${figures.earlyPeriod}, with ${f.int(figures.earlyParticipations)} participations, and ${figures.recentPeriod}, with ${f.int(figures.recentParticipations)}. This avoids treating a shorter list or uneven coverage as a real change.`,
    records: 'We count participations, not unique people. A child can march in several editions and appear more than once. For each participation we use the recorded first name and first surname. That makes it possible to compare the shape of lists, not to follow lives or speak about birth cohorts. It also does not turn a written form into a fixed category: we do not group variants, regularise surnames to an assumed canonical version, or guess why an entry was made. That discipline matters because a good count begins by not making promises its columns cannot support.',
  },
  concentration: {
    heading: 'The top opens up for first names, not surnames',
    opening: (f) => `The clearest signal appears when we measure how much space the top ten occupy. In 2008, the ten most frequent first names accounted for ${f.percent(figures.topTenNames2008, 2)} of participations. In 2026 they account for ${f.percent(figures.topTenNames2026, 2)}. The fall is more than six percentage points: familiar leading names remain, but they share the spotlight with more alternatives.`,
    namesCaption: 'The ten most frequent first names lose weight between 2008 and 2026. What matters is the distribution: the top leaves more room for other names.',
    surnamesCaption: 'The ten leading first surnames keep a similar share between 2008 and 2026. Against the change in first names, this continuity is the central contrast.',
    earlyLabel: '2008',
    recentLabel: '2026',
    conclusion: 'Surnames travel in the opposite direction. Their top ten go from 11.12% to 12.41% of participations. This is not a huge difference, and it should not be overstated. It is enough to say that while the first-name summit disperses, the surname summit keeps, and slightly gains, weight. The comparison does not assign a cause to each family. It describes a trace compatible with two different mechanisms: choosing a first name and passing on a surname. Stability does not mean immobility, either. There are entries and exits, and less frequent surnames change position. What remains is the overall shape of the very top, not an exceptionless rule.',
  },
  turnover: {
    heading: 'The handover happens in the top twenty',
    opening: 'The second test compares rankings from the two complete periods. Of the twenty leading first names in 2013–2016, twelve remain in the 2023–2026 top twenty and eight are replaced. Asier, Eneko, Iñigo, Leire, María, Naroa, Oier and Pablo leave. June, Maddi, Markel, Martin, Martina, Noa, Sara and Telmo arrive. The group does not vanish at once, but it makes room for a new set of favourites.',
    tableCaption: 'Overlap between the 2013–2016 and 2023–2026 rankings. It shows why change belongs to the leading positions, not to the whole repertoire.',
    namesLabel: 'First names in both periods',
    surnamesLabel: 'Surnames in both periods',
    conclusion: (f) => `The replacement is much smaller for first surnames: ${f.int(figures.topTwentySurnamesRetained)} of twenty remain. Only Artola, Etxeberria and Ramos give way to Muñoz, Ortega and Vázquez. Yet when the view expands to the top 100, overlap is nearly equal: ${f.int(figures.topHundredNamesRetained)} names and ${f.int(figures.topHundredSurnamesRetained)} surnames. That is the decisive qualification. These are not two separate worlds, but a difference concentrated at the head of the lists.`,
  },
  trajectories: {
    heading: 'Nora, Maddi, Telmo, Leire, Jon, Ane and Unai',
    nora: (f) => `Annual rankings give movement to that conclusion. Nora was ranked ${f.int(figures.nora2008Rank)} in 2008, with ${f.int(figures.nora2008Count)} participations. In 2026 it is first, with ${f.int(figures.nora2026Count)}. Maddi goes from rank ${f.int(figures.maddi2008Rank)} and ${f.int(figures.maddi2008Count)} participations to fifth and ${f.int(figures.maddi2026Count)}. Telmo, ranked 50th in 2008, reaches sixth in 2026. These are rises within participation lists, not labels for a birth cohort.`,
    otherNames: (f) => `Declines and persistence matter too. Leire was fourth in 2008 and fourth again in 2013; in 2026 it is rank 30, with 37 participations. Jon was the most frequent name from 2011 to 2015 and is third in 2023–2026. Ane was first in 2008, from 2016 to 2020, and from 2023 to 2024; it is second in 2025 and 2026. Unai captures another form of persistence: twelfth in 2008, it reached ${f.int(figures.unai2017Count)} participations in 2017 and is still sixteenth in 2026.`,
    continuity: 'None of these straight lines explains a fashion on its own. Together they show something more modest and useful: turnover coexists with a resilient base. Some preferences move quickly, while others stay near the top for many years. No first name replaces another as if the parade had changed language or population from one edition to the next.',
  },
  culture: {
    heading: 'Repertoires meeting on one list',
    repertoire: 'Ane, Jon, Ander, Nora, Iker, Nahia, Unai, Leire and Maddi appear as personal-name entries in EODA, Euskaltzaindia’s Basque onomastic repertoire. The institution includes a historical lexical and documentary note for Unai, and describes Maddi as an Iparralde hypocoristic of Maria. These are pieces of cultural context for reading name forms, not a key for classifying people on a list.',
    legal: 'This context also has a public framework. The 1979 Statute of Gernika recognises Euskara as Euskadi’s own co-official language and Euskaltzaindia as its official advisory institution. An EODA entry, like that framework itself, helps explain a repertoire’s public life. It does not prove what language a participant speaks, which tradition their family follows, or why a name was chosen.',
    coexistence: 'Surnames show the other half of the scene. García, González, Rodríguez, Fernández, Martínez and López, with Pérez, Gómez, Hernández and Ruiz, are forms broadly distributed in Spain. In Tamborradata, García has an average annual rank of 1.6. More important than that decimal is the continuity: those ten surnames are in the annual top twenty throughout the observed data, and Sánchez, Martín, Jiménez and Álvarez do so in fifteen of sixteen years. They are not blocs competing for the city’s identity. They are repertoires coexisting in its lists.',
  },
  conclusion: {
    heading: 'What a list tells us, and what remains outside it',
    summary: 'The Children’s Tamborrada does not offer a portrait of who Donostia is. It offers something smaller and verifiable: a run of lists in which chosen first names renew more quickly at the top, while first surnames remain more stable. Unai and García make the point visible because one line joins two ways of arriving on paper. The strength of that conclusion is not in turning a coincidence into a total story. It lies in separating what data show from what can only be imagined.',
    method: (f) => `Method and sources. The analysis uses the ${f.int(figures.observedYears)} available editions of the Children’s Tamborrada. Its principal historical comparisons use only 2013–2016 and 2023–2026, equally long complete periods, with ${f.int(figures.earlyParticipations)} and ${f.int(figures.recentParticipations)} participations. Data are missing for 2009, 2010 and 2021; 2012 and 2022 have partial coverage, and 2011 surname formatting has an anomaly, so no series presents all years as equivalent. We count participations, not people, and only first names and first surnames. Context comes from Euskaltzaindia’s EODA, the Statute of Gernika and Article 109 of the Civil Code. Results describe aggregated rankings and cannot infer language, nationality, origin, ancestry, family or cause for an individual participation.`,
    closing: 'On the morning of 20 January, a list helps the parade move forward. Read carefully, it also reveals how its words change. The life of every child and every family is not written there.',
  },
};

const texts: ArticleTexts = {
  title: 'Unai García: what our first names and surnames say about Donostia',
  description: 'Chosen first names change sooner at the top of the Children’s Tamborrada; transmitted surnames have a different continuity.',
  category: 'Names and surnames',
  readTime: '10 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
