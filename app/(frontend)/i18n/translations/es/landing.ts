const landing = {
  title: 'Tamborradata',
  metadata: {
    title: 'Tamborradata',
    description:
      'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de {startYear} a {endYear}, y un buscador de participantes.',
    descriptionFallback:
      'Archivo histórico y estadístico de la Tamborrada Infantil de Donostia: participaciones, nombres y colegios de cada edición, y un buscador de participantes.',
    keywords: 'Tamborradata, Tamborrada Infantil, estadísticas Tamborrada, datos Tamborrada',
  },
  structuredData: {
    datasetName: 'Tamborradata: datos de la Tamborrada Infantil',
    datasetDescription:
      'Estadísticas y participaciones de la Tamborrada Infantil de Donostia-San Sebastián, de {startYear} a {endYear}: nombres, colegios y tendencias anuales.',
    datasetDescriptionFallback:
      'Estadísticas y participaciones de la Tamborrada Infantil de Donostia-San Sebastián: nombres, colegios y tendencias anuales.',
    distributionName: 'Consulta de estadísticas globales de la Tamborrada Infantil',
    aboutStatistics: 'estadísticas de la Tamborrada',
    faqName: 'Preguntas frecuentes sobre Tamborradata',
    faqDescription:
      'Preguntas frecuentes sobre Tamborradata y los datos de la Tamborrada Infantil.',
    pressName: 'Mencionado en medios',
  },
  sections: {
    stats: 'Estadísticas',
    searchParticipants: 'Buscador',
    press: 'Prensa',
    openSource: 'Código abierto',
    contact: 'Contacto',
    faq: 'Preguntas',
  },
  common: {
    newTab: '(se abre en una pestaña nueva)',
  },
  hero: {
    phrases: {
      names: 'La Tamborrada, nombre a nombre.',
      data: 'Una tradición contada en cifras.',
      editions: 'Cada edición deja su huella.',
    },
    description:
      'Tamborradata reúne las listas de participantes de la Tamborrada Infantil de Donostia desde {startYear} y las convierte en estadísticas, evolución por colegios y un buscador para encontrar a cualquiera.',
    descriptionFallback:
      'Tamborradata reúne las listas de participantes de la Tamborrada Infantil de Donostia de todas las ediciones y las convierte en estadísticas, evolución por colegios y un buscador para encontrar a cualquiera.',
    metrics: {
      participations: 'Participaciones',
      editions: 'Ediciones',
      schools: 'Colegios',
    },
    summary: {
      topName: 'Nombre más repetido {name}',
      topSurname: 'Apellido {surname}',
      topSchool: 'Colegio {school}',
    },
  },
  stats: {
    title: 'Desde {startYear} a hoy, edición a edición',
    titleFallback: 'La Tamborrada, edición a edición',
    description:
      'Estadísticas disponibles desde {startYear} hasta {endYear}. Tendencias de participación, colegios y ediciones. Los nombres, apellidos y colegios más repetidos en cada edición.',
    descriptionFallback:
      'Tendencias de participación, colegios y ediciones. Los nombres, apellidos y colegios más repetidos en cada edición.',
    global: {
      label: 'Histórico · {startYear}-{endYear}',
      summary:
        'participaciones repartidas en {editions, plural, one {# edición} other {# ediciones}} y {schools, plural, one {# colegio} other {# colegios}}.',
      note: 'Una participación es un registro en una edición: una misma persona puede sumar varias.{hasGaps, select, yes { Aún no hay datos de {missingYears}.} other {}}',
      cta: 'Ver historia completa',
    },
    last: {
      label: 'Última edición',
      summary: 'participaciones en {schools, plural, one {# colegio} other {# colegios}}.',
      growth: '{change} frente al año anterior',
      cta: 'Ver edición {year}',
    },
    fallback: {
      global: {
        label: 'Histórico',
        title: 'La Tamborrada, edición a edición',
        text: 'Participaciones, colegios y los nombres más repetidos de todas las ediciones que reúne Tamborradata.',
      },
      last: {
        label: 'Última edición',
        title: 'La edición más reciente',
        text: 'Cuánta gente participó, de qué colegios y qué nombres se repiten más.',
      },
      cta: 'Ver estadísticas',
    },
  },
  searchParticipants: {
    title: '¿En qué años salió tu hijo o hija en la Tamborrada?',
    description:
      'Busca por nombre y apellidos entre {total} participaciones y descubre en qué ediciones aparece, con el enlace a la fuente original de cada año.',
    descriptionFallback:
      'Busca por nombre y apellidos entre todas las participaciones y descubre en qué ediciones aparece, con el enlace a la fuente original de cada año.',
    steps: {
      name: {
        title: 'Escribe nombre y dos apellidos',
        description: 'Si tiene nombre compuesto, vale con uno solo.',
      },
      school: {
        title: 'Elige el colegio',
        description: 'Evita mezclar a personas con el mismo nombre.',
      },
      sources: {
        title: 'Consulta sus años y fuentes',
        description: 'Cada edición enlaza a la noticia o lista donde figura.',
      },
    },
    cta: 'Ir al buscador',
    example: {
      ariaLabel: 'Ejemplo ilustrativo de un resultado',
      name: 'Nombre Apellido Apellido',
      school: 'Tu colegio',
      sources: 'Fuentes',
      caption: 'Ejemplo ilustrativo',
    },
  },
  press: {
    title: '«Un espejo digital de la fiesta»',
    description:
      'Así presentó {publication} Tamborradata: el «gran archivo histórico y estadístico» de la Tamborrada Infantil, con un buscador para las familias y un observatorio para entender la ciudad a través de sus nombres.',
    openArticle: 'Abrir el artículo original',
    clipping: {
      read: 'Leer el artículo',
    },
  },
  openSource: {
    title: 'La web se construye a la vista de todos',
    description:
      'El código de la interfaz, sus componentes y sus visualizaciones es público: puedes leerlo, ejecutarlo en local y proponer mejoras. El pipeline interno de obtención y procesamiento de datos no forma parte del repositorio.',
    stackLabel: 'Tecnologías',
    cta: 'Ver en GitHub',
    terminal: {
      installed: 'Dependencias instaladas',
    },
  },
  contact: {
    title: '¿Hablamos?',
    description:
      'Si has encontrado un error en los datos, quieres hablar de prensa o tienes una idea para mejorar la web, escríbenos. Respondemos a mano.',
    emailLabel: 'Correo',
    hint: 'Si es una corrección, indica el año, el nombre y el colegio.',
  },
  faq: {
    title: 'Lo que suelen preguntarnos',
    items: {
      what: {
        question: '¿Qué es Tamborradata?',
        answer:
          'Tamborradata es una plataforma independiente y de código abierto que funciona como archivo histórico y estadístico de la Tamborrada Infantil de Donostia. Reúne las listas de participantes de cada edición{hasStart, select, yes { desde {startYear}} other {}} y las convierte en estadísticas, rankings y un buscador de participantes.',
      },
      howMany: {
        question: '¿Cuántos niños y niñas participan en la Tamborrada Infantil de Donostia?',
        last: 'En la edición de {year} hubo {participations} participaciones de {schools, plural, one {# colegio} other {# colegios}}.',
        growth: 'Respecto a la edición anterior, la variación es de {change}.',
        total:
          'En total, Tamborradata reúne {participations} participaciones de {editions, plural, one {# edición} other {# ediciones}} y {schools, plural, one {# colegio distinto} other {# colegios distintos}}.',
        note: 'Una misma persona suma una participación por cada año en el que aparece.',
        fallback:
          'Puedes consultar cuántas participaciones tuvo cada edición en las estadísticas de la web.',
      },
      topName: {
        question: '¿Cuál es el nombre más común en la Tamborrada Infantil?',
        answer:
          '{name} es el nombre más repetido de la Tamborrada Infantil: aparece en {count} participaciones. Puedes ver el ranking completo de nombres en las estadísticas.',
        fallback:
          'Puedes ver el ranking de los nombres más repetidos en las estadísticas de la web.',
      },
      topSurname: {
        question: '¿Cuál es el apellido más frecuente entre los participantes?',
        answer:
          '{surname} es el apellido más frecuente: aparece en {count} participaciones. Puedes ver el ranking completo de apellidos en las estadísticas.',
        fallback:
          'Puedes ver el ranking de los apellidos más frecuentes en las estadísticas de la web.',
      },
      topSchool: {
        question: '¿Qué colegio tiene más participantes en la Tamborrada Infantil?',
        answer:
          '{school} es el colegio con más participaciones: {count}. Puedes ver el ranking completo de colegios en las estadísticas.',
        fallback:
          'Puedes ver el ranking de los colegios con más participaciones en las estadísticas de la web.',
      },
      when: {
        question: '¿Cuándo se celebra la Tamborrada Infantil de Donostia?',
        answer:
          'Cada 20 de enero, el Día de San Sebastián, desfilan los niños y niñas de los colegios de Donostia. Tamborradata recoge las listas de participantes que se publican cada año.',
      },
      find: {
        question: '¿Cómo puedo saber en qué años salió mi hijo o hija en la Tamborrada?',
        answer:
          'En el buscador de participantes, escribe el nombre y los dos apellidos (si tiene nombre compuesto, vale con uno solo) y elige el colegio. Te mostrará en qué ediciones aparece, con el enlace a la fuente original de cada año.',
      },
      register: {
        question: '¿Hace falta registrarse o dar datos para usar el buscador?',
        answer:
          'No. El buscador funciona sin registro y sin pedir datos privados: solo escribes un nombre y eliges el colegio.',
      },
      years: {
        question: '¿De qué años hay datos de la Tamborrada Infantil?',
        answer:
          'Hay datos de {editions, plural, one {# edición} other {# ediciones}}, entre {startYear} y {endYear}.{hasGaps, select, yes { No hay datos de {missingYears}.} other {}}',
        fallback:
          'Hay datos de varias ediciones de la Tamborrada Infantil de Donostia, pero ahora mismo no podemos mostrar el rango exacto de años.',
      },
      notFound: {
        question: '¿Por qué no aparece el nombre de mi hijo o hija en el buscador?',
        answer:
          'Comprueba que el colegio sea el correcto y prueba a quitar el segundo nombre o a escribir otra variante del apellido: en la fuente puede estar escrito de otra forma. También puede ser de una edición de la que no hay datos. Si sigues sin encontrarlo, escríbenos.',
      },
      sources: {
        question: '¿De dónde salen los datos y son oficiales?',
        answer:
          'Los nombres proceden de las páginas que Diario Vasco dedica a las compañías infantiles de la Tamborrada; para las ediciones más antiguas se leen copias archivadas de esas páginas en Internet Archive. No es un registro oficial: los listados se procesan para poder buscarlos y pueden contener erratas, por eso cada resultado del buscador enlaza a su fuente.',
      },
      updates: {
        question: '¿Cada cuánto se actualizan los datos?',
        answer:
          'Una vez al año: cuando se publican los listados de una nueva edición, se procesan y se añaden a las estadísticas y al buscador.{hasLast, select, yes { La última edición incluida es la de {year}.} other {}}',
      },
      participation: {
        question: '¿Qué significa «participación» en las estadísticas?',
        answer:
          'Una participación es un registro de una persona en una edición. Una misma persona puede sumar varias, una por cada año en el que aparece. Por eso el número de participaciones no es el de personas distintas.',
      },
      correction: {
        question: '¿Puedo pedir una corrección o avisar de un error en los datos?',
        answer:
          'Sí. Escríbenos a {email} indicando el año, el nombre y el colegio, y lo revisamos.',
      },
      openSource: {
        question: '¿Tamborradata es de código abierto?',
        answer:
          'Sí. El código de la interfaz, sus componentes y sus visualizaciones es público en github.com/ramistodev/tamborradata: puedes leerlo, ejecutarlo en local y proponer mejoras. El pipeline interno de obtención y procesamiento de datos no forma parte del repositorio.',
      },
    },
  },
};

export default landing;
