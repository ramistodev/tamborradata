import 'server-only';
import { checkParams } from './dtos/participants.schema';
import { participantsService } from './services/participants.service';
import { RateLimitError, ValidationError } from '../../lib/errors';
import { handleError, res } from '../../lib/response';
import { checkRateLimit } from '../../lib/ratelimit/rateLimiter';

/** A fixed message on purpose: the parser's own error quotes part of the body, which holds a name. */
async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ValidationError('The request body must be valid JSON');
  }
}

/** Handles POST requests to `/api/participants`. */
export async function POST(req: Request) {
  try {
    const rateLimitResult = checkRateLimit(req.headers);

    if (!rateLimitResult.allow) {
      throw new RateLimitError(rateLimitResult.retryAfterSeconds);
    }

    const { tokens, schoolKey: cleanSchoolKey } = checkParams(await readJsonBody(req));

    const participants = await participantsService(tokens, cleanSchoolKey);

    return res.ok(participants);
  } catch (error) {
    return handleError('POST /api/participants', error);
  }
}
