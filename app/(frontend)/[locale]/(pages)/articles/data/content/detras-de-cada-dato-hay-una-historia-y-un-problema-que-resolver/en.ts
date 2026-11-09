import type { ArticleTexts } from '../../../types/article.types';
import { stepStatus } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { ambiguousShare, bothRoleShare, compoundNames, figures, tokenEvidence } from './figures';

const { martin } = tokenEvidence;

const copy: ArticleCopy = {
  intro: {
    simple:
      'At a glance it looks simple: read the names, count them and make a ranking. Anyone could do it with a spreadsheet.',
    hands:
      'But the names of the Children’s Tamborrada have been published over the years, on different pages, and each list was written by a different hand. Between the list and the number lies a road full of traps.',
    questionLabel: 'The question',
    question:
      'How do you turn a great many names, written in many ways and spread across many pages, into statistics you can trust?',
    problemsCaption: 'Things that can go wrong along the way',
    problems: [
      'The order of names and surnames changes',
      'A word can be a given name and a surname',
      'A school appears under several names',
      'The original contains errors',
      'Some years have incomplete information',
      'An update can fail halfway',
      'Automatic text can get things wrong',
    ],
    promise:
      'This article explains how Tamborradata deals with each of them, and also what it still cannot guarantee.',
  },
  names: {
    heading: 'Three words and no labels',
    person:
      'For a person, “Aitor Goikoetxea Lasa” holds no mystery: Aitor is the given name, and Goikoetxea and Lasa are the surnames. It is an invented name, only for the example.',
    personCaption: 'What a person sees at a glance.',
    givenLabel: 'given name',
    surnameLabel: 'surname',
    program:
      'For a program, though, they are three loose words. Nobody has told it which is which.',
    programCaption: 'What a program receives.',
    unknownLabel: '?',
    trouble: (f) =>
      `And this is the easy case. Some words work as both: Martin is a given name and it is a surname. Some lists reverse the order (“Goikoetxea Lasa, Aitor”). Some people have two given names, or a compound surname such as “de la Fuente”. Of the ${f.int(figures.distinctWords)} different words that appear in the names, ${f.int(figures.bothRoleWords)} (${f.percent(bothRoleShare)}) have been seen as a given name and also as a surname.`,
    counting: (f) =>
      `Tamborradata does not use a dictionary of names. It solves this by counting. Each time it reads a full name, it notes the position of each word: the first counts as a given-name signal (and counts ${f.int(figures.firstPositionWeight)} times), the others as surname signals. After reading the ${f.int(figures.participants)} records, each word has its own track record, and that track record becomes a probability.`,
    nlp: 'In technical terms, this is natural language processing (NLP): programs that interpret text written by people, here given names and surnames. And one of the simplest kinds: probabilistic, with no neural networks. If you want to call it artificial intelligence, it is a very small one: it learns from the data the system itself stores, but it is not a language model like ChatGPT, and its rules were set by a person.',
    tableCaption:
      'Track record of each word in the database: points accumulated as a given name and as a surname (the first position counts triple) and how many times it has appeared in first position, in the middle and at the end of a full name. These are loose words, not people.',
    wordColumn: 'Word',
    asGivenColumn: 'As a given name',
    asSurnameColumn: 'As a surname',
    firstColumn: 'First',
    middleColumn: 'Middle',
    lastColumn: 'Last',
    reading: (f) =>
      `Aitor almost always comes first: it is a given name. Goikoetxea has never appeared as a given name: it is always a surname. José comes almost always in first position or in the middle, which is why it works as a second given name. With Martin the story is different: it accumulates ${f.int(martin.asName)} points as a given name and ${f.int(martin.asSurname)} as a surname, and it appears in every position. It is in no man’s land, and the system knows it: to accept a middle word as a second given name, it requires the word’s record to support that clearly (${f.percent(figures.secondNameThreshold, 0)}). It was set at that value rather than at 50% precisely because of cases like Martin, which used to slip in as a second given name by mistake.`,
    humility:
      'The system is also cautious with what it has seen little. A word that has appeared only once is not taken as certain: it starts from 50/50 and moves away from it only as it is repeated.',
    decision: (f) =>
      `To decide the order it compares only the first and the last word: if “given name first, surname after” turns out to be clearly more likely than the opposite (with a fixed bar of ${f.percent(figures.orderThreshold, 0)}), it accepts it. The rest are simple rules: “de”, “del” or “la” attach to the next surname, and the form with a comma (“Goikoetxea Lasa, Aitor”) is turned around before starting.`,
    recordIntro:
      'The result, for each participant, is a small record stored in the database. This is how a name with two given names would look, “Aitor José Goikoetxea Lasa”, also invented.',
    recordCaption:
      'Example record. The confidence is calculated from the real track records of each word.',
    fieldColumn: 'Field',
    valueColumn: 'Value',
    primaryNameField: 'First name',
    namesField: 'Given names',
    surnamesField: 'Surnames',
    confidenceField: 'Confidence',
    statusField: 'Status',
    statusResolved: 'Resolved',
    secondNames: (f) =>
      `Thanks to this separation, statistics that are impossible with a simple split of words can be calculated, such as the ranking of second names or the number of participants with a compound name. In the database there are ${f.int(compoundNames.two)} participants with two given names and ${f.int(compoundNames.three)} with three.`,
    ambiguous: (f) =>
      `When there is no way to separate given name and surnames with confidence, the system does not guess. It marks the record as ambiguous and leaves it out of the name statistics. That is ${f.int(figures.ambiguous)} of ${f.int(figures.participants)} records: ${f.percent(ambiguousShare, 2)}.`,
    limit:
      'It learns in a very specific sense: its counting grows with the data the system itself stores. But its rules and thresholds do not change on their own, and records that have already been interpreted are not evaluated again when the counting improves.',
  },
  schools: {
    heading: 'One school, many names',
    problem:
      'Each list of the Children’s Tamborrada lives on a web page, and the school it belongs to is known only from two texts: the title of the page and its address. Those texts change from one year to the next. La Salle may appear as “La Salle”, “Lasalle” or “Salle”. If the system treated each form as a different school, La Salle’s history would be cut into pieces and the statistics by school would be worth nothing.',
    groupsCaption:
      'Forms in which the same school has appeared written, in the title or the address of its pages. They are shown as the system stores them, without accents.',
    formsLabel: (f, count) => `${f.int(count)} forms`,
    how: 'Tamborradata follows an order. First it cleans the text: it removes the words that do not tell one school from another (“colegio”, “ikastola”, “infantil”, “tamborrada”) and the company numbers, as in “compañía 2”. Then it looks the result up in a dictionary of known forms. If it does not find it, it compares by words, not by letters: it joins two names only if they share almost all their words. And if that does not work either, it registers a new school.',
    dictionary:
      'The important thing is that the dictionary grows on its own. Every page that is successfully recognised contributes all its forms, the one from the title and the one from the address, so next year’s page, even if it introduces a new name, is recognised if it keeps any form already known. In the database, forms as different as “Carmelo”, “Colegio Nino Jesus” and “Scientia Karmelo” are listed under the same school.',
    limits:
      'It has clear limits. It does not correct typos: “Arantzazuko” and “Arantzatzuko” are two different words to the system, and the typos in the dictionary got there because the other form of the same page did match. When in doubt, it creates a separate school instead of joining two different ones: that is why La Salle and San Luis La Salle, or Jesuitas and Jesuitinas, are different schools. And there is no human review step: if a merge goes wrong, it is only discovered by looking at the data.',
    figures: (f) =>
      `In the database we work with there are ${f.int(figures.schools)} schools that gather ${f.int(figures.schoolAliases)} written forms. ${f.int(figures.schoolsWithManyAliases)} of them have more than one form, up to ${f.int(figures.maxAliases)} in the case with the most.`,
  },
  journey: {
    heading: 'From an old page to a published statistic',
    intro:
      'With those two pieces we can follow the whole journey of a piece of data, from a page published years ago to the statistic you see on the website.',
    caption: 'The journey of a name, from the old page to the website.',
    steps: [
      {
        title: 'Find the pages',
        description:
          'It looks for the lists in three ways at once: the newspaper’s own listing, a search engine and the internet’s historical archive. None is enough alone: newly published pages are not yet in the search engines or the archive, which is why the newspaper’s listing is the first to know.',
      },
      {
        title: 'Wait until there is something to read',
        description: `The process runs every night from 15 to 22 January and does nothing until the newspaper has published a minimum number of lists: at least ${figures.minDiscoveredPages} pages, and half of those of the year, coming from its own listing.`,
      },
      {
        title: 'Detect what has changed',
        description:
          'It only looks again at the pages of the current year, and it does so by asking each one when it was last modified. If the date has not changed, it leaves the page as it is. It is a cheap check that relies on the date the page itself declares.',
      },
      {
        title: 'Read and filter',
        description: `It discards what is not a person (titles, addresses, roles such as “abanderada” or “tambor”) using hand-written lists: about ${figures.roleWords} role words and about ${figures.rolePhrases} phrases, in Spanish and Basque. And it repairs names that the newspaper joined without a space, only when it is clear.`,
      },
      {
        title: 'Recognise the school',
        description:
          'It cleans the title and the address of the page and looks them up in the dictionary of forms.',
      },
      {
        title: 'Interpret each name',
        description:
          'It separates given name and surnames by counting evidence. If there is no way to do it with confidence, the record is left as ambiguous.',
      },
      {
        title: 'Calculate the statistics',
        description:
          'It recalculates only the years whose data have changed, from the names that were well interpreted.',
      },
      {
        title: 'Publish a complete version',
        description:
          'The new version is prepared separately and the website switches to it all at once.',
      },
    ],
    canary: (f) =>
      `And there is a watchman that works once a week. It is called Canary and, like the canary in the mines, it fixes nothing: it warns. Every Monday it reads ${f.int(figures.canarySample)} already stored pages again (${f.int(figures.canaryFixed)} always the same and ${f.int(figures.canaryRandom)} chosen at random) and checks that the names that come out today are the same ones we stored. If the structure of the newspaper’s pages has changed and reading fails, or if the names differ on ${f.int(figures.canaryDriftPages)} pages or more (or on more than ${f.percent(figures.canaryDriftShare, 0)} of those checked), it sends a warning by email. It is meant for the months when nobody is looking, so that 20 January is not the first day anyone finds out something broke.`,
  },
  statistics: {
    heading: 'From thousands of rows to a ranking',
    categories: (f) =>
      `With the names well interpreted, the system calculates ${f.int(figures.categories)} categories of statistics: the most common name, names that debut or disappear, the evolution of each school, among others. For the most common name it is enough to count how many times each first name appears among the well-interpreted records and sort them; if there is a tie, alphabetically, so that the result is always the same.`,
    ripple:
      'Some statistics depend on the whole history. A name is “new” only if it had not appeared in any earlier edition, and a school is “veteran” if it has taken part in almost all the recent editions. That is why, if a piece of data from 2013 is corrected, everything has to be recalculated from 2013 to today, and also the statistic for all the years together.',
    reuse:
      'To avoid repeating work, each change in the data adds one to a counter for the affected year, and the system only recalculates the years whose counter does not match the one from the last publication. The others are not touched: their published version keeps being served. Those that change are recalculated in full, from scratch; they are not patched.',
    blanks: (f) =>
      `There are also deliberate gaps. The first edition has no “new names”, because everything would be new, and five editions of history are needed to talk about veteran schools. Of the ${f.int(figures.categories)} categories, a year publishes between ${f.int(figures.yearCategoriesMin)} and ${f.int(figures.yearCategoriesMax)} depending on the history available, and the set of all the years publishes ${f.int(figures.globalCategories)}. A missing category means “it cannot be calculated with confidence”; an empty category means “calculated, and there is nothing to count”.`,
  },
  publication: {
    heading: 'So that it is never seen half done',
    problem:
      'Imagine that the system starts recalculating all the statistics and stops when only part of them is finished. If the website showed each result as it was calculated, a visitor would see new figures and old figures at the same time: today’s ranking of names next to last week’s list of schools.',
    unsafeCaption: 'If each result were published as it is calculated',
    unsafeSteps: [
      {
        title: 'The ranking of names is recalculated',
        status: stepStatus.success,
        statusLabel: 'Published',
      },
      {
        title: 'The list of schools is recalculated',
        status: stepStatus.success,
        statusLabel: 'Published',
      },
      {
        title: 'The calculation of the evolution by year fails',
        status: stepStatus.danger,
        statusLabel: 'Error',
      },
      {
        title: 'The website shows new figures next to old figures',
        description: 'Nobody knows which part of the page is from today and which from last week.',
        status: stepStatus.danger,
        statusLabel: 'Half done',
      },
    ],
    safeCaption: 'With a version prepared separately',
    safeSteps: [
      {
        title: 'A new version is calculated, off to one side',
        description: 'Meanwhile, the previous version is still the only one visible.',
      },
      {
        title: 'It is checked that it is ready',
        description:
          'That the calculation finished without errors and that the data have not changed in the meantime.',
      },
      {
        title: 'The website switches to the new version, all at once',
        description: 'It is a single change. The previous version is archived; it is not deleted.',
        status: stepStatus.success,
        statusLabel: 'Published',
      },
      {
        title: 'If something fails before that, nothing changes',
        description: 'The visitor keeps seeing the previous version, complete and consistent.',
        status: stepStatus.success,
        statusLabel: 'No effect',
      },
    ],
    analogy:
      'It is like printing a new edition of a book alongside the previous one and, when it is finished and checked, swapping the copy the library puts on the shelf. Nobody ever sees a half-printed book.',
    verified:
      'The check is more modest than it sounds. The system verifies that the calculation finished without errors and that the data did not change while it was being calculated (if they did, it rejects the publication). It does not compare the result with a list of what “should” be there, nor look for odd figures: integrity comes from the fact that any error stops the calculation.',
    web: 'And there is a second lock in the database itself: the website can only read the published version of each period, even if the website’s code failed.',
    limits:
      'A limit worth knowing: publication is done one period at a time, not for the whole site at once. If an old piece of data is corrected and several periods have to be recalculated, for a while the website may show some years already updated and others not yet. And if a calculation fails, the website keeps serving the previous version while it is retried on the next scheduled run.',
    figures: (f) =>
      `In the database we work with there are ${f.int(figures.periods)} periods (${f.int(figures.yearPeriods)} editions and the set of all of them), each with a published version and none pending.`,
  },
  ai: {
    heading: 'When the numbers also have to be explained',
    problem:
      'Calculating a number is not the same as making it understandable. That is why Tamborradata accompanies the statistics with short summaries written by a language model: this time, yes, a generative artificial intelligence, from a different family than the names system. It calculates nothing, it only writes. And here a new problem appears: it can confidently write something that is not accurate.',
    how: (f) =>
      `The model does not receive a spreadsheet. It requests each statistic through a tool, only those of its section, and the numbers reach it already written exactly as they must appear, so that it copies them instead of calculating them. The direction of a trend (up, down or steady) is decided by the program, not the model: it is considered steady if the change is below ${f.percent(figures.stableTrendThreshold, 0)}.`,
    placeholders:
      'There is a detail that avoids many problems: the model never writes the name of a school. It writes an internal reference, and it is the website that replaces it with the current name when someone opens the page. It is like a form letter (“Dear…”) in which the person writing it never sees the address book.',
    benefits:
      'That has three practical advantages. The model cannot misspell a school’s name or mix it up with another. The translation keeps the reference intact (it is checked that they are the same and in the same order). And if a school’s name changes, the text is still valid, because the name is looked up at the moment it is displayed. If a reference cannot be resolved, that summary is not shown and the page keeps working without it.',
    translations:
      'The summaries are written first in English. The Spanish and Basque versions come from that already validated text.',
    limits:
      'It is worth knowing what is checked and what is not. The system verifies that the text does not repeat the year where it should not, that each reference points to a school that exists and that the translations keep the same references. It does not verify that each figure in the text matches the data, nor that the format is correct, nor that the translation respects proper names. Nor is there a human review step before they are published.',
    glitches:
      'There are real examples of what that lack of control lets through: a summary from 2026 has an unclosed emphasis (the same in all three languages), and in one translation “Inigo” became “Íñigo”.',
    failure:
      'If the generation of a summary fails, it does not block the publication of the statistics: the page comes out without that text, and at the start of each run a repair process tries again those that failed.',
    figures: (f) =>
      `In the database we work with there are ${f.int(figures.summaries)} published summaries (${f.int(figures.summariesPerLanguage)} per language), none failed or pending. In each language, ${f.int(figures.summariesWithSchoolRefs)} include references to schools: ${f.int(figures.schoolRefsPerLanguage)} references pointing to ${f.int(figures.schoolsReferenced)} different schools, all resolved.`,
  },
  quality: {
    heading: 'How good are the data?',
    intro:
      'Everything above is controls. The honest question is what they say about the real quality of the data. This is what we can state with the database in front of us.',
    tableCaption: 'Figures from the database we work with.',
    indicatorColumn: 'Indicator',
    valueColumn: 'Figure',
    participantsRow: 'Registered entries',
    editionsRow: 'Editions',
    schoolsRow: 'Schools',
    pagesRow: 'Source pages',
    resolvedRow: 'Resolved records',
    ambiguousRow: 'Ambiguous records',
    compareCaption: 'Resolving a name is not the same as checking it.',
    resolvedLabel: 'Resolved',
    resolvedDescription: (f) =>
      `${f.int(figures.resolved)} of ${f.int(figures.participants)} records: the system was able to separate the given name from the surnames.`,
    checkedLabel: 'Checked',
    checkedValue: 'Not measured',
    checkedDescription:
      'The database holds no manual review, so we cannot give an accuracy, only a resolution rate.',
    confusion:
      'It is best not to confuse them. A record being listed as “resolved” means the system found a possible separation, not that anyone has checked that it is the right one. And the “confidence” the system stores measures how far each word leans to one side, not the probability of being right.',
    coverage: (f) =>
      `The coverage has gaps too. There is no data for 2009 or 2010, and in 2021 there was no Tamborrada. The 2012 and 2022 lists include about ${f.int(figures.partialEditionSchools)} schools, compared with between ${f.int(figures.regularSchoolsMin)} and ${f.int(figures.regularSchoolsMax)} in the neighbouring editions: they are incomplete editions.`,
    dirty:
      'And not all public data is clean. Some things cannot be calculated because they come that way from the source, and there is no algorithm that detects them on its own. In the 2026 lists there are words such as “Lbai” or “Lrati”, which are probably typos of “Ibai” and “Irati”. To the system they are little-seen names, and it counts them as such.',
    duplicates: (f) =>
      `There are ${f.int(figures.repeatedNameKeys)} full names repeated within the same edition, always in different schools: ${f.percent(figures.repeatedExtraRowsShare, 2)} extra rows. We do not know whether they are namesakes, children signed up on two lists or duplicates from the source.`,
    integrity:
      'What does come out clean: the integrity checks we have run find no orphan rows, no schools without participants and no unexplained gaps in the published statistics.',
    closing:
      'Data quality does not mean promising perfection. It means knowing where the errors may be, putting controls where possible and saying clearly what cannot yet be guaranteed.',
  },
  conclusion: {
    heading: 'A list of names is not a statistic',
    summary:
      'Between a list of names and a statistic there is a long road: separating given names from surnames, recognising schools with many names, not recalculating what has not changed, not publishing half done and explaining the numbers without inventing them. None of those steps is perfect, and almost all of them have a limit worth knowing.',
    twoUses:
      'There is an idea that runs through the whole article: a list of participants is much more than a list. It contains names, years, schools… And that data serves two purposes at once. On one hand, it enriches the system itself: from the list, Tamborradata builds a probabilistic model that keeps accumulating evidence to interpret given names and surnames. On the other, that same list feeds the statistics that tell the story of those who have marched in the Children’s Tamborrada.',
    closing:
      'A reliable statistic is not one that is never wrong, but one that knows where it can be wrong.',
  },
};

const texts: ArticleTexts = {
  title: 'Behind every piece of data there is a story. And a problem to solve',
  description:
    'How thousands of names published over the years, written in countless ways, become statistics that can be trusted. And what still cannot be guaranteed.',
  category: 'How it is made',
  readTime: '11 min',
  articleContent: buildArticleContent('en', copy),
};

export default texts;
