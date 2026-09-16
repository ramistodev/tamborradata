import 'server-only';
import { handleError, res } from '@/app/(backend)/lib/response';
import { checkSummariesParams } from '@/app/(backend)/api/statistics/dtos/summaries.schema';
import { summariesService } from '@/app/(backend)/api/statistics/services/summaries.service';

interface RouteContext {
  params: Promise<{ period: string }>;
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { period } = await params;
    const locale = new URL(req.url).searchParams.get('locale');

    const summariesParams = checkSummariesParams(period, locale);
    const summaries = await summariesService(summariesParams);
    return res.ok(summaries);
  } catch (error) {
    return handleError('GET /api/statistics/[period]/summaries', error);
  }
}
