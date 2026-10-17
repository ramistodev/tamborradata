import type site from '../es/site';

export default {
  title: 'Tamborradata | Haur Danborradaren datuak eta estatistikak',
  description:
    'Aztertu Donostiako Haur Danborradaren datuak eta estatistikak: parte-hartzea, izenak eta ikastetxeak {startYear}tik.',
  descriptionFallback:
    'Aztertu Donostiako Haur Danborradaren datuak eta estatistikak: edizio guztietako parte-hartzea, izenak eta ikastetxeak.',
  structuredData: {
    organizationDescription: 'Donostiako Haur Danborradari buruzko datu eta estatistika proiektua.',
    websiteAlternateName: 'Tamborradata Estatistikak',
    websiteDescription: 'Tamborradata: Haur Danborradaren estatistikak eta datuak {startYear}tik.',
    websiteDescriptionFallback:
      'Tamborradata: Haur Danborradaren edizio guztien estatistikak eta datuak.',
  },
} satisfies typeof site;
