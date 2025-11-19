import { SearchProvider } from './context/SearchProvider';
import { SearchPageContent } from './SearchPageContent';

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchPageContent />
    </SearchProvider>
  );
}
