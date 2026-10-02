import Script from 'next/script';
import { siteUrl } from '../constants';

const imageUrl = `${siteUrl}/og-image.webp`;

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}#organization`,
  name: 'Tamborradata',
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  image: imageUrl,
  sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
  description:
    'Proyecto de datos y estadísticas sobre la Tamborrada Infantil de Donostia-San Sebastián.',
};

const webSiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}#website`,
  url: siteUrl,
  name: 'Tamborradata',
  alternateName: 'Tamborradata Estadísticas',
  description: 'Tamborradata estadísticas y datos de la Tamborrada Infantil desde 2018.',
  inLanguage: 'es-ES',
  publisher: { '@id': `${siteUrl}#organization` },
  sameAs: ['https://x.com/tamborradata', 'https://github.com/ramistodev/tamborradata'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${siteUrl}/search?name={search_term_string}`,
    'query-input': 'required name=search_term_string',
    name: 'Buscar participación en la Tamborrada Infantil',
  },
};

export function StructuredData() {
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
    </>
  );
}
