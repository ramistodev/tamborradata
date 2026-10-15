const search = {
  title: 'Buscar participantes',
  metadata: {
    title: 'Buscar participante de la Tamborrada Infantil de Donostia',
    description:
      'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron. Ediciones de {startYear} a {endYear}.',
    descriptionFallback:
      'Busca participantes de la Tamborrada Infantil de Donostia por nombre y colegio y mira en qué años salieron, con enlace a la fuente original.',
  },
  hero: {
    titleLine1: 'Buscar participante',
    titleLine2: 'de la <accent>Tamborrada</accent> Infantil',
    description:
      'Escribe el nombre y los dos apellidos, elige el colegio y descubre en qué años salió en la Tamborrada Infantil de Donostia. Cada año enlaza a su fuente original.',
    about:
      'Este buscador reúne a los participantes de la Tamborrada Infantil de Donostia, el desfile anual de niños y niñas tamborreros y cantineras. Muestra en qué años aparece una persona en el colegio elegido y enlaza a la fuente original de cada año.',
  },
  form: {
    ariaLabel: 'Buscador de participantes',
    hint: 'Todos los campos son obligatorios: escribe al menos tres palabras (nombre y dos apellidos) y elige un colegio.',
    name: {
      placeholder: 'Nombre y dos apellidos',
      ariaLabel: 'Nombre y dos apellidos',
    },
    school: {
      placeholder: 'Colegio',
      ariaLabel: 'Colegio',
      searchPlaceholder: 'Buscar colegio...',
      searchAriaLabel: 'Buscar colegio',
      empty: 'Ningún colegio coincide',
      resultsCount:
        '{count, plural, =0 {Ningún colegio coincide} one {# colegio encontrado} other {# colegios encontrados}}',
    },
    submit: 'Buscar',
  },
  results: {
    title: 'Resultados de la búsqueda',
    loading: 'Buscando…',
    announce:
      'Búsqueda completada: {records, plural, one {# registro compatible} other {# registros compatibles}} y {participations, plural, one {# participación} other {# participaciones}} para “{participant}” en {school}.',
    summary: {
      records: '{count, plural, one {# registro compatible} other {# registros compatibles}}',
      participations: '{count, plural, one {# participación} other {# participaciones}}',
      query: '“{participant}” · {school}',
      clear: 'Limpiar búsqueda',
    },
    card: {
      exact: 'Coincidencia exacta',
      compatible: 'Coincidencia compatible',
      count: '{count, plural, one {# participación} other {# participaciones}}',
    },
    row: {
      viewSource: 'Ver fuente',
      viewSourceAriaLabel: 'Ver fuente de {year} en {host}, se abre en una pestaña nueva',
      noSource: 'Sin fuente',
    },
  },
  status: {
    prompt: {
      title: 'Introduce nombre, apellidos y colegio',
      description:
        'Escribe el nombre completo tal y como lo conoces. No hace falta que coincida palabra por palabra con el registro, y los acentos no importan. Después elige el colegio.',
    },
    noResults: {
      title: 'No hemos encontrado coincidencias',
      description:
        'No hay ningún registro compatible con ese nombre en este colegio. Revisa que esté bien escrito o prueba con otro colegio.',
    },
    error: {
      title: 'No se ha podido completar la búsqueda',
      description: 'Ha ocurrido un error o la petición ha tardado demasiado. Inténtalo de nuevo.',
      retry: 'Reintentar',
    },
    rateLimited: {
      title: 'Demasiadas búsquedas seguidas',
      // Spoken once by the live region; the panel shows `countdown` instead
      description:
        'Has hecho muchas búsquedas en poco tiempo. Vuelve a intentarlo {minutes, plural, one {en # minuto} other {en # minutos}}.',
      countdown:
        'Has hecho muchas búsquedas en poco tiempo. Podrás volver a buscar en {minutes, plural, =0 {{seconds} s} other {{minutes} min {seconds} s}}.',
      ready: 'Ya puedes volver a buscar.',
      retry: 'Reintentar',
    },
  },
  overview: {
    title: 'Datos disponibles en el buscador',
    summary:
      'Participaciones registradas en {editionsCount, plural, one {<highlight>#</highlight> edición} other {<highlight>#</highlight> ediciones}} y {schoolsCount, plural, one {<highlight>#</highlight> colegio distinto} other {<highlight>#</highlight> colegios distintos}}. Es todo lo que puedes encontrar en el buscador.',
  },
  timeline: {
    ariaLabel: 'Ediciones de {startYear} a {endYear}',
    gapsCount: '{count, plural, one {# año sin datos} other {# años sin datos}}',
    gapsCaption: 'Huecos: {years}',
    missingYear: '{year}: sin datos',
    missingRange: '{from}–{to}: sin datos',
  },
  topStats: {
    name: 'Nombre más repetido',
    surname: 'Apellido más repetido',
    school: 'Colegio con más participaciones',
    count: '{count, plural, one {# participación} other {# participaciones}}',
  },
  structuredData: {
    home: 'Inicio',
    keywords:
      'buscar participantes Tamborrada Infantil, historial de participación, Tamborrada Infantil Donostia, tamborreros y cantineras, participación por colegio, Diario Vasco',
    appName: 'Buscador de participantes de la Tamborrada Infantil',
    appDescription:
      'Herramienta web para buscar participantes de la Tamborrada Infantil de Donostia por nombre y colegio y consultar en qué años salieron. Ediciones de {startYear} a {endYear}.',
    appDescriptionFallback:
      'Herramienta web para buscar participantes de la Tamborrada Infantil de Donostia por nombre y colegio y consultar en qué años salieron.',
  },
  faq: {
    kicker: 'Preguntas frecuentes',
    title: 'Preguntas frecuentes',
    items: {
      scope: {
        question: '¿Qué puedo consultar en el buscador de la Tamborrada Infantil?',
        answer:
          'Puedes comprobar en qué ediciones de la Tamborrada Infantil de Donostia aparece una persona a lo largo de los años. Cada resultado muestra el nombre tal y como se publicó, el colegio, los años de participación y un enlace a la fuente de donde se obtuvo esa participación.',
      },
      requirements: {
        question: '¿Qué necesito para buscar a alguien?',
        answer:
          'Escribe al menos tres palabras (por ejemplo, el nombre y los dos apellidos) y elige el colegio. No importan las mayúsculas ni las tildes. Si la persona tiene dos nombres, puedes omitir el segundo.',
      },
      whySchool: {
        question: '¿Por qué tengo que elegir un colegio?',
        answer:
          'Porque hay muchos nombres y apellidos repetidos entre los participantes, y el colegio permite distinguir a unas personas de otras. La búsqueda se hace solo dentro del colegio que elijas, así que los resultados son más precisos y solo aparecen personas del colegio que te interesa.',
      },
      matchTypes: {
        question: '¿Qué significa “coincidencia exacta” y “coincidencia compatible”?',
        answer:
          '“Exacta” significa que el nombre que escribiste coincide palabra por palabra con el registrado. “Compatible” significa que lo que escribiste encaja con un registro que tiene más o menos datos: por ejemplo, un segundo nombre que no escribiste o un solo apellido. No podemos asegurar que un resultado compatible sea la misma persona, así que conviene revisar el año y la fuente.',
      },
      multipleResults: {
        question: '¿Por qué aparecen varios resultados para una misma búsqueda?',
        answer:
          'Cada forma distinta en que aparece un nombre en las fuentes es un resultado. Por ejemplo, una persona puede estar publicada un año con segundo nombre y otro año sin él, o con un solo apellido. Dentro de cada resultado se agrupan todos los años en los que aparece esa forma del nombre en ese colegio. Es una agrupación por nombre registrado, no una identificación verificada: dos personas distintas con el mismo nombre y colegio en años diferentes aparecerían juntas, así que conviene revisar las fuentes.',
      },
      years: {
        question: '¿De qué años hay datos?',
        answer:
          'Hay datos de {editionsCount, plural, one {# edición} other {# ediciones}}, entre {startYear} y {endYear}.{hasGaps, select, yes { No hay datos de {missingYears}.} other {}}',
      },
      yearsFallback: {
        question: '¿De qué años hay datos?',
        answer:
          'Hay datos de varias ediciones de la Tamborrada Infantil de Donostia, pero ahora mismo no podemos mostrar el rango exacto de años. Puedes buscar con normalidad y volver más tarde para consultarlo.',
      },
      sources: {
        question: '¿De dónde salen los datos y son oficiales?',
        answer:
          'Los nombres proceden de las páginas que Diario Vasco dedica a las compañías infantiles de la Tamborrada; para las ediciones más antiguas se leen copias archivadas de esas páginas en Internet Archive. No es un registro oficial: los listados se procesan para poder buscarlos y pueden contener erratas, tanto de la fuente como del tratamiento. Por eso cada resultado enlaza a su fuente.',
      },
      notFound: {
        question: '¿Por qué no aparece la persona que busco?',
        answer:
          'Las causas más habituales son que el colegio elegido no sea el correcto, que el nombre esté escrito de otra forma en la fuente o que participara en una edición de la que no hay datos. Además, un número muy pequeño de registros (menos del 1 %) no se pudo separar en nombre y apellidos y no se puede encontrar. Prueba a cambiar de colegio, a quitar el segundo nombre o a escribir otra variante del apellido.',
      },
    },
  },
};

export default search;
