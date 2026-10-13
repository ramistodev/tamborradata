/** Whether `needle` appears in `haystack` in the same order, allowing gaps. */
export function isSubsequence(needle: string[], haystack: string[]): boolean {
  let next = 0;

  for (const word of haystack) {
    if (word === needle[next]) next++;
  }

  return next === needle.length;
}
