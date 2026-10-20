import { createFormatter, createTranslator } from 'next-intl';
import { messagesByLocale, type TestLocale } from './messages';
import { singleton } from './singleton';

const TIME_ZONE = 'Europe/Madrid';

export const serverIntl = singleton('serverIntl', () => ({ locale: 'es' as TestLocale }));

export function setServerLocale(locale: TestLocale): void {
  serverIntl.locale = locale;
}

function rethrow(error: unknown): never {
  throw error;
}

function buildTranslator(locale: TestLocale, namespace?: string): any {
  return createTranslator({
    locale,
    messages: messagesByLocale[locale],
    namespace,
    timeZone: TIME_ZONE,
    onError: rethrow,
    getMessageFallback: ({ error }: { error: unknown }) => rethrow(error),
  } as never);
}

export function nextIntlServerModule() {
  return {
    getLocale: async (): Promise<string> => serverIntl.locale,
    getTranslations: async (arg?: string | { locale?: string; namespace?: string }): Promise<any> => {
      const namespace = typeof arg === 'string' ? arg : arg?.namespace;
      const locale = ((typeof arg === 'object' && arg?.locale) || serverIntl.locale) as TestLocale;
      return buildTranslator(locale, namespace);
    },
    getFormatter: async (options?: { locale?: string }): Promise<any> =>
      createFormatter({
        locale: options?.locale ?? serverIntl.locale,
        timeZone: TIME_ZONE,
        onError: rethrow,
      } as never),
    getMessages: async (options?: { locale?: string }): Promise<unknown> =>
      messagesByLocale[(options?.locale ?? serverIntl.locale) as TestLocale],
    getTimeZone: async (): Promise<string> => TIME_ZONE,
    getNow: async (): Promise<Date> => new Date(),
    setRequestLocale: (): void => {},
  };
}
