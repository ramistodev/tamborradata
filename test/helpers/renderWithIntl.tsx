import type { ComponentType, ReactElement, ReactNode } from 'react';
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { messagesByLocale, type Messages, type TestLocale } from './messages';

export interface IntlOptions {
  locale?: TestLocale; // default 'es'
  messages?: Messages; // default messagesByLocale[locale]
  timeZone?: string; // default 'Europe/Madrid'
  now?: Date;
  queryClient?: QueryClient; // when set, also wraps in QueryClientProvider (outermost)
}

function rethrow(error: unknown): never {
  throw error;
}

export function IntlProviders({
  locale = 'es',
  messages,
  timeZone = 'Europe/Madrid',
  now,
  queryClient,
  children,
}: IntlOptions & { children: ReactNode }) {
  const tree = (
    <NextIntlClientProvider
      locale={locale}
      messages={(messages ?? messagesByLocale[locale]) as never}
      timeZone={timeZone}
      now={now}
      onError={rethrow}
      getMessageFallback={({ error }) => rethrow(error)}
    >
      {children}
    </NextIntlClientProvider>
  );

  return queryClient ? <QueryClientProvider client={queryClient}>{tree}</QueryClientProvider> : tree;
}

export function createIntlWrapper(options: IntlOptions = {}): ComponentType<{ children: ReactNode }> {
  function IntlWrapper({ children }: { children: ReactNode }) {
    return <IntlProviders {...options}>{children}</IntlProviders>;
  }
  return IntlWrapper;
}

/** `user` is `userEvent.setup()`. With fake timers use `setupUser({ advanceTimers: vi.advanceTimersByTime })` instead. */
export function renderWithIntl(
  ui: ReactElement,
  options: IntlOptions & Omit<RenderOptions, 'wrapper'> = {},
): RenderResult & { user: UserEvent } {
  const { locale, messages, timeZone, now, queryClient, ...renderOptions } = options;
  const wrapper = createIntlWrapper({ locale, messages, timeZone, now, queryClient });
  return { ...render(ui, { ...renderOptions, wrapper }), user: userEvent.setup() };
}

export function renderHookWithIntl<Result, Props>(
  hook: (props: Props) => Result,
  options: IntlOptions & Omit<RenderHookOptions<Props>, 'wrapper'> = {},
): RenderHookResult<Result, Props> {
  const { locale, messages, timeZone, now, queryClient, ...hookOptions } = options;
  const wrapper = createIntlWrapper({ locale, messages, timeZone, now, queryClient });
  return renderHook(hook, { ...hookOptions, wrapper });
}

export function setupUser(options?: Parameters<typeof userEvent.setup>[0]): UserEvent {
  return userEvent.setup(options);
}
