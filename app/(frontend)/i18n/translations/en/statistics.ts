import type statistics from '../es/statistics';

export default {
  title: 'Statistics',
  global: {
    title: "Global statistics of the Children's Tamborrada",
    description: "Global analysis of the Children's Tamborrada since 2018: evolution of names, schools, participation and cultural trends year by year.",
  },
  year: {
    title: "Children's Tamborrada statistics {year}",
    description: "Analysis of the {year} Children's Tamborrada: participants, most common names, standout schools and yearly trends.",
  },
} satisfies typeof statistics;
