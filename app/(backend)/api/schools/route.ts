import 'server-only';
import { handleError, res } from '../../lib/response';
import { checkSchoolsParams } from './dtos/schools.schema';
import { schoolsService } from './services/schools.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = checkSchoolsParams(searchParams.get('query'));

    const schools = await schoolsService(params);
    return res.ok(schools);
  } catch (error) {
    return handleError('GET /api/schools', error);
  }
}
