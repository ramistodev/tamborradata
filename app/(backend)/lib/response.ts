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
    headers: { 'Content-Type': 'application/json' },
  });
}

export const res = {
  ok<T>(data: T): Response {
    return jsonResponse(data, 200);
  },
  created<T>(data: T): Response {
    return jsonResponse(data, 201);
  },
  noContent(): Response {
    return new Response(null, { status: 204 });
  },
  validationError(message: string): Response {
    return jsonResponse({ error: message }, 400);
  },
  unauthorized(message = 'Unauthorized'): Response {
    return jsonResponse({ error: message }, 401);
  },
  forbidden(message = 'Forbidden'): Response {
    return jsonResponse({ error: message }, 403);
  },
  notFound(message = 'Not found'): Response {
    return jsonResponse({ error: message }, 404);
  },
  conflict(message: string): Response {
    return jsonResponse({ error: message }, 409);
  },
  serverError(message: string = 'Internal server error'): Response {
    message = isDev ? message : 'Internal server error';
    return jsonResponse({ error: message }, 500);
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
