import type { Locale } from '../../types/locale';
import type es from './translations/es';

export type Messages = typeof es;

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
