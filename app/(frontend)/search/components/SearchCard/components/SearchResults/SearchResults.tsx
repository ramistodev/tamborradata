import { Results } from './components/Results';

export function SearchResults() {
  return (
    <div className="h-full flex flex-col justify-start gap-6">
      <h2 className="text-xl md:text-2xl font-bold text-center">Resultados de la búsqueda</h2>
      <Results />
    </div>
  );
}
