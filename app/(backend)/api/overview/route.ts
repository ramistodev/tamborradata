import 'server-only';
import { handleError, res } from '../../lib/response';
import { overviewScope, OverviewScope } from '../../../types/api/overview.types';
import { checkParams } from './dtos/overview.schema';
import { overviewService } from './service/overview.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let scope = searchParams.get('scope') as OverviewScope | null;

    scope = checkParams(scope);

    const response = await overviewService(scope);

    return res.ok(response);
  } catch (error) {
    return handleError('GET /api/overview', error);
  }
}
