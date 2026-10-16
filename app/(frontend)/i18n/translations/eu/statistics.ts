import type statistics from '../es/statistics';

export default {
  period: {
    title: 'Haur Danborradaren estatistikak: {period}',
    description:
      'Haur Danborradaren azterketa ({period}): parte-hartzaileak, izen ohikoenak, ikastetxe nabarmenenak eta urteko joerak.',
    dataDescription:
      '{participants} parte-hartzaile Haur Danborradan ({period}). Izenik ohikoenak: {names}. Abizenak, ikastetxeak eta urteko bilakaera.',
    globalTitle: 'Haur Danborradaren estatistika historikoak ({first}-{last})',
    globalDescription:
      'Datuak: {first}-{last}. Donostiako Haur Danborrada: parte-hartzaileak, izenak, abizenak, ikastetxeak eta joerak.',
    globalDataDescription:
      'Datuak: {first}-{last}. {participants} parte-hartzaile erregistratu dira Haur Danborradan. Izen eta abizen ohikoenak, ikastetxeak eta bilakaera.',
  },
  chapters: {
    ariaLabel: 'Datuak arakatu',
    hero: 'Laburpena',
    participationDynamics: 'Parte-hartzea',
    schools: 'Ikastetxeak',
    schoolsRenewal: 'Berrikuntza',
    schoolsEvolution: 'Bilakaera',
    names: 'Izenak',
    surnames: 'Abizenak',
    identityDiversity: 'Dibertsitatea',
    closing: 'Amaiera',
  },
  hero: {
    eyebrowYear: 'Urteko edizioa',
    eyebrowGlobal: '{period} edizioa',
    titleYear: 'Haur Danborrada {period}',
    titleGlobal: 'Historia osoa',
  },
  periodSelector: {
    label: 'Aldiak',
    missingEdition: 'Ez dago edizioa: {year}',
  },
  closing: {
    eyebrow: 'Laburbilduz',
    navLabel: 'Aldien artean nabigatu',
    newer: 'Berriagoa',
    older: 'Zaharragoa',
    edition: '{period} edizioa',
    backToTop: 'Gora itzuli',
  },
  structuredData: {
    home: 'Hasiera',
    statistics: 'Urteko estatistikak',
    breadcrumbPeriod: 'Haur Danborrada {period}',
    breadcrumbGlobal: 'Historia osoa',
    datasetDescription:
      'Donostiako Haur Danborradaren datuak ({period}): parte-hartzaileak, izenak, abizenak eta ikastetxeak.',
    datasetGlobalDescription:
      'Donostiako Haur Danborradaren datuak: {first}-{last}. Edizio guztietako parte-hartzea, izenak, abizenak eta ikastetxeak.',
    keywords:
      'haur danborrada {period}, haur danborradaren estatistikak, haur danborradako parte-hartzaileak {period}, izen ohikoenak, ikastetxeak, Donostia, urtarrilaren 20a',
    keywordsGlobal:
      'haur danborradaren historia, haur danborradaren estatistikak, haur danborrada {first}etik, urteko parte-hartzaileak, izenak, abizenak, ikastetxeak, Donostia',
    place: 'Donostia, Gipuzkoa',
    eventName: 'Donostiako Haur Danborrada {period}',
    eventDescription: 'Donostiako Haur Danborradaren desfilea, {period}(e)ko urtarrilaren 20an.',
    eventSeriesName: 'Donostiako Haur Danborrada',
    eventSeriesDescription:
      'Donostiako danborrero eta kantinera txikien urteroko desfilea, urtarrilaren 20an.',
    variables: {
      participants: 'Parte-hartzaileak',
      growth: 'Aurreko edizioarekiko aldaketa',
      record: 'Errekor edizioko parte-hartzaileak',
      distinctNames: 'Izen desberdinak',
      distinctSurnames: 'Abizen desberdinak',
      multipleNames: 'Izen elkartua duten parte-hartzaileak',
      averageSchoolSize: 'Parte-hartzaileak ikastetxeko, batez beste',
      schoolCount: 'Parte hartu duten ikastetxeak',
    },
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
  metrics: {
    participant_count: 'Parte-hartzaileak',
    growth_rate: 'Hazkunde-tasa',
    record_participant_count: 'Errekorreko parte-hartzaileak',
    record_year: 'Errekor urtea',
    distinct_count: 'Kopuru desberdina',
    diversity_percentage: 'Aniztasuna',
    participants_with_multiple_names: 'Izen bat baino gehiago duten parte-hartzaileak',
    multiple_names_rate: 'Parte-hartzaile ebatzi guztien proportzioa',
    record_year_count: 'Errekor hori duten urteak',
    observation_count: 'Behaketak',
    shannon_entropy: 'Shannon entropia',
    herfindahl_index: 'Kontzentrazio indizea',
    leading_count: 'Liderraren agerraldiak',
    leading_key: 'Ohikoena',
    leading_share: 'Liderraren pisua',
    top_k_share: 'Lehen postuen pisua',
    average_length: 'Batez besteko karaktereak',
    average_school_size: 'Parte-hartzaileak ikastetxeko',
    new_count: 'Ikastetxe berriak',
    veteran_count: 'Ikastetxe beteranoak',
    intermediate_count: 'Tarteko ikastetxeak',
    school_count: 'Ikastetxe guztira',
    new_vs_veteran_ratio: 'Berriak beteranoen aldean',
  },
  categories: {
    totalParticipants: {
      tab: 'Guztira',
      title: 'Parte-hartzaile guztiak',
      description: 'Guztira erregistratutako danborrerak eta kantinerak.',
    },
    participantsGrowthRate: {
      tab: 'Aldaketa',
      title: 'Parte-hartzaileen aldaketa',
      description:
        'Parte-hartzeak zenbat gora edo behera egin duen, ehunekotan, aurreko edizioarekin alderatuta.',
    },
    participationRecordYears: {
      tab: 'Errekorra',
      title: 'Parte-hartze errekorra',
      description:
        'Historia osoko parte-hartzaile gehien izan zituen edizioa, eta zenbat izan ziren.',
    },
    topNames: {
      tab: 'Ohikoenak',
      title: 'Izenik ohikoenak',
      description: 'Gehien errepikatzen diren izenak eta bakoitzak zenbat aldiz agertzen den.',
    },
    topSecondNames: {
      tab: 'Bigarren izena',
      title: 'Bigarren izenik ohikoenak',
      description: 'Izen elkartua dutenen artean gehien errepikatzen diren bigarren izenak.',
    },
    nameTrends: {
      tab: 'Joera',
      title: 'Izenen joera',
      description: 'Izen nabarmenenen agerraldiek edizioz edizio izan duten bilakaera.',
    },
    newNames: {
      tab: 'Berriak',
      title: 'Estreinatzen diren izenak',
      description: 'Edizio honetan lehen aldiz agertzen diren izenak, inoiz ez zirenak.',
    },
    disappearedNames: {
      tab: 'Desagertuak',
      title: 'Desagertzen diren izenak',
      description: 'Aurreko edizioan zeuden eta orain agertzen ez diren izenak.',
    },
    perennialNames: {
      tab: 'Beti daudenak',
      title: 'Beti daudenak',
      description: 'Edizio guztietan egon diren izenak.',
    },
    nameComebacks: {
      tab: 'Itzultzen direnak',
      title: 'Desagertu eta itzultzen direnak',
      description: 'Edizioren batean desagertu eta itzuli diren izenak.',
    },
    averageNameLength: {
      tab: 'Batez besteko luzera',
      title: 'Izenaren batez besteko luzera',
      description: 'Erregistratutako izenen batez besteko letra kopurua.',
    },
    nameInitialDistribution: {
      tab: 'Hasierakoak',
      title: 'Hasierako letraren arabera',
      description: 'Izenak zein letrarekin hasten diren kontuan hartuta nola banatzen diren.',
    },
    longestNames: {
      tab: 'Luzeenak',
      title: 'Izenik luzeenak',
      description: 'Letra gehien dituzten izenak eta haien luzera.',
    },
    nameSchoolCorrelation: {
      tab: 'Ikastetxe gehienetan',
      title: 'Ikastetxe gehienetan dauden izenak',
      description: 'Ikastetxe desberdin gehienetan agertzen diren izenak, eta zenbatetan.',
    },
    singleYearNames: {
      tab: 'Edizio bakarra',
      title: 'Edizio bakarreko izenak',
      description: 'Historia osoan edizio bakar batean agertu diren izenak.',
    },
    rareNames: {
      tab: 'Urriak',
      title: 'Izen urriak',
      description: 'Historia osoan oso gutxitan erregistratu diren izenak.',
    },
    participantsWithMultipleNames: {
      tab: 'Izen konposatua',
      title: 'Izen konposatua duten parte-hartzaileak',
      description:
        'Izen bat baino gehiago duten parte-hartzaileak, eta zer proportzio osatzen duten.',
    },
    topSurnames: {
      tab: 'Ohikoenak',
      title: 'Abizenik ohikoenak',
      description: 'Gehien errepikatzen diren abizenak eta bakoitzak zenbat aldiz agertzen den.',
    },
    surnameTrends: {
      tab: 'Joera',
      title: 'Abizenen joera',
      description: 'Abizen nabarmenenen agerraldiek edizioz edizio izan duten bilakaera.',
    },
    newSurnames: {
      tab: 'Berriak',
      title: 'Estreinatzen diren abizenak',
      description: 'Edizio honetan lehen aldiz agertzen diren abizenak, inoiz ez zirenak.',
    },
    disappearedSurnames: {
      tab: 'Desagertuak',
      title: 'Desagertzen diren abizenak',
      description: 'Aurreko edizioan zeuden eta orain agertzen ez diren abizenak.',
    },
    perennialSurnames: {
      tab: 'Beti daudenak',
      title: 'Beti daudenak',
      description: 'Edizio guztietan egon diren abizenak.',
    },
    surnameComebacks: {
      tab: 'Itzultzen direnak',
      title: 'Desagertu eta itzultzen direnak',
      description: 'Edizioren batean desagertu eta itzuli diren abizenak.',
    },
    averageSurnameLength: {
      tab: 'Batez besteko luzera',
      title: 'Abizenaren batez besteko luzera',
      description: 'Erregistratutako abizenen batez besteko letra kopurua.',
    },
    surnameInitialDistribution: {
      tab: 'Hasierakoak',
      title: 'Hasierako letraren arabera',
      description: 'Abizenak zein letrarekin hasten diren kontuan hartuta nola banatzen diren.',
    },
    longestSurnames: {
      tab: 'Luzeenak',
      title: 'Abizenik luzeenak',
      description: 'Letra gehien dituzten abizenak eta haien luzera.',
    },
    surnameSchoolCorrelation: {
      tab: 'Ikastetxe gehienetan',
      title: 'Ikastetxe gehienetan dauden abizenak',
      description: 'Ikastetxe desberdin gehienetan agertzen diren abizenak, eta zenbatetan.',
    },
    singleYearSurnames: {
      tab: 'Edizio bakarra',
      title: 'Edizio bakarreko abizenak',
      description: 'Historia osoan edizio bakar batean agertu diren abizenak.',
    },
    rareSurnames: {
      tab: 'Urriak',
      title: 'Abizen urriak',
      description: 'Historia osoan oso gutxitan erregistratu diren abizenak.',
    },
    topSchools: {
      tab: 'Parte-hartzaile gehien',
      title: 'Parte-hartzaile gehien dituzten ikastetxeak',
      description:
        'Parte-hartzaile gehien dituzten ikastetxeak, eta bakoitzak zenbat ematen dituen.',
    },
    schoolGrowthRate: {
      tab: 'Hazkundea',
      title: 'Ikastetxeen hazkundea',
      description:
        'Ikastetxe bakoitzaren parte-hartzaileen aldaketa ehunekotan, aurreko edizioarekin alderatuta.',
    },
    averageSchoolSize: {
      tab: 'Batez besteko tamaina',
      title: 'Ikastetxearen batez besteko tamaina',
      description: 'Ikastetxe bakoitzeko batez besteko parte-hartzaile kopurua.',
    },
    schoolNameDiversity: {
      tab: 'Izen aniztasuna',
      title: 'Izen aniztasun handieneko ikastetxeak',
      description: 'Parte-hartzaileen artean izen desberdin gehien dituzten ikastetxeak.',
    },
    schoolSurnameDiversity: {
      tab: 'Abizen aniztasuna',
      title: 'Abizen aniztasun handieneko ikastetxeak',
      description: 'Parte-hartzaileen artean abizen desberdin gehien dituzten ikastetxeak.',
    },
    commonNameBySchool: {
      tab: 'Izen ohikoena',
      title: 'Ikastetxe bakoitzeko izen ohikoena',
      description:
        'Ikastetxe bakoitzean gehien errepikatzen den izena eta zenbat aldiz agertzen den.',
    },
    commonSurnameBySchool: {
      tab: 'Abizen ohikoena',
      title: 'Ikastetxe bakoitzeko abizen ohikoena',
      description:
        'Ikastetxe bakoitzean gehien errepikatzen den abizena eta zenbat aldiz agertzen den.',
    },
    namesDiversity: {
      tab: 'Izenak',
      title: 'Izenen aniztasuna',
      description:
        'Izenen aniztasuna: zenbat eta izen desberdin gehiago, orduan eta aniztasun handiagoa.',
    },
    surnamesDiversity: {
      tab: 'Abizenak',
      title: 'Abizenen aniztasuna',
      description:
        'Abizenen aniztasuna: zenbat eta abizen desberdin gehiago, orduan eta aniztasun handiagoa.',
    },
    nameConcentration: {
      tab: 'Izenen kontzentrazioa',
      title: 'Izenen kontzentrazioa',
      description:
        'Parte-hartzaileak izen gutxitan zenbateraino pilatzen diren. Zenbat eta pilaketa handiagoa, orduan eta aniztasun txikiagoa.',
    },
    surnameConcentration: {
      tab: 'Abizenen kontzentrazioa',
      title: 'Abizenen kontzentrazioa',
      description:
        'Parte-hartzaileak abizen gutxitan zenbateraino pilatzen diren. Zenbat eta pilaketa handiagoa, orduan eta aniztasun txikiagoa.',
    },
    nameSurnameDynasties: {
      tab: 'Dinastiak',
      title: 'Izen eta abizen dinastiak',
      description:
        'Hainbat edizioetan errepikatzen diren izen eta abizen konbinazioak, ziur aski familia berekoak.',
    },
    newSchools: {
      tab: 'Berriak',
      title: 'Estreinatzen diren ikastetxeak',
      description: 'Edizio honetan lehen aldiz parte hartzen duten ikastetxeak.',
    },
    disappearedSchools: {
      tab: 'Desagertuak',
      title: 'Desagertzen diren ikastetxeak',
      description: 'Aurreko edizioan zeuden eta orain agertzen ez diren ikastetxeak.',
    },
    newVsVeteranSchoolRatio: {
      tab: 'Berriak eta beteranoak',
      title: 'Berriak eta beteranoak',
      description: 'Ikastetxe beteranoko zenbat ikastetxe berri dauden.',
    },
    schoolsEvolution: {
      tab: 'Bilakaera',
      title: 'Ikastetxeen bilakaera',
      description:
        'Ikastetxe handienen parte-hartzaile kopuruak edizioz edizio izan duen bilakaera.',
    },
    schoolLongevity: {
      tab: 'Iraunkorrenak',
      title: 'Iraunkorrenak',
      description: 'Edizio gehienetan parte hartu duten ikastetxeak, eta zenbatetan.',
    },
    mostConstantSchools: {
      tab: 'Konstanteenak',
      title: 'Konstanteenak',
      description:
        'Parte-hartzea edizioz edizio gutxien aldatzen duten ikastetxeak; ez dira zertan handienak izan behar.',
    },
  },
  layout: {
    showMore: 'Erakutsi gehiago',
    showLess: 'Erakutsi gutxiago',
    loadError: 'Ezin izan dira emaitza gehiago kargatu.',
    retry: 'Saiatu berriro',
    seriesLatest: 'Azkena',
    seriesPeak: 'Gehienekoa',
    groups: { series: 'Serieak', rankings: 'Sailkapenak', tables: 'Taulak' },
    tableValue: 'Aldiz',
    chartHint:
      'Erabili ezker eta eskuin gezi-teklak edizioetan zehar mugitzeko eta haien balioak irakurtzeko.',
    legendLabel: 'Grafikoaren serieak: sakatu erakutsi edo ezkutatzeko',
    keyFigures: 'Oinarrizko zifrak',
    shown: '{count} emaitza erakusten',
    table: {
      commonNameBySchool: { school: 'Ikastetxea', entity: 'Izen ohikoena' },
      commonSurnameBySchool: { school: 'Ikastetxea', entity: 'Abizen ohikoena' },
    },
  },
  familyRender: {
    participationDynamics: { title: 'Parte-hartzea' },
    names: { title: 'Izenak' },
    surnames: { title: 'Abizenak' },
    identityDiversity: { title: 'Dibertsitatea' },
    schools: { title: 'Ikastetxeak' },
    schoolsRenewal: { title: 'Berrikuntza' },
    schoolsEvolution: { title: 'Bilakaera' },
  },
} satisfies typeof statistics;
