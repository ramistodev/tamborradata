import type statistics from '../es/statistics';

export default {
  title: 'Estatistikak',
  period: {
    title: '{period}ko Haur Danborradaren estatistikak',
    description:
      '{period}ko Haur Danborradaren azterketa: parte-hartzaileak, izen ohikoenak, ikastetxe nabarmenak eta urteko joerak.',
  },
  chapters: {
    explore: 'Arakatu',
    ariaLabel: 'Datuak arakatu',
    overview: 'Laburpena',
    participationDynamics: 'Parte-hartzea',
    schools: 'Ikastetxeak',
    schoolsRenewal: 'Berrikuntza',
    schoolsEvolution: 'Bilakaera',
    names: 'Izenak',
    surnames: 'Abizenak',
    identityDiversity: 'Dibertsitatea',
  },
  hero: {
    eyebrowYear: 'Urteko edizioa',
    eyebrowGlobal: '{period} edizioa',
    titleYear: 'Haur Danborrada {period}',
    titleGlobal: 'Historia osoa',
  },
  periodSelector: {
    missingEdition: 'Ez dago edizioa: {year}',
  },
  structuredData: {
    datasetDescription:
      '{description} Datu-multzo zehatza parte-hartzearekin, izenekin, abizenekin eta ikastetxeekin.',
    home: 'Hasiera',
    statistics: 'Urteko estatistikak',
    breadcrumbPeriod: 'Haur Danborrada {period}',
    namesQuestion: 'Zein izan ziren Haur Danborradako izen ohikoenak: {period}?',
    namesAnswer:
      '{period}ko Haur Danborradako izen ohikoenen sailkapena, urteko klasifikazioan buru direnekin.',
    surnamesQuestion: 'Zein abizen nabarmendu ziren Haur Danborradan: {period}?',
    surnamesAnswer: '{period}ko edizioan erregistratutako abizen ohikoenen zerrenda.',
    schoolsQuestion: 'Zein ikastetxek izan zuten parte-hartze handiena: {period}?',
    schoolsAnswer:
      'Haur Danborradan presentzia handiena izan zuten ikastetxeak ({period}) eta berriki gehitutako zentroak.',
    newNamesQuestion: 'Izen berririk izan al zen Haur Danborradan: {period}?',
    newNamesAnswer: '{period}ko Haur Danborradan lehen aldiz agertzen diren izenak.',
    participantsQuestion: 'Zenbat parte-hartzaile izan ziren Haur Danborradan: {period}?',
    participantsAnswer: 'Danborrero eta kantinera txikien guztizko parte-hartze zenbatetsia: {period}.',
    summaryQuestion: 'Non ikus dezaket Haur Danborradaren laburpena: {period}?',
  },
  publishDates: {
    published: 'Argitaratua: {date}',
    updated: 'Eguneratua: {date}',
  },
  overview: {
    title: 'Laburpena · {period}',
    participants: 'Parte-hartzaileak',
    participantsSub: 'Danborrerok eta kantinerak erregistratuta {period}(e)n',
    participantsGlobalSub: 'Danborrerok eta kantinerak erregistratuta edizio guztietan',
    growth: 'Aldaketa aurreko edizioarekin alderatuta',
    growthSub: '{previous} → {current} parte-hartzaile',
    record: 'Historiako errekorra',
    recordSub: '{year}ko edizioa',
    distinctNames: 'Izen desberdinak',
    distinctSurnames: 'Abizen desberdinak',
    diversitySub: '{percentage} dibertsitate',
    multipleNames: 'Izen elkartuak',
    multipleNamesSub: 'parte-hartzaileen {percentage}',
  },
} satisfies typeof statistics;
