import Script from 'next/script';

export function HomeStructuredData({ siteUrl, pageTitle, pageDescription, imageUrl }) {
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const webPageId = `${siteUrl}#webpage`;
  const datasetId = `${siteUrl}#dataset`;

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const januaryTwentyThisYear = Date.UTC(currentYear, 0, 20);
  const lastUpdatedYear = now.getTime() >= januaryTwentyThisYear ? currentYear : currentYear - 1;

  const publicationDateISO = '2018-01-20T00:00:00.000Z';
  const lastUpdatedISO = `${lastUpdatedYear}-01-20T00:00:00.000Z`;
  const temporalCoverage = `2018-01-20/${lastUpdatedYear}-01-20`;

  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: 'Tamborradata',
    description:
      'Proyecto de datos y estadísticas sobre la Tamborrada Infantil de Donostia-San Sebastián.',
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    image: imageUrl,
    sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
  };

  const webSiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'Tamborradata',
    alternateName: 'Tamborradata Estadísticas',
    description: 'Tamborradata estadísticas y datos de la Tamborrada Infantil desde 2018.',
    url: siteUrl,
    inLanguage: 'es-ES',
    publisher: { '@id': organizationId },
    sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?name={search_term_string}`,
      'query-input': 'required name=search_term_string',
      name: 'Buscar participación en la Tamborrada Infantil',
    },
  };

  const datasetStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': datasetId,
    name: 'Tamborradata: datos de la Tamborrada Infantil',
    description:
      'Dataset con estadísticas y participación de la Tamborrada Infantil de Donostia-San Sebastián desde 2018: nombres, colegios y tendencias anuales.',
    url: siteUrl,
    sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    creator: { '@id': organizationId },
    publisher: { '@id': organizationId },
    inLanguage: 'es-ES',
    temporalCoverage,
    spatialCoverage: {
      '@type': 'Place',
      name: 'Donostia-San Sebastián, Gipuzkoa, España',
    },
    keywords: ['Tamborradata', 'Tamborrada Infantil', 'estadísticas Tamborrada'],
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'text/html',
        contentUrl: `${siteUrl}/statistics/global`,
        name: 'Consulta de estadísticas globales de la Tamborrada Infantil',
      },
    ],
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
  };

  const webPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': ['WebPage', 'CollectionPage'],
    '@id': webPageId,
    url: siteUrl,
    name: pageTitle,
    description: pageDescription,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    image: imageUrl,
    inLanguage: 'es-ES',
    isFamilyFriendly: true,
    isAccessibleForFree: true,
    mainEntityOfPage: { '@id': webPageId },
    about: [
      { '@type': 'Thing', name: 'Tamborradata' },
      { '@type': 'Thing', name: 'Tamborrada Infantil' },
      { '@type': 'Thing', name: 'estadísticas de la Tamborrada' },
    ],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl }],
    },
    keywords: ['Tamborradata', 'Tamborrada Infantil', 'estadísticas Tamborrada'],
    isPartOf: { '@id': websiteId, '@type': 'WebSite' },
    publisher: { '@id': organizationId, '@type': 'Organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?name={search_term_string}`,
      'query-input': 'required name=search_term_string',
      name: 'Buscar participación en la Tamborrada Infantil',
    },
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}#faq`,
    url: siteUrl,
    name: 'Preguntas frecuentes sobre Tamborradata',
    description: 'Preguntas frecuentes sobre Tamborradata y los datos de la Tamborrada Infantil.',
    inLanguage: 'es-ES',
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué es Tamborradata?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tamborradata es el sitio de estadísticas y datos abiertos sobre la Tamborrada Infantil de Donostia, con una base histórica consolidada desde 2018.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Dónde consultar las estadísticas de la Tamborrada Infantil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'En tamborradata.com puedes ver estadísticas de participación, nombres, colegios y tendencias de la Tamborrada Infantil desde 2018.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo buscar mi participación en la Tamborrada Infantil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Accede a tamborradata.com/search e introduce tu nombre completo y compañía para localizar tu historial desde 2018.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué información ofrece Tamborradata?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ofrecemos estadísticas sobre participación, nombres, colegios, evolución por año y análisis culturales basados en los listados publicados cada enero.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Para qué sirve la base de datos histórica?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La base histórica preserva y analiza la evolución de la Tamborrada Infantil, aportando datos verificables para ciudadanía, investigadores y medios.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Con qué frecuencia se actualizan los datos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cada enero se incorporan los resultados recién publicados, manteniendo actualizadas las estadísticas y el buscador.',
        },
      },
      {
        '@type': 'Question',
        name: '¿De dónde proceden los datos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Los datos se basan en los listados publicados por El Diario Vasco, procesados y normalizados por Tamborradata desde 2018.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Los datos personales son públicos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No publicamos datos personales individuales; solo se muestran estadísticas agregadas y resúmenes para proteger la privacidad.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo usar los datos en mis proyectos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, la información está bajo licencia Creative Commons BY-SA 4.0; cita Tamborradata como fuente y respeta la atribución.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Quién está detrás de Tamborradata?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tamborradata es un proyecto independiente desarrollado por Ramistodev para reforzar y preservar los datos de la Tamborrada Infantil.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteStructuredData) }}
      />
      <Script
        id="dataset-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />
      <Script
        id="webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
