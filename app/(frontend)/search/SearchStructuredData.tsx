import Script from 'next/script';

export function SearchStructuredData() {
  const pageTitle = 'Busca tu participación en la Tamborrada Infantil';
  const pageDescription =
    'Localiza tu historial de participación oficial: busca participantes, años, compañía y apariciones en la base de datos histórica desde 2018 con resultados publicados por El Diario Vasco.';
  const canonicalUrl = 'https://tamborradata.com/search';
  const imageUrl = 'https://tamborradata.com/og-image.webp';
  const searchTarget = 'https://tamborradata.com/search?name={search_term_string}';

  const publicationDateISO = '2018-01-20T00:00:00.000Z';

  const now = new Date();
  const currentYear = now.getFullYear();
  const dataReleaseDate = new Date(currentYear, 0, 20); // 20 de enero del año actual

  const lastDataYear = now >= dataReleaseDate ? currentYear : currentYear - 1;
  const lastUpdatedISO = `${lastDataYear}-01-20T00:00:00.000Z`;

  const webPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    url: canonicalUrl,
    description: pageDescription,
    image: imageUrl,
    primaryImageOfPage: imageUrl,
    inLanguage: 'es-ES',
    mainEntityOfPage: canonicalUrl,
    isFamilyFriendly: true,
    mainEntity: {
      '@type': 'SearchAction',
      name: 'Buscador de participantes de la Tamborrada Infantil',
      target: searchTarget,
      'query-input': 'required name=search_term_string',
      description:
        'Busca tu nombre y consulta tu historial de participación oficial en la Tamborrada Infantil desde 2018.',
    },
    about: [
      'historial de participación',
      'buscar participantes de la Tamborrada Infantil',
      'base de datos histórica desde 2018',
      'resultados publicados por El Diario Vasco',
      'consulta tamborrada infantil',
      'participación por colegio',
      'estadísticas tamborrada infantil',
      'búsqueda de niños y niñas',
      'datos históricos oficiales',
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://tamborradata.com' },
        { '@type': 'ListItem', position: 2, name: 'Búsqueda de Participantes', item: canonicalUrl },
      ],
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tamborradata',
      url: 'https://tamborradata.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tamborradata',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tamborradata.com/favicon.ico',
      },
    },
    isAccessibleForFree: true,
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es-ES',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué información necesito para realizar una búsqueda?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Introduce tu nombre completo (nombre y dos apellidos) y, si lo conoces, la compañía en la que participaste para afinar el historial de participación.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué información muestran los resultados?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Verás tu historial de participación oficial: años, compañía y apariciones en la Tamborrada Infantil según los resultados publicados por El Diario Vasco.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Desde qué año puedo buscar participantes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La base de datos histórica arranca en 2018 y se amplía cada enero con el nuevo listado oficial.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Por qué no aparece mi nombre?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Puede ser por variaciones en la escritura del nombre, selección incorrecta de compañía o porque no existan registros publicados desde 2018 para esa persona.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Con qué frecuencia se actualizan los datos del buscador?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cada enero se actualiza automáticamente tras la publicación oficial para mantener el historial de participación al día.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo saber si salí en la Tamborrada Infantil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Introduce tu nombre completo y la compañía en el buscador; si existen registros desde 2018 verás en qué años apareces en la Tamborrada Infantil.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="webpage-search-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />

      <Script
        id="faq-search-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
