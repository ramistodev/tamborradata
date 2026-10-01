import 'server-only';
import { checkParams } from './dtos/statistics.schema';
import { handleError, res } from '../../lib/response';
import { statisticsService } from './services/statistics.service';
import { cacheControlFor } from '../../lib/cache';

export async function GET(req: Request) {
  try {
    const periodKey = new URL(req.url).searchParams.get('periodKey');
    const locale = new URL(req.url).searchParams.get('locale');

    const statistics = await statisticsService(checkParams(periodKey, locale));

    // Devuelve JSON limpio con las estadísticas del año
    return res.ok(statistics, cacheControlFor.preview());
  } catch (error) {
    return handleError('GET /api/statistics', error);
  }
}
