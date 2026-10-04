import 'server-only';
import { notFound } from 'next/navigation';
import { NotFoundError, ValidationError } from '../../../(backend)/lib/errors';

/** Maps backend domain errors to Next's 404. Anything else bubbles up to the error boundary. */
export function handleServiceError(error: unknown): never {
  if (error instanceof NotFoundError || error instanceof ValidationError) notFound();
  throw error;
}
