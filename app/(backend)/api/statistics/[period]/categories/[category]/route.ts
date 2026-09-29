import 'server-only';
import { handleError, res } from '@/app/(backend)/lib/response';
import { checkCategoryDetailParams } from '@/app/(backend)/api/statistics/dtos/category.schema';
import { categoryDetailService } from '@/app/(backend)/api/statistics/services/categoryDetail.service';

interface RouteContext {
  params: Promise<{ period: string; category: string }>;
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { period, category } = await params;
    const { searchParams } = new URL(req.url);

    const categoryDetailParams = checkCategoryDetailParams({
      period,
      category,
      limit: searchParams.get('limit'),
      afterRank: searchParams.get('afterRank'),
      afterEntityKey: searchParams.get('afterEntityKey'),
    });

    const categoryDetail = await categoryDetailService(categoryDetailParams);
    return res.ok(categoryDetail);
  } catch (error) {
    return handleError('GET /api/statistics/[period]/categories/[category]', error);
  }
}
