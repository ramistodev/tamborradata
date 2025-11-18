import { GlobalStructuredData } from './GlobalStructuredData';
import { GlobalProvider } from './context/GlobalProvider';
import { GlobalPageContent } from './GlobalPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estadísticas globales de la Tamborrada Infantil · Tamborradata',
  description:
    'Análisis global de la Tamborrada Infantil de San Sebastián desde 2018: evolución de nombres, colegios, participación y tendencias culturales a lo largo de los años.',
  openGraph: {
    title: 'Estadísticas globales de la Tamborrada Infantil · Tamborradata',
    description:
      'Explora la evolución histórica de la Tamborrada Infantil: nombres más comunes, colegios más constantes, participación total y tendencias culturales desde 2018.',
    url: 'https://tamborradata.com/statistics/global',
  },
  twitter: {
    title: 'Estadísticas globales de la Tamborrada Infantil · Tamborradata',
    description:
      'Visualiza en un solo lugar la evolución completa de la Tamborrada Infantil desde 2018: nombres, colegios y participación.',
  },
  alternates: {
    canonical: 'https://tamborradata.com/statistics/global',
  },
};

export default function GlobalPage() {
  return (
    <GlobalProvider>
      <GlobalStructuredData />
      <GlobalPageContent />
    </GlobalProvider>
  );
}
