import { NextRequest } from 'next/server';

export const ORIGIN = 'http://localhost:3000';

type Init = { method?: string; headers?: Record<string, string>; body?: BodyInit };

export function makeRequest(path: string, init: Init = {}): NextRequest {
  return new NextRequest(`${ORIGIN}${path}`, init);
}

/** POST by default, content-type application/json, body = JSON.stringify(body). */
export function jsonRequest(
  path: string,
  body: unknown,
  init: { method?: string; headers?: Record<string, string> } = {},
): NextRequest {
  return new NextRequest(`${ORIGIN}${path}`, {
    method: init.method ?? 'POST',
    headers: { 'content-type': 'application/json', ...init.headers },
    body: JSON.stringify(body),
  });
}

/** POST with an arbitrary string body (invalid JSON cases). */
export function rawRequest(
  path: string,
  rawBody: string,
  init: { method?: string; headers?: Record<string, string> } = {},
): NextRequest {
  return new NextRequest(`${ORIGIN}${path}`, {
    method: init.method ?? 'POST',
    headers: init.headers,
    body: rawBody,
  });
}

/** Second argument of the dynamic route handlers: `params` is a Promise in this Next version. */
export function routeContext<P extends Record<string, string>>(params: P): { params: Promise<P> } {
  return { params: Promise.resolve(params) };
}

export async function readJson<T = unknown>(response: Response): Promise<T> {
  return (await response.json()) as T;
}
