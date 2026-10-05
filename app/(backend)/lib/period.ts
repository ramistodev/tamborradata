import { ValidationError } from './errors';

const PUBLIC_SLUG_REGEX = /^[\w-]{1,64}$/;

/** Validates the shape of a public slug. Whether it exists is decided by the DB lookup (404). */
export function parsePublicSlug(publicSlug: string | null, paramName = 'publicSlug'): string {
  if (!publicSlug) {
    throw new ValidationError(`The '${paramName}' parameter is required`);
  }

  const cleanPublicSlug = publicSlug.trim();

  if (!PUBLIC_SLUG_REGEX.test(cleanPublicSlug)) {
    throw new ValidationError(`The '${paramName}' parameter is not a valid public slug`);
  }

  return cleanPublicSlug;
}
