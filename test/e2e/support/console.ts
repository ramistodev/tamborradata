import type { Page } from '@playwright/test';

/**
 * Third-party noise tolerated in console errors. Starts EMPTY: every entry needs the user's approval and
 * a comment explaining the reason.
 */
export const CONSOLE_ALLOWLIST: RegExp[] = [];

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  const push = (text: string) => {
    if (!CONSOLE_ALLOWLIST.some((pattern) => pattern.test(text))) errors.push(text);
  };

  page.on('console', (message) => {
    if (message.type() === 'error') push(message.text());
  });
  page.on('pageerror', (error) => push(error.message));

  return errors;
}

/** Vercel analytics/speed-insights scripts only exist on Vercel: answer them with an empty script so they do not log 404s. */
export async function blockVercelScripts(page: Page): Promise<void> {
  await page.route('**/_vercel/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
}
