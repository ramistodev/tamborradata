import type statistics from '../es/statistics';

export default {
  title: 'Estatistikak',
  global: {
    title: 'Haur Danborradaren estatistika orokorrak',
    description: 'Haur Danborradaren azterketa orokorra 2018tik: izenen, ikastetxeen eta parte-hartzearen bilakaera eta joera kulturalak urtez urte.',
  },
  year: {
    title: '{year}ko Haur Danborradaren estatistikak',
    description: '{year}ko Haur Danborradaren azterketa: parte-hartzaileak, izen ohikoenak, ikastetxe nabarmenak eta urteko joerak.',
  },
} satisfies typeof statistics;
