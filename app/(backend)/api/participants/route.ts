import 'server-only';
import { checkParams } from './dtos/participants.schema';
import { participantsService } from './services/participants.service';
import { handleError, res } from '../../lib/response';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const participant = searchParams.get('participant');
    const schoolKey = searchParams.get('schoolKey');

    const { tokens, schoolKey: cleanSchoolKey } = checkParams({ participant, schoolKey });

    const participants = await participantsService(tokens, cleanSchoolKey);

    return res.ok(participants);
  } catch (error) {
    return handleError('GET /api/participants', error);
  }
}
