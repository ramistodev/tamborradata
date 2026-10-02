import Script from 'next/script';

export function YearStructuredData({ year }: { year: string }) {
  const pageTitle = `Estadísticas de la Tamborrada Infantil ${year}`;
  const pageDescription = `Análisis de la Tamborrada Infantil ${year}: participantes, nombres más comunes, colegios destacados y tendencias anuales.`;
  const canonicalUrl = `https://tamborradata.com/statistics/${year}`;
  const publicationDate = `${year}-01-20`;
  const publicationDateISO = `${publicationDate}T00:00:00.000Z`;
  const imageUrl = 'https://tamborradata.com/og-image.webp';

  const datasetStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: pageTitle,
    description: `${pageDescription} Dataset detallado con participación, nombres, apellidos y colegios.`,
    url: canonicalUrl,
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
    temporalCoverage: publicationDate,
    inLanguage: 'es-ES',
    spatialCoverage: {
      '@type': 'Place',
      name: 'Donostia / San Sebastián, Gipuzkoa',
    },
    creator: {
      '@type': 'Person',
      name: 'Ramistodev',
      url: 'https://tamborradata.com',
    },
  };

  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    author: {
      '@type': 'Person',
      name: 'Ramistodev',
    },
    datePublished: publicationDateISO,
    dateModified: publicationDateISO,
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
          name: 'Estadísticas por Año',
          item: 'https://tamborradata.com/statistics',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `Tamborrada Infantil ${year}`,
          item: canonicalUrl,
        },
      ],
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'es-ES',
    mainEntity: [
      {
        '@type': 'Question',
        name: `¿Cuáles fueron los nombres más repetidos en la Tamborrada Infantil ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Ranking de nombres más habituales de la Tamborrada Infantil ${year}, con los que lideran la clasificación anual.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Qué apellidos destacaron en la Tamborrada Infantil ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Listado de apellidos más frecuentes registrados en la edición ${year}.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Qué colegios tuvieron mayor participación en ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Colegios con mayor presencia en la Tamborrada Infantil ${year} y centros que se incorporan.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Hubo nombres nuevos en la Tamborrada Infantil ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Nombres que aparecen por primera vez en la Tamborrada Infantil ${year}.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Cuántos participantes hubo en la Tamborrada Infantil ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Participación total estimada de niños y niñas tamborreros/as en ${year}.`,
        },
      },
      {
        '@type': 'Question',
        name: `¿Dónde puedo ver el resumen de la Tamborrada Infantil ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: pageDescription,
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="dataset-year-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetStructuredData) }}
      />

      <Script
        id="article-year-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <Script
        id="webpage-year-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageStructuredData) }}
      />

      <Script
        id="faq-year-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
