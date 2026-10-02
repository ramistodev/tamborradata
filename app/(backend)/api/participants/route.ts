import 'server-only';
import { checkParams } from './dtos/participants.schema';
import { participantsService } from './services/participants.service';
import { handleError, res } from '../../lib/response';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const schoolKey = searchParams.get('schoolKey');

    const { cleanName, schoolKey: cleanSchoolKey } = await checkParams({ name, schoolKey });

    const participants = await participantsService(cleanName, cleanSchoolKey);

    return res.ok(participants);
  } catch (error) {
    return handleError('GET /api/participants', error);
  }
}
