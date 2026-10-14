import type search from '../es/search';

export default {
  title: 'Search participants',
  metadata: {
    title: "Search Children's Tamborrada Participants in Donostia",
    description:
      "Search participants of the Children's Tamborrada of Donostia by name and school and see which years they took part. Editions from {startYear} to {endYear}.",
    descriptionFallback:
      "Search participants of the Children's Tamborrada of Donostia by name and school and see which years they took part, with a link to the original source.",
  },
  hero: {
    titleLine1: 'Search for a participant',
    titleLine2: "of the Children's <accent>Tamborrada</accent>",
    description:
      "Type the first name and both surnames, choose the school and find out in which years they took part in the Children's Tamborrada of Donostia. Each year links to its original source.",
    about:
      "This search tool covers the participants of the Children's Tamborrada of Donostia, the yearly parade of child drummers and cantineras (it is not a competition). It shows in which years a person appears at the chosen school and links to the original source of each year.",
  },
  form: {
    ariaLabel: 'Participant search',
    hint: 'All fields are required: type at least three words (first name and two surnames) and choose a school.',
    name: {
      placeholder: 'First name and two surnames',
      ariaLabel: 'First name and two surnames',
    },
    school: {
      placeholder: 'School',
      ariaLabel: 'School',
      searchPlaceholder: 'Search school...',
      searchAriaLabel: 'Search school',
      empty: 'No school matches',
      resultsCount:
        '{count, plural, =0 {No school matches} one {# school found} other {# schools found}}',
    },
    submit: 'Search',
  },
  results: {
    title: 'Search results',
    loading: 'Searching…',
    announce:
      'Search complete: {records, plural, one {# matching record} other {# matching records}} and {participations, plural, one {# participation} other {# participations}} for “{participant}” at {school}.',
    summary: {
      records: '{count, plural, one {# matching record} other {# matching records}}',
      participations: '{count, plural, one {# participation} other {# participations}}',
      query: '“{participant}” · {school}',
      clear: 'Clear search',
    },
    card: {
      exact: 'Exact match',
      compatible: 'Compatible match',
      count: '{count, plural, one {# participation · source} other {# participations · sources}}',
    },
    row: {
      viewSource: 'View source',
      viewSourceAriaLabel: 'View source for {year} at {host}, opens in a new tab',
      noSource: 'No source',
    },
  },
  status: {
    prompt: {
      title: 'Enter first name, surnames and school',
      description:
        'Type the full name as you know it. It does not have to match the record word for word, and accents do not matter. Then choose the school.',
    },
    noResults: {
      title: 'We found no matches',
      description:
        'There is no record matching that name at this school. Check that it is spelled correctly or try another school.',
    },
    error: {
      title: 'The search could not be completed',
      description: 'An error occurred or the request took too long. Please try again.',
      retry: 'Try again',
    },
  },
  overview: {
    title: 'Data available in the search',
    summary:
      'Participations recorded across {editionsCount, plural, one {<highlight>#</highlight> edition} other {<highlight>#</highlight> editions}} and {schoolsCount, plural, one {<highlight>#</highlight> distinct school} other {<highlight>#</highlight> distinct schools}}. This is everything you can find in the search.',
  },
  timeline: {
    ariaLabel: 'Editions from {startYear} to {endYear}',
    gapsCount: '{count, plural, one {# year without data} other {# years without data}}',
    gapsCaption: 'Gaps: {years}',
    missingYear: '{year}: no data',
    missingRange: '{from}–{to}: no data',
  },
  topStats: {
    name: 'Most repeated first name',
    surname: 'Most repeated surname',
    school: 'School with the most participants',
    count: '{count, plural, one {# participation} other {# participations}}',
  },
  structuredData: {
    home: 'Home',
    keywords:
      "search Children's Tamborrada participants, participation history, Children's Tamborrada Donostia, drummers and cantineras, participation by school, Diario Vasco",
    appName: "Children's Tamborrada participant search",
    appDescription:
      "Web tool to search participants of the Children's Tamborrada of Donostia by name and school and check in which years they took part. Editions from {startYear} to {endYear}.",
  },
  faq: {
    kicker: 'Frequently asked questions',
    title: 'Frequently asked questions',
    items: {
      scope: {
        question: "What can I look up in the Children's Tamborrada search?",
        answer:
          "You can check in which editions of the Children's Tamborrada of Donostia a person appears over the years. Each result shows the name as it was published, the school, the years of participation and a link to the source where that participation was obtained.",
      },
      requirements: {
        question: 'What do I need to search for someone?',
        answer:
          'Type at least three words (for example, the first name and both surnames) and choose the school. Capital letters and accents do not matter. If the person has two first names, you can leave out the second one.',
      },
      whySchool: {
        question: 'Why do I have to choose a school?',
        answer:
          'Because many first names and surnames are repeated among the participants, and the school makes it possible to tell people apart. The search is made only within the school you choose. Also, for data protection, so that nobody can run mass searches of participants.',
      },
      matchTypes: {
        question: 'What do “exact match” and “compatible match” mean?',
        answer:
          '“Exact” means that the name you typed matches the registered one word for word. “Compatible” means that what you typed fits a record that has more or less information: for example, a second first name that you did not type or a single surname. We cannot guarantee that a compatible result is the same person, so it is worth checking the year and the source.',
      },
      multipleResults: {
        question: 'Why do I get several results for the same search?',
        answer:
          'Each different form in which a name appears in the sources is a result. For example, a person may be published one year with a second first name and another year without it, or with a single surname. Within each result, all the years in which that form of the name appears are grouped together.',
      },
      years: {
        question: 'Which years is there data for?',
        answer:
          'There is data for {editionsCount, plural, one {# edition} other {# editions}}, between {startYear} and {endYear}.{hasGaps, select, yes { There is no data for {missingYears}.} other {}}',
      },
      sources: {
        question: 'Where does the data come from, and is it official?',
        answer:
          "The names come from the pages that Diario Vasco dedicates to the children's companies of the Tamborrada; for the oldest editions, archived copies of those pages on the Internet Archive are read. It is not an official register: the lists are processed so that they can be searched and may contain errors, both from the source and from the processing. That is why each result links to its source.",
      },
      notFound: {
        question: 'Why does the person I am looking for not appear?',
        answer:
          'The most common causes are that the chosen school is not the right one, that the name is written differently in the source, or that the person took part in an edition for which there is no data. Also, a very small number of records (less than 1%) could not be split into first name and surnames and cannot be found. Try changing the school, leaving out the second first name or typing another variant of the surname.',
      },
    },
  },
} satisfies typeof search;
