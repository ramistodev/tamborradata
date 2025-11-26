import Script from 'next/script';

export function GlobalStructuredData() {
  const pageTitle = 'Estadísticas globales de la Tamborrada Infantil';
  const pageDescription =
    'Análisis global de la Tamborrada Infantil desde 2018: evolución de nombres, colegios, participación y tendencias culturales año a año.';
  const canonicalUrl = 'https://tamborradata.com/statistics/global';
  const imageUrl = 'https://tamborradata.com/og-image.webp';
  const publicationDateISO = '2018-01-20T00:00:00.000Z';

  const now = new Date();
  const currentYear = now.getFullYear();
  const dataReleaseDate = new Date(currentYear, 0, 20); // 20 de enero del año actual

  const lastDataYear = now >= dataReleaseDate ? currentYear : currentYear - 1;
  const lastUpdatedISO = `${lastDataYear}-01-20T00:00:00.000Z`;

  const datasetStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: pageTitle,
    description: `${pageDescription} Dataset longitudinal con cobertura desde 2018 y resultados consolidados.`,
    url: canonicalUrl,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    creator: {
      '@type': 'Person',
      name: 'Ramistodev',
      url: 'https://tamborradata.com',
    },
    temporalCoverage: '2018-01-20/',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Donostia-San Sebastián, Gipuzkoa, España',
    },
    inLanguage: 'es-ES',
    image: imageUrl,
  };

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    name: pageTitle,
    description: pageDescription,
    articleBody: pageDescription,
    articleSection: 'Estadísticas globales',
    author: {
      '@type': 'Person',
      name: 'Ramistodev',
    },
    datePublished: publicationDateISO,
    dateModified: lastUpdatedISO,
    mainEntityOfPage: canonicalUrl,
    image: imageUrl,
    inLanguage: 'es-ES',
    publisher: {
      '@type': 'Organization',
      name: 'Tamborradata',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tamborradata.com/favicon.ico',
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tamborradata',
      url: 'https://tamborradata.com',
    },
  };

  const webpageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    url: canonicalUrl,
    description: pageDescription,
    image: imageUrl,
    inLanguage: 'es-ES',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://tamborradata.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Estadísticas Globales',
          item: canonicalUrl,
        },
      ],
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Tamborradata',
      url: 'https://tamborradata.com',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es-ES',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuáles son los nombres más comunes en la serie histórica?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Listado de los nombres más frecuentes en la historia de la Tamborrada Infantil, mostrando su evolución desde 2018.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué apellidos destacan en las estadísticas globales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Apellidos más habituales en la serie histórica completa de la Tamborrada Infantil y cómo han evolucionado.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué colegios lideran la participación acumulada?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Colegios con mayor participación total desde 2018 y su tendencia a lo largo de los años.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Hay colegios presentes en todas las ediciones?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Centros educativos que han participado en cada edición desde 2018 sin interrupciones.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuál ha sido el año con más participantes?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Identifica el año con mayor número de participantes y las variaciones a lo largo del tiempo.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos nombres y apellidos únicos se han registrado?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Total de nombres y apellidos únicos de la serie histórica, para medir la diversidad global.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuáles son los nombres más comunes en cada colegio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nombres más frecuentes dentro de cada centro educativo a lo largo de la serie histórica.',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="dataset-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />

      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <Script
        id="webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageStructuredData) }}
      />

      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
