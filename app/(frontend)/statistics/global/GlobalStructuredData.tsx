export function GlobalStructuredData() {
  return (
    <>
      {/* DATASET */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Estadísticas Globales de la Tamborrada Infantil',
            description:
              'Dataset longitudinal con la evolución de participación, nombres, colegios y tendencias culturales de la Tamborrada Infantil desde 2018.',
            url: 'https://tamborradata.com/statistics/global',
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
          }),
        }}
      />

      {/* ARTICLE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline:
              'Estadísticas Globales de la Tamborrada Infantil: evolución histórica desde 2018',
            description:
              'Análisis histórico completo de la Tamborrada Infantil desde 2018 con datos reales procesados por IA.',
            author: {
              '@type': 'Person',
              name: 'Ramistodev',
            },
            datePublished: '2018-01-20',
            dateModified: new Date().toISOString(),
            mainEntityOfPage: 'https://tamborradata.com/statistics/global',
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

      {/* WEBPAGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Análisis Histórico Completo: Tamborrada Infantil desde 2018',
            url: 'https://tamborradata.com/statistics/global',
            description:
              'Página global con la evolución histórica completa de la Tamborrada Infantil desde 2018.',
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
                  name: 'Estadísticas Globales',
                  item: 'https://tamborradata.com/statistics/global',
                },
              ],
            },
            inLanguage: 'es-ES',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
            },
          }),
        }}
      />

      {/* FAQ PAGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Top nombres de la tamborrada',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Listado de los nombres más comunes en la historia de la Tamborrada Infantil, mostrando su evolución desde 2018.',
                },
              },
              {
                '@type': 'Question',
                name: 'Top apellidos de la tamborrada',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Listado de los apellidos más frecuentes en la serie histórica de la Tamborrada Infantil, destacando su evolución anual.',
                },
              },
              {
                '@type': 'Question',
                name: 'Top colegios de la tamborrada',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Identifica los colegios con mayor participación acumulada en la Tamborrada Infantil desde 2018, mostrando tendencias y cambios.',
                },
              },
              {
                '@type': 'Question',
                name: 'Top nombres con más participaciones en la Tamborrada Infantil desde 2018',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Listado de los nombres más repetidos en la serie histórica completa, mostrando su evolución año a año.',
                },
              },
              {
                '@type': 'Question',
                name: 'Top colegios con mayor participación acumulada desde 2018',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Identifica los colegios con más participaciones totales en la Tamborrada Infantil a lo largo de los años.',
                },
              },
              {
                '@type': 'Question',
                name: 'Evolución de la tamborrada infantil',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Muestra la evolución de la Tamborrada Infantil a lo largo de los años, destacando tendencias y cambios significativos.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuál ha sido el nombre más repetido en la Tamborrada Infantil durante todo el periodo analizado?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El análisis muestra nombres con más participaciones en toda la serie histórica, destacando los más constantes.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué apellidos son los más frecuentes en las estadísticas globales de la Tamborrada Infantil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Identifica apellidos con mayor número de participaciones durante todos los años, mostrando las tendencias más estables.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuántos nombres diferentes se han utilizado en la Tamborrada Infantil a lo largo de todos los años?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Recoge el número total de nombres únicos registrados en toda la serie histórica, reflejando su amplitud.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuántos apellidos únicos se han registrado en la Tamborrada Infantil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Muestra cuántos apellidos distintos han participado en el periodo completo, evidenciando una composición familiar muy variada.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué colegio ha tenido la mayor participación acumulada en la Tamborrada Infantil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Identifica centros educativos con más participación total y los que se mantienen destacados en primeras posiciones.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué colegios han participado todos los años sin interrupción?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Muestra centros presentes en cada edición durante toda la serie histórica, destacando la participación sostenida.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cuál ha sido el año con más participantes en la Tamborrada Infantil?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Indica el año con mayor número de participantes, así como las variaciones y tendencias del periodo analizado.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué nombres son los más comunes en los diferentes colegios?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Permite ver nombres más frecuentes dentro de cada centro a lo largo de la historia, mostrando coincidencias y diferencias.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
