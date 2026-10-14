/** Host of a source URL without the "www." prefix, e.g. "donostia.eus". */
export function getSourceHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
