import { CardForm } from './components/CardForm/CardForm';
import { SearchResults } from './components/SearchResults/SearchResults';

export function SearchCard() {
  return (
    <section className="relative flex flex-col sm:flex-row items-stretch gap-10 sm:gap-0 justify-center w-full max-w-[1000px] sm:bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) sm:border border-(--color-border) rounded-md">
      <div className="flex-1 w-full p-4 border border-(--color-border) sm:border-none  bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) rounded-md sm:rounded-none sm:bg-none">
        <CardForm />
      </div>
      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full border border-(--color-border) shadow-[0_0_10px_var(--eye-catching-text)] invisible sm:visible"></span>
      <div className="flex-1 w-full p-4 border border-(--color-border) sm:border-none bg-linear-to-br from-(--eye-catching-text) via-(--color-primary) to-(--color-bg-thirdary) rounded-md sm:rounded-none sm:bg-none">
        <SearchResults />
      </div>
    </section>
  );
}
