import { isDev } from '../core/config/env';
import { log } from '../core/logger';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from './errors';

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function errorMessage(message: string, productionMessage: string): string {
  return isDev ? message : productionMessage;
}

export const res = {
  ok<T>(data: T, headers: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  },
  created<T>(data: T): Response {
    return jsonResponse(data, 201);
  },
  noContent(): Response {
    return new Response(null, { status: 204 });
  },
  validationError(message: string): Response {
    return jsonResponse({ error: errorMessage(message, 'Invalid request') }, 400);
  },
  unauthorized(message = 'Unauthorized'): Response {
    return jsonResponse({ error: errorMessage(message, 'Unauthorized') }, 401);
  },
  forbidden(message = 'Forbidden'): Response {
    return jsonResponse({ error: errorMessage(message, 'Forbidden') }, 403);
  },
  notFound(message = 'Not found'): Response {
    return jsonResponse({ error: errorMessage(message, 'Not found') }, 404);
  },
  conflict(message: string): Response {
    return jsonResponse({ error: errorMessage(message, 'Conflict') }, 409);
  },
  serverError(message: string = 'Internal server error'): Response {
    return jsonResponse({ error: errorMessage(message, 'Internal server error') }, 500);
  },
};

export function handleError(tag: string, error: unknown): Response {
  if (error instanceof ValidationError) return res.validationError(error.message);
  if (error instanceof UnauthorizedError) return res.unauthorized(error.message);
  if (error instanceof ForbiddenError) return res.forbidden(error.message);
  if (error instanceof NotFoundError) return res.notFound(error.message);
  if (error instanceof ConflictError) return res.conflict(error.message);
  if (error instanceof ServerError) return res.serverError(error.message);
  const message = error instanceof Error ? error.message : String(error);

  log(`[${tag}] Unhandled error: ${message}`, 'error');
  return res.serverError();
}
