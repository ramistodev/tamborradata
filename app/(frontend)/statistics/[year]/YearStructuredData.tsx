export function YearStructuredData({ year }: { year: string }) {
  return (
    <>
      {/* DATASET DEL AÑO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: `Tamborrada Infantil ${year} · Dataset`,
            description: `Datos oficiales de la Tamborrada Infantil ${year}: participación, nombres, colegios y apellidos registrados en esta edición.`,
            url: `https://tamborradata.com/statistics/${year}`,
            license: 'https://creativecommons.org/licenses/by-sa/4.0/',
            temporalCoverage: `${year}-01-20`,
            spatialCoverage: {
              '@type': 'Place',
              name: 'Donostia-San Sebastián, Gipuzkoa',
            },
            creator: {
              '@type': 'Person',
              name: 'Ramistodev',
              url: 'https://tamborradata.com',
            },
          }),
        }}
      />

      {/* ARTICLE DEL AÑO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `Estadísticas de la Tamborrada Infantil ${year}`,
            description: `Resumen anual de la Tamborrada Infantil ${year}: nombres más repetidos, participación total, colegios destacados y nuevas incorporaciones.`,
            author: {
              '@type': 'Person',
              name: 'Ramistodev',
            },
            datePublished: `${year}-01-20`,
            dateModified: new Date().toISOString(),
            mainEntityOfPage: `https://tamborradata.com/statistics/${year}`,
            image: 'https://tamborradata.com/og-image.webp',
            inLanguage: 'es-ES',
            publisher: {
              '@type': 'Organization',
              name: 'Tamborradata',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tamborradata.com/favicon.ico',
              },
            },
          }),
        }}
      />

      {/* WEBPAGE DEL AÑO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Tamborrada Infantil ${year} · Estadísticas`,
            url: `https://tamborradata.com/statistics/${year}`,
            description: `Página con los datos oficiales de la Tamborrada Infantil ${year}.`,
            inLanguage: 'es-ES',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Inicio',
                  item: 'https://tamborradata.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Estadísticas por Año',
                  item: 'https://tamborradata.com/statistics',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `Año ${year}`,
                  item: `https://tamborradata.com/statistics/${year}`,
                },
              ],
            },
          }),
        }}
      />

      {/* FAQ DEL AÑO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Top nombres de la tamborrada ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Listado de los nombres más repetidos en la Tamborrada Infantil ${year}, incluyendo los que ocuparon los primeros puestos.`,
                },
              },
              {
                '@type': 'Question',
                name: `Top colegios de la tamborrada ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `En esta sección se identifican los colegios con mayor participación en la Tamborrada Infantil ${year}.`,
                },
              },
              {
                '@type': 'Question',
                name: `Resumen de la tamborrada de ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Sección que ofrece un resumen de los datos más relevantes de la Tamborrada Infantil ${year}, incluyendo participación y tendencias.`,
                },
              },
              {
                '@type': 'Question',
                name: `¿Cuál fue el nombre más repetido en la Tamborrada Infantil ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Esta página muestra el ranking anual de nombres más repetidos en la Tamborrada Infantil ${year}, incluyendo los que ocuparon los primeros puestos.`,
                },
              },
              {
                '@type': 'Question',
                name: `¿Cuántos participantes hubo en la Tamborrada Infantil ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `La sección de participación total indica el número exacto de niños y niñas tamborreros/as que formaron parte del evento en ${year}.`,
                },
              },
              {
                '@type': 'Question',
                name: `¿Qué apellidos fueron más frecuentes en la Tamborrada Infantil ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `El análisis anual identifica los apellidos más comunes registrados en la edición de ${year}.`,
                },
              },
              {
                '@type': 'Question',
                name: `¿Qué colegios destacaron en la Tamborrada Infantil ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `La página muestra qué colegios tuvieron mayor participación en ${year} y cuáles se incorporaron como nuevos centros.`,
                },
              },
              {
                '@type': 'Question',
                name: `¿Qué nombres fueron nuevos en la Tamborrada Infantil ${year}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `La sección de nombres nuevos recoge aquellos que aparecieron por primera vez en la edición de ${year}.`,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
