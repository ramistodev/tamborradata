import { Metadata } from 'next';
import { SearchProvider } from './context/SearchProvider';
import { SearchPageContent } from './SearchPageContent';
import { SearchStructuredData } from './SearchStructuredData';

export const metadata: Metadata = {
  title: 'Búsqueda de Participantes · Tamborradata',
  description:
    'Busca tu nombre y descubre tu historial completo de participación en la Tamborrada Infantil de San Sebastián. Consulta los años en que participaste, tu compañía y más desde 2018.',
  openGraph: {
    title: 'Búsqueda de Participantes · Tamborradata',
    description:
      'Busca tu nombre y descubre en qué años participaste en la Tamborrada Infantil de San Sebastián. Base de datos histórica desde 2018.',
    url: 'https://tamborradata.com/search',
  },
  twitter: {
    title: 'Búsqueda de Participantes · Tamborradata',
    description:
      'Busca tu nombre y descubre en qué años participaste en la Tamborrada Infantil de San Sebastián.',
  },
  alternates: {
    canonical: 'https://tamborradata.com/search',
  },
};

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchStructuredData />
      <SearchPageContent />
    </SearchProvider>
  );
}
