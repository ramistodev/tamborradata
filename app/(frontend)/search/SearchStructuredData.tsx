export function SearchStructuredData() {
  return (
    <>
      {/* WEBSITE SEARCH BOX */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://tamborradata.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://tamborradata.com/search?name={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* SEARCH PAGE INFO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Búsqueda de Participantes - Tamborrada Infantil',
            url: 'https://tamborradata.com/search',
            description:
              'Busca participantes de la Tamborrada Infantil de San Sebastián. Consulta nombres, compañías y años de participación desde 2018.',
            inLanguage: 'es-ES',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Tamborradata',
              url: 'https://tamborradata.com',
            },
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
                  name: 'Búsqueda de Participantes',
                  item: 'https://tamborradata.com/search',
                },
              ],
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
                name: '¿Qué información necesito para realizar una búsqueda?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Debes introducir tu nombre completo (nombre y dos apellidos) y seleccionar la compañía en la que participaste.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Qué información muestran los resultados?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Los resultados muestran tu nombre completo, la compañía y los años en los que participaste en la Tamborrada Infantil.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Desde qué año puedo buscar participantes?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Puedes consultar participantes desde 2018 hasta la actualidad, con nuevas incorporaciones cada enero.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Por qué no aparece mi nombre?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Puede deberse a variaciones en la forma de escribir el nombre, a una compañía incorrecta o a que no existan registros desde 2018.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Puedo buscar a cualquier participante?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Sí, siempre que conozcas su nombre completo y la compañía en la que estuvo, puedes consultar su historial disponible.',
                },
              },
              {
                '@type': 'Question',
                name: '¿Con qué frecuencia se actualizan los datos del buscador?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'El buscador se actualiza automáticamente cada enero con el nuevo listado oficial de participantes.',
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
