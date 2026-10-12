const statistics = {
  period: {
    title: 'Estadísticas de la Tamborrada Infantil {period}',
    description:
      'Análisis de la Tamborrada Infantil {period}: participantes, nombres más comunes, colegios destacados y tendencias anuales.',
    dataDescription:
      '{participants} participantes en la Tamborrada Infantil {period}. Nombres más comunes: {names}. Apellidos, colegios y evolución anual.',
    globalTitle: 'Estadísticas históricas de la Tamborrada Infantil ({first}-{last})',
    globalDescription:
      'Datos desde {first} hasta {last} de la Tamborrada Infantil de Donostia: participantes, nombres, apellidos, colegios y tendencias.',
    globalDataDescription:
      'Datos desde {first} hasta {last}: {participants} participantes registrados en la Tamborrada Infantil. Nombres y apellidos más comunes, colegios y evolución.',
  },
  chapters: {
    ariaLabel: 'Explorar datos',
    hero: 'Resumen',
    participationDynamics: 'Participación',
    schools: 'Colegios',
    schoolsRenewal: 'Renovación',
    schoolsEvolution: 'Evolución',
    names: 'Nombres',
    surnames: 'Apellidos',
    identityDiversity: 'Diversidad',
    closing: 'Cierre',
  },
  hero: {
    eyebrowYear: 'Edición anual',
    eyebrowGlobal: 'Edición {period}',
  },
  periodSelector: {
    label: 'Periodos',
    missingEdition: 'Sin edición {year}',
  },
  closing: {
    eyebrow: 'En resumen',
    navLabel: 'Navegar entre periodos',
    newer: 'Más reciente',
    older: 'Más antigua',
    edition: 'Edición {period}',
    backToTop: 'Volver arriba',
  },
  structuredData: {
    home: 'Inicio',
    statistics: 'Estadísticas por Año',
    breadcrumbPeriod: 'Tamborrada Infantil {period}',
    breadcrumbGlobal: 'Historia completa',
    datasetDescription:
      'Datos de la Tamborrada Infantil {period} de Donostia / San Sebastián: participantes, nombres, apellidos y colegios.',
    datasetGlobalDescription:
      'Datos desde {first} hasta {last} de la Tamborrada Infantil de Donostia / San Sebastián: participación, nombres, apellidos y colegios de todas las ediciones.',
    keywords:
      'tamborrada infantil {period}, estadísticas tamborrada infantil, participantes tamborrada infantil {period}, nombres más comunes, colegios, Donostia, San Sebastián, 20 de enero',
    keywordsGlobal:
      'historia tamborrada infantil, estadísticas tamborrada infantil, tamborrada infantil desde {first}, participantes por año, nombres, apellidos, colegios, Donostia, San Sebastián',
    place: 'Donostia / San Sebastián, Gipuzkoa',
    eventName: 'Tamborrada Infantil de Donostia {period}',
    eventDescription:
      'Desfile de la Tamborrada Infantil de Donostia / San Sebastián del 20 de enero de {period}.',
    eventSeriesName: 'Tamborrada Infantil de Donostia',
    eventSeriesDescription:
      'Desfile anual de niños y niñas tamborreros y cantineras de Donostia / San Sebastián cada 20 de enero.',
    variables: {
      participants: 'Participantes',
      growth: 'Variación respecto a la edición anterior',
      record: 'Participantes en la edición récord',
      distinctNames: 'Nombres distintos',
      distinctSurnames: 'Apellidos distintos',
      multipleNames: 'Participantes con nombre compuesto',
      averageSchoolSize: 'Participantes por colegio de media',
      schoolCount: 'Colegios participantes',
    },
  },
  publishDates: {
    published: 'Publicado el {date}',
    updated: 'Actualizado el {date}',
  },
  overview: {
    title: 'Resumen · {period}',
    participants: 'Participantes',
    participantsSub: 'Tamborreros y cantineras registrados en {period}',
    participantsGlobalSub: 'Tamborreros y cantineras registrados en todas las ediciones',
    growth: 'Variación vs. edición anterior',
    growthSub: '{previous} → {current} participantes',
    record: 'Récord histórico',
    recordSub: 'Edición {year}',
    distinctNames: 'Nombres distintos',
    distinctSurnames: 'Apellidos distintos',
    diversitySub: '{percentage} de diversidad',
    multipleNames: 'Nombres compuestos',
    multipleNamesSub: '{percentage} de los participantes',
  },
  metrics: {
    participant_count: 'Participantes',
    growth_rate: 'Tasa de crecimiento',
    record_participant_count: 'Participantes del récord',
    record_year: 'Año del récord',
    distinct_count: 'Cantidad distinta',
    diversity_percentage: 'Diversidad',
    participants_with_multiple_names: 'Participantes con más de un nombre',
    multiple_names_rate: 'Proporción de participantes resueltos',
    record_year_count: 'Años con ese récord',
    observation_count: 'Observaciones',
    shannon_entropy: 'Entropía de Shannon',
    herfindahl_index: 'Índice de concentración',
    leading_count: 'Apariciones del líder',
    leading_key: 'El más frecuente',
    leading_share: 'Peso del líder',
    top_k_share: 'Peso de los primeros puestos',
    average_length: 'Caracteres de media',
    average_school_size: 'Participantes por colegio',
    new_count: 'Colegios nuevos',
    veteran_count: 'Colegios veteranos',
    intermediate_count: 'Colegios intermedios',
    school_count: 'Colegios en total',
    new_vs_veteran_ratio: 'Nuevos por cada veterano',
  },
  categories: {
    totalParticipants: {
      tab: 'Total',
      title: 'Participantes totales',
      description: 'Tamborreros y cantineras registrados en total.',
    },
    participantsGrowthRate: {
      tab: 'Variación',
      title: 'Variación de participantes',
      description:
        'Cuánto ha crecido o decrecido la participación, en porcentaje, respecto a la edición anterior.',
    },
    participationRecordYears: {
      tab: 'Récord',
      title: 'Récord de participación',
      description: 'La edición con más participantes de toda la historia y cuántos fueron.',
    },
    topNames: {
      tab: 'Más frecuentes',
      title: 'Nombres más frecuentes',
      description: 'Los nombres que más se repiten y las veces que aparece cada uno.',
    },
    topSecondNames: {
      tab: 'Segundo nombre',
      title: 'Segundos nombres más frecuentes',
      description: 'Los segundos nombres más repetidos entre quienes tienen nombre compuesto.',
    },
    nameTrends: {
      tab: 'Tendencia',
      title: 'Tendencia de los nombres',
      description:
        'Cómo ha evolucionado, edición a edición, el número de apariciones de los nombres más destacados.',
    },
    newNames: {
      tab: 'Nuevos',
      title: 'Nombres que debutan',
      description:
        'Nombres que aparecen por primera vez en esta edición, sin haber salido nunca antes.',
    },
    disappearedNames: {
      tab: 'Desaparecidos',
      title: 'Nombres que desaparecen',
      description: 'Nombres que estaban en la edición anterior y ya no aparecen en esta.',
    },
    perennialNames: {
      tab: 'Siempre presentes',
      title: 'Siempre presentes',
      description: 'Nombres que han estado presentes en todas las ediciones.',
    },
    nameComebacks: {
      tab: 'Reaparecen',
      title: 'Vuelven tras desaparecer',
      description: 'Nombres que dejaron de aparecer en alguna edición y han vuelto.',
    },
    averageNameLength: {
      tab: 'Longitud media',
      title: 'Longitud media del nombre',
      description: 'Número medio de letras de los nombres registrados.',
    },
    nameInitialDistribution: {
      tab: 'Iniciales',
      title: 'Por letra inicial',
      description: 'Cómo se reparten los nombres según la letra con la que empiezan.',
    },
    longestNames: {
      tab: 'Más largos',
      title: 'Los nombres más largos',
      description: 'Los nombres con más letras y su longitud.',
    },
    nameSchoolCorrelation: {
      tab: 'En más colegios',
      title: 'Nombres presentes en más colegios',
      description: 'Los nombres que aparecen en más colegios distintos y en cuántos lo hacen.',
    },
    singleYearNames: {
      tab: 'Una edición',
      title: 'Nombres de una sola edición',
      description: 'Nombres que solo han aparecido en una única edición de toda la historia.',
    },
    rareNames: {
      tab: 'Poco frecuentes',
      title: 'Nombres poco frecuentes',
      description: 'Nombres registrados muy pocas veces a lo largo de toda la historia.',
    },
    participantsWithMultipleNames: {
      tab: 'Nombre compuesto',
      title: 'Participantes con nombre compuesto',
      description: 'Participantes con más de un nombre de pila y qué proporción suponen.',
    },
    topSurnames: {
      tab: 'Más frecuentes',
      title: 'Apellidos más frecuentes',
      description: 'Los apellidos que más se repiten y las veces que aparece cada uno.',
    },
    surnameTrends: {
      tab: 'Tendencia',
      title: 'Tendencia de los apellidos',
      description:
        'Cómo ha evolucionado, edición a edición, el número de apariciones de los apellidos más destacados.',
    },
    newSurnames: {
      tab: 'Nuevos',
      title: 'Apellidos que debutan',
      description:
        'Apellidos que aparecen por primera vez en esta edición, sin haber salido nunca antes.',
    },
    disappearedSurnames: {
      tab: 'Desaparecidos',
      title: 'Apellidos que desaparecen',
      description: 'Apellidos que estaban en la edición anterior y ya no aparecen en esta.',
    },
    perennialSurnames: {
      tab: 'Siempre presentes',
      title: 'Siempre presentes',
      description: 'Apellidos que han estado presentes en todas las ediciones.',
    },
    surnameComebacks: {
      tab: 'Reaparecen',
      title: 'Vuelven tras desaparecer',
      description: 'Apellidos que dejaron de aparecer en alguna edición y han vuelto.',
    },
    averageSurnameLength: {
      tab: 'Longitud media',
      title: 'Longitud media del apellido',
      description: 'Número medio de letras de los apellidos registrados.',
    },
    surnameInitialDistribution: {
      tab: 'Iniciales',
      title: 'Por letra inicial',
      description: 'Cómo se reparten los apellidos según la letra con la que empiezan.',
    },
    longestSurnames: {
      tab: 'Más largos',
      title: 'Los apellidos más largos',
      description: 'Los apellidos con más letras y su longitud.',
    },
    surnameSchoolCorrelation: {
      tab: 'En más colegios',
      title: 'Apellidos presentes en más colegios',
      description: 'Los apellidos que aparecen en más colegios distintos y en cuántos lo hacen.',
    },
    singleYearSurnames: {
      tab: 'Una edición',
      title: 'Apellidos de una sola edición',
      description: 'Apellidos que solo han aparecido en una única edición de toda la historia.',
    },
    rareSurnames: {
      tab: 'Poco frecuentes',
      title: 'Apellidos poco frecuentes',
      description: 'Apellidos registrados muy pocas veces a lo largo de toda la historia.',
    },
    topSchools: {
      tab: 'Más participantes',
      title: 'Colegios con más participantes',
      description: 'Los colegios con más participantes y cuántos aporta cada uno.',
    },
    schoolGrowthRate: {
      tab: 'Crecimiento',
      title: 'Crecimiento de los colegios',
      description:
        'Variación porcentual de los participantes de cada colegio respecto a la edición anterior.',
    },
    averageSchoolSize: {
      tab: 'Tamaño medio',
      title: 'Tamaño medio de colegio',
      description: 'Número medio de participantes por colegio.',
    },
    schoolNameDiversity: {
      tab: 'Variedad de nombres',
      title: 'Colegios con más variedad de nombres',
      description: 'Los colegios con más nombres distintos entre sus participantes.',
    },
    schoolSurnameDiversity: {
      tab: 'Variedad de apellidos',
      title: 'Colegios con más variedad de apellidos',
      description: 'Los colegios con más apellidos distintos entre sus participantes.',
    },
    commonNameBySchool: {
      tab: 'Nombre común',
      title: 'Nombre más común por colegio',
      description: 'El nombre que más se repite en cada colegio y las veces que aparece.',
    },
    commonSurnameBySchool: {
      tab: 'Apellido común',
      title: 'Apellido más común por colegio',
      description: 'El apellido que más se repite en cada colegio y las veces que aparece.',
    },
    namesDiversity: {
      tab: 'Nombres',
      title: 'Diversidad de nombres',
      description:
        'Cuánta variedad hay en los nombres: cuantos más nombres distintos, más diversidad.',
    },
    surnamesDiversity: {
      tab: 'Apellidos',
      title: 'Diversidad de apellidos',
      description:
        'Cuánta variedad hay en los apellidos: cuantos más apellidos distintos, más diversidad.',
    },
    nameConcentration: {
      tab: 'Concentración de nombres',
      title: 'Concentración de nombres',
      description:
        'Cuánto se concentran los participantes en unos pocos nombres. Cuanta más concentración, menos diversidad.',
    },
    surnameConcentration: {
      tab: 'Concentración de apellidos',
      title: 'Concentración de apellidos',
      description:
        'Cuánto se concentran los participantes en unos pocos apellidos. Cuanta más concentración, menos diversidad.',
    },
    nameSurnameDynasties: {
      tab: 'Dinastías',
      title: 'Dinastías de nombre y apellido',
      description:
        'Combinaciones de nombre y apellido que se repiten en varias ediciones, posiblemente de una misma familia.',
    },
    newSchools: {
      tab: 'Nuevos',
      title: 'Colegios que debutan',
      description: 'Colegios que participan por primera vez en esta edición.',
    },
    disappearedSchools: {
      tab: 'Ausentes',
      title: 'Colegios que dejan de aparecer',
      description: 'Colegios que estaban en la edición anterior y ya no aparecen en esta.',
    },
    newVsVeteranSchoolRatio: {
      tab: 'Nuevos y veteranos',
      title: 'Nuevos frente a veteranos',
      description: 'Cuántos colegios nuevos hay por cada colegio veterano.',
    },
    schoolsEvolution: {
      tab: 'Evolución',
      title: 'Evolución de los colegios',
      description:
        'Cómo ha evolucionado, edición a edición, el número de participantes de los colegios más grandes.',
    },
    schoolLongevity: {
      tab: 'Longevos',
      title: 'Los más longevos',
      description: 'Los colegios que han participado en más ediciones y en cuántas.',
    },
    mostConstantSchools: {
      tab: 'Constantes',
      title: 'Los más constantes',
      description:
        'Los colegios cuya participación varía menos de una edición a otra; no tienen por qué ser los más grandes.',
    },
  },
  layout: {
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    seriesLatest: 'Último',
    seriesPeak: 'Máximo',
    groups: { series: 'Series', rankings: 'Rankings', tables: 'Tablas' },
    tableValue: 'Veces',
    chartHint:
      'Usa las flechas izquierda y derecha para recorrer las ediciones y consultar sus valores.',
    legendLabel: 'Series del gráfico: pulsa para mostrar u ocultar',
    keyFigures: 'Cifras clave',
    shown: 'Mostrando {count} resultados',
    table: {
      commonNameBySchool: { school: 'Colegio', entity: 'Nombre más común' },
      commonSurnameBySchool: { school: 'Colegio', entity: 'Apellido más común' },
    },
  },
  familyRender: {
    participationDynamics: { title: 'Participación' },
    names: {
      title: 'Nombres',
    },
    surnames: { title: 'Apellidos' },
    identityDiversity: { title: 'Diversidad' },
    schools: { title: 'Colegios' },
    schoolsRenewal: { title: 'Renovación' },
    schoolsEvolution: { title: 'Evolución' },
  },
};

export default statistics;
