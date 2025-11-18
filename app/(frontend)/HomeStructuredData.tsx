export function HomeStructuredData() {
  return (
    <>
      {/* DATASET */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Tamborradata Dataset: Participación y datos culturales',
            description:
              'Dataset completo con estadísticas oficiales de la Tamborrada Infantil de San Sebastián desde 2018.',
            url: 'https://tamborradata.com',
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
            keywords: ['tamborrada infantil', 'donostia', 'estadísticas', 'datos culturales'],
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
            headline: 'Estadísticas de la Tamborrada Infantil desde 2018',
            description:
              'Análisis estructurado de la participación, nombres y colegios de la Tamborrada Infantil.',
            author: {
              '@type': 'Person',
              name: 'Ramistodev',
              url: 'https://tamborradata.com',
            },
            datePublished: '2018-01-20',
            dateModified: '2025-01-20',
            publisher: {
              '@type': 'Organization',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tamborradata.com/favicon.ico',
              },
            },
            mainEntityOfPage: 'https://tamborradata.com',
            image: 'https://tamborradata.com/og-image.webp',
            inLanguage: 'es-ES',
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
            name: 'Tamborradata · Estadísticas de la Tamborrada Infantil',
            url: 'https://tamborradata.com',
            description:
              'Página principal con estadísticas oficiales de la Tamborrada Infantil desde 2018.',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Inicio',
                  item: 'https://tamborradata.com',
                },
              ],
            },
            inLanguage: 'es',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://tamborradata.com/favicon.ico',
              },
            },
          }),
        }}
      />

      {/* FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: '¿Qué es Tamborradata?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Plataforma que analiza datos históricos de la Tamborrada Infantil mediante algoritmos, transformándolos en estadísticas y visualizaciones interactivas.',
                },
              },
              {
                '@type': 'Question',
                name: '¿De dónde salen los datos?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'De los artículos anuales de El Diario Vasco, recopilados automáticamente para construir una base histórica completa.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cómo se analizan los datos?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Mediante algoritmo propio que limpia, estructura y analiza la información para generar estadísticas comparables entre años.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cada cuánto se actualizan las estadísticas?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Una vez al año en enero, cuando El Diario Vasco publica los nuevos listados de participantes.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué tipo de información se muestra?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Estadísticas sobre nombres comunes, colegios participantes, diversidad de apellidos y otros datos relevantes de la Tamborrada Infantil.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Los datos personales son públicos?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. Solo se muestran estadísticas agregadas y resúmenes generales para proteger la privacidad de los participantes.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué tipo de análisis hace Tamborradata?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Análisis de participación, nombres comunes, evolución de colegios y tendencias culturales basadas en datos históricos recopilados.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Cómo puedo contactar con Tamborradata?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A través del correo electrónico contact@tamborradata.com, correo oficial para consultas y sugerencias.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Puedo usar los datos para mis propios análisis?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí. Los datos están bajo licencia Creative Commons BY-SA 4.0, permitiendo uso libre citando la fuente.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Quién está detrás de Tamborradata?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Proyecto independiente sin ánimo de lucro desarrollado por Ramistodev para conservar la historia de la Tamborrada Infantil.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
