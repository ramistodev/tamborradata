import { handleError, res } from '../../lib/response';
import { periodService } from './service/period.service';

export async function GET() {
  try {
    const publishedPeriods = await periodService();

    return res.ok(publishedPeriods);
  } catch (error) {
    return handleError('GET /api/period', error);
  }
}
