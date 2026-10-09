/**
 * TEMP: turns a camelCase or snake_case key into a readable label ("topNames" -> "Top names").
 * Replace it with translated titles once the category catalogue exists in the i18n messages.
 */
export function humanize(key: string): string {
  const words = key
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toLowerCase();

  return words.charAt(0).toUpperCase() + words.slice(1);
}
