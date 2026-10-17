import type site from '../es/site';

export default {
  title: "Tamborradata | Data and statistics of the Children's Tamborrada",
  description:
    "Explore data and statistics of the Children's Tamborrada in Donostia-San Sebastián: participation, names and schools since {startYear}.",
  descriptionFallback:
    "Explore data and statistics of the Children's Tamborrada in Donostia-San Sebastián: participation, names and schools of every edition.",
  structuredData: {
    organizationDescription:
      "Data and statistics project about Donostia-San Sebastián's Children's Tamborrada.",
    websiteAlternateName: 'Tamborradata Statistics',
    websiteDescription:
      "Tamborradata statistics and data of the Children's Tamborrada since {startYear}.",
    websiteDescriptionFallback:
      "Tamborradata statistics and data of every edition of the Children's Tamborrada.",
  },
} satisfies typeof site;
