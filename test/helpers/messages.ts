import en from '@/app/(frontend)/i18n/translations/en';
import es from '@/app/(frontend)/i18n/translations/es';
import eu from '@/app/(frontend)/i18n/translations/eu';

export const LOCALES = ['es', 'en', 'eu'] as const; // test order (NOT the routing order en, es, eu)
export type TestLocale = (typeof LOCALES)[number];
export type Messages = typeof es;
export const messagesByLocale: Record<TestLocale, Messages> = { es, en, eu } as never;

const join = (prefix: string, key: string | number) => (prefix ? `${prefix}.${key}` : String(key));

/** Leaf paths of a message tree, dotted. Arrays expand to `path.0`, `path.1`. A non-string leaf maps to '' so the parity test flags it. */
export function flattenMessages(tree: unknown, prefix = ''): Record<string, string> {
  if (typeof tree === 'string') return { [prefix]: tree };
  if (Array.isArray(tree)) {
    return Object.assign({}, ...tree.map((item, index) => flattenMessages(item, join(prefix, index))));
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.assign(
      {},
      ...Object.entries(tree).map(([key, value]) => flattenMessages(value, join(prefix, key))),
    );
  }
  return { [prefix]: '' };
}

/** Paths whose value is an array, mapped to its length. */
export function arrayLengths(tree: unknown, prefix = ''): Record<string, number> {
  if (Array.isArray(tree)) {
    return Object.assign(
      { [prefix]: tree.length },
      ...tree.map((item, index) => arrayLengths(item, join(prefix, index))),
    );
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.assign(
      {},
      ...Object.entries(tree).map(([key, value]) => arrayLengths(value, join(prefix, key))),
    );
  }
  return {};
}

const BLOCK_TYPES = new Set(['plural', 'select', 'selectordinal']);

function matchingBrace(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Unbalanced braces in ICU message: ${text}`);
}

function collectArgument(inner: string, found: Set<string>): void {
  const firstComma = inner.indexOf(',');
  const name = (firstComma === -1 ? inner : inner.slice(0, firstComma)).trim();
  if (name) found.add(name);
  if (firstComma === -1) return;

  const rest = inner.slice(firstComma + 1);
  const secondComma = rest.indexOf(',');
  const type = (secondComma === -1 ? rest : rest.slice(0, secondComma)).trim();
  if (secondComma === -1 || !BLOCK_TYPES.has(type)) return;

  const body = rest.slice(secondComma + 1);
  let j = 0;
  while (j < body.length) {
    if (body[j] === '{') {
      const end = matchingBrace(body, j);
      collect(body.slice(j + 1, end), found);
      j = end + 1;
    } else {
      j += 1;
    }
  }
}

function collect(message: string, found: Set<string>): void {
  let i = 0;
  while (i < message.length) {
    const ch = message[i];
    if (ch === "'") {
      const next = message[i + 1];
      if (next === "'") {
        i += 2;
      } else if (next === '{' || next === '}' || next === '<' || next === '>') {
        const close = message.indexOf("'", i + 1);
        i = close === -1 ? message.length : close + 1;
      } else {
        i += 1;
      }
      continue;
    }
    if (ch === '{') {
      const end = matchingBrace(message, i);
      collectArgument(message.slice(i + 1, end), found);
      i = end + 1;
      continue;
    }
    if (ch === '<') {
      const match = /^<\/?([A-Za-z][\w-]*)\s*\/?>/.exec(message.slice(i));
      if (match) {
        found.add(`<${match[1]}>`);
        i += match[0].length;
        continue;
      }
    }
    i += 1;
  }
}

/** Names of ICU arguments and rich tags used in one message, sorted and deduplicated.
 *  'Hi {name}, <b>{count, plural, one {# x} other {# xs}}</b>' -> ['<b>', 'count', 'name']. */
export function icuSignature(message: string): string[] {
  const found = new Set<string>();
  collect(message, found);
  return [...found].sort();
}
