import type landing from '../es/landing';

export default {
  title: 'Tamborradata',
  metadata: {
    title: 'Tamborradata',
    description:
      "Historical and statistical archive of Donostia's Children's Tamborrada: participations, names and schools from {startYear} to {endYear}, and a participant search.",
    descriptionFallback:
      "Historical and statistical archive of Donostia's Children's Tamborrada: participations, names and schools of every edition, and a participant search.",
    keywords: "Tamborradata, Children's Tamborrada, Tamborrada statistics, Tamborrada data",
  },
  structuredData: {
    datasetName: "Tamborradata: Children's Tamborrada data",
    datasetDescription:
      "Statistics and participations of Donostia-San Sebastián's Children's Tamborrada from {startYear} to {endYear}: names, schools and yearly trends.",
    datasetDescriptionFallback:
      "Statistics and participations of Donostia-San Sebastián's Children's Tamborrada: names, schools and yearly trends.",
    distributionName: "Global statistics of the Children's Tamborrada",
    aboutStatistics: 'Tamborrada statistics',
    faqName: 'Frequently asked questions about Tamborradata',
    faqDescription:
      "Frequently asked questions about Tamborradata and the Children's Tamborrada data.",
    pressName: 'Featured in the media',
  },
  sections: {
    stats: 'Statistics',
    searchParticipants: 'Search',
    press: 'Press',
    openSource: 'Open source',
    contact: 'Contact',
    faq: 'Questions',
  },
  common: {
    newTab: '(opens in a new tab)',
  },
  hero: {
    phrases: {
      names: 'The Tamborrada, name by name.',
      data: 'A tradition told in numbers.',
      editions: 'Every edition leaves its mark.',
    },
    description:
      "Tamborradata gathers the participant lists of Donostia's Children's Tamborrada since {startYear} and turns them into statistics, trends by school and a search tool to find anyone.",
    descriptionFallback:
      "Tamborradata gathers the participant lists of every edition of Donostia's Children's Tamborrada and turns them into statistics, trends by school and a search tool to find anyone.",
    metrics: {
      participations: 'Participations',
      editions: 'Editions',
      schools: 'Schools',
    },
    summary: {
      topName: 'Most repeated first name {name}',
      topSurname: 'Surname {surname}',
      topSchool: 'School {school}',
    },
  },
  stats: {
    title: 'From {startYear} to today, edition by edition',
    titleFallback: 'The Tamborrada, edition by edition',
    description:
      'Statistics available from {startYear} to {endYear}. Trends in participation, schools and editions. The most repeated names, surnames and schools in each edition.',
    descriptionFallback:
      'Trends in participation, schools and editions. The most repeated names, surnames and schools in each edition.',
    global: {
      label: 'All time · {startYear}-{endYear}',
      summary:
        'participations spread over {editions, plural, one {# edition} other {# editions}} and {schools, plural, one {# school} other {# schools}}.',
      note: 'A participation is one record in one edition: the same person can add several.{hasGaps, select, yes { There is no data yet for {missingYears}.} other {}}',
      cta: 'See the full history',
    },
    last: {
      label: 'Latest edition',
      summary: 'participations from {schools, plural, one {# school} other {# schools}}.',
      growth: '{change} compared with the previous year',
      cta: 'See the {year} edition',
    },
    fallback: {
      global: {
        label: 'All time',
        title: 'The Tamborrada, edition by edition',
        text: 'Participations, schools and the most repeated names of every edition gathered by Tamborradata.',
      },
      last: {
        label: 'Latest edition',
        title: 'The most recent edition',
        text: 'How many people took part, from which schools and which names repeat the most.',
      },
      cta: 'See the statistics',
    },
  },
  searchParticipants: {
    title: 'In which years did your son or daughter take part in the Tamborrada?',
    description:
      'Search by name and surnames among {total} participations and find out in which editions they appear, with a link to the original source of each year.',
    descriptionFallback:
      'Search by name and surnames among all the participations and find out in which editions they appear, with a link to the original source of each year.',
    steps: {
      name: {
        title: 'Type the first name and two surnames',
        description: 'If the name is compound, one is enough.',
      },
      school: {
        title: 'Choose the school',
        description: 'It avoids mixing up people with the same name.',
      },
      sources: {
        title: 'Check their years and sources',
        description: 'Each edition links to the news item or list where they appear.',
      },
    },
    cta: 'Go to the search',
    example: {
      ariaLabel: 'Illustrative example of a result',
      name: 'First name Surname Surname',
      school: 'Your school',
      sources: 'Sources',
      caption: 'Illustrative example',
    },
  },
  press: {
    title: '“A digital mirror of the festival”',
    description:
      "This is how {publication} presented Tamborradata: the “great historical and statistical archive” of the Children's Tamborrada, with a search for families and an observatory to understand the city through its names.",
    openArticle: 'Open the original article',
    clipping: {
      read: 'Read the article',
    },
  },
  openSource: {
    title: 'The website is built in plain sight',
    description:
      'The code of the interface, its components and its visualizations is public: you can read it, run it locally and suggest improvements. The internal pipeline that obtains and processes the data is not part of the repository.',
    stackLabel: 'Technologies',
    cta: 'View on GitHub',
    terminal: {
      installed: 'Dependencies installed',
    },
  },
  contact: {
    title: 'Shall we talk?',
    description:
      'If you have found an error in the data, want to talk about press or have an idea to improve the website, write to us. We reply by hand.',
    emailLabel: 'Email',
    hint: 'If it is a correction, include the year, the name and the school.',
  },
  faq: {
    title: 'What people often ask us',
    items: {
      what: {
        question: 'What is Tamborradata?',
        answer:
          "Tamborradata is an independent, open source platform that works as the historical and statistical archive of Donostia's Children's Tamborrada. It gathers the participant lists of every edition{hasStart, select, yes { since {startYear}} other {}} and turns them into statistics, rankings and a participant search.",
      },
      howMany: {
        question: "How many children take part in Donostia's Children's Tamborrada?",
        last: 'In the {year} edition there were {participations} participations from {schools, plural, one {# school} other {# schools}}.',
        growth: 'Compared with the previous edition, the change is {change}.',
        total:
          'In total, Tamborradata gathers {participations} participations from {editions, plural, one {# edition} other {# editions}} and {schools, plural, one {# different school} other {# different schools}}.',
        note: 'The same person adds one participation for every year they appear.',
        fallback:
          'You can check how many participations each edition had in the website statistics.',
      },
      topName: {
        question: "What is the most common first name in the Children's Tamborrada?",
        answer:
          "{name} is the most repeated first name in the Children's Tamborrada: it appears in {count} participations. You can see the full ranking of names in the statistics.",
        fallback: 'You can see the ranking of the most repeated names in the website statistics.',
      },
      topSurname: {
        question: 'What is the most common surname among the participants?',
        answer:
          '{surname} is the most common surname: it appears in {count} participations. You can see the full ranking of surnames in the statistics.',
        fallback: 'You can see the ranking of the most common surnames in the website statistics.',
      },
      topSchool: {
        question: "Which school has the most participants in the Children's Tamborrada?",
        answer:
          '{school} is the school with the most participations: {count}. You can see the full ranking of schools in the statistics.',
        fallback:
          'You can see the ranking of the schools with the most participations in the website statistics.',
      },
      when: {
        question: "When is Donostia's Children's Tamborrada held?",
        answer:
          "Every 20 January, San Sebastián's Day, the children of Donostia's schools parade. Tamborradata gathers the participant lists that are published each year.",
      },
      find: {
        question:
          'How can I find out in which years my son or daughter took part in the Tamborrada?',
        answer:
          'In the participant search, type the first name and the two surnames (if the name is compound, one is enough) and choose the school. It shows the editions they appear in, with a link to the original source of each year.',
      },
      register: {
        question: 'Do I need to sign up or give any data to use the search?',
        answer:
          'No. The search works without signing up and without asking for private data: you only type a name and choose the school.',
      },
      years: {
        question: "Which years does the Children's Tamborrada data cover?",
        answer:
          'There is data for {editions, plural, one {# edition} other {# editions}}, between {startYear} and {endYear}.{hasGaps, select, yes { There is no data for {missingYears}.} other {}}',
        fallback:
          "There is data for several editions of Donostia's Children's Tamborrada, but right now we cannot show the exact range of years.",
      },
      notFound: {
        question: "Why doesn't my son's or daughter's name appear in the search?",
        answer:
          'Check that the school is the right one and try removing the second name or writing another variant of the surname: in the source it may be written differently. It may also belong to an edition with no data. If you still cannot find it, write to us.',
      },
      sources: {
        question: 'Where does the data come from, and is it official?',
        answer:
          "The names come from the pages Diario Vasco dedicates to the children's companies of the Tamborrada; for the oldest editions, archived copies of those pages on the Internet Archive are read. It is not an official register: the lists are processed so they can be searched and may contain typos, which is why every search result links to its source.",
      },
      updates: {
        question: 'How often is the data updated?',
        answer:
          'Once a year: when the lists of a new edition are published, they are processed and added to the statistics and to the search.{hasLast, select, yes { The latest edition included is {year}.} other {}}',
      },
      participation: {
        question: 'What does “participation” mean in the statistics?',
        answer:
          'A participation is one record of a person in one edition. The same person can add several, one for each year they appear. That is why the number of participations is not the number of different people.',
      },
      correction: {
        question: 'Can I ask for a correction or report an error in the data?',
        answer:
          'Yes. Write to us at {email} stating the year, the name and the school, and we will review it.',
      },
      openSource: {
        question: 'Is Tamborradata open source?',
        answer:
          'Yes. The code of the interface, its components and its visualizations is public at github.com/ramistodev/tamborradata: you can read it, run it locally and suggest improvements. The internal pipeline that obtains and processes the data is not part of the repository.',
      },
    },
  },
} satisfies typeof landing;
