import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const MIN_NAME_WORDS = 3;
const MAX_NAME_LENGTH = 120;
const NAME_PARAM = 'name';
const SCHOOL_PARAM = 'school';

export type SearchParams = {
  participant: string;
  schoolKey: string;
};

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const cleanName = (text: string) => text.trim().replace(/\s+/g, ' ');

// Mirrors the last search in the address bar, so the result can be shared or bookmarked
function writeUrl(search: SearchParams | null) {
  const url = new URL(window.location.href);

  if (search) {
    url.searchParams.set(NAME_PARAM, search.participant);
    url.searchParams.set(SCHOOL_PARAM, search.schoolKey);
  } else {
    url.searchParams.delete(NAME_PARAM);
    url.searchParams.delete(SCHOOL_PARAM);
  }

  window.history.replaceState(null, '', url);
}

/**
 * Form fields, their validation and the search that was last submitted. A link with `?name=` fills
 * the name; with `?name=` and `?school=` (a known school key) it also runs the search
 */
export function useSearchForm(schoolKeys: string[]) {
  const [name, setName] = useState('');
  const [schoolKey, setSchoolKey] = useState<string | null>(null);
  const [search, setSearch] = useState<SearchParams | null>(null);

  // Read the URL once on mount (not during render), so the server and client HTML match.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlName = cleanName((params.get(NAME_PARAM) ?? '').slice(0, MAX_NAME_LENGTH));
    const urlSchool = params.get(SCHOOL_PARAM);
    const school = urlSchool && schoolKeys.includes(urlSchool) ? urlSchool : null;

    if (!urlName) return;

    setName(urlName);
    setSchoolKey(school);

    if (school && countWords(urlName) >= MIN_NAME_WORDS) {
      setSearch({ participant: urlName, schoolKey: school });
    }
  }, []);

  const isNameValid = countWords(name) >= MIN_NAME_WORDS;
  const canSubmit = isNameValid && schoolKey !== null;

  function submit(event: FormEvent) {
    event.preventDefault();

    if (!canSubmit || schoolKey === null) return;

    const nextSearch = { participant: cleanName(name), schoolKey };

    setSearch(nextSearch);
    writeUrl(nextSearch);
  }

  function clear() {
    setName('');
    setSchoolKey(null);
    setSearch(null);
    writeUrl(null);
  }

  return { name, setName, schoolKey, setSchoolKey, isNameValid, canSubmit, search, submit, clear };
}
