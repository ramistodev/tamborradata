import { log } from 'console';

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 5,
  timeout = 10000
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);

      return res;
    } catch (err) {
      clearTimeout(id);

      if (attempt === retries) throw err;

      const wait = 500 * 2 ** (attempt - 1);
      log(`Fetch attempt ${attempt} failed for ${url}. Retrying in ${wait}ms...`, 'warn');
      await new Promise((r) => setTimeout(r, wait));
    }
  }

  throw new Error(`Max retries reached for ${url}, something went wrong.`);
}
