import 'server-only';
import { handleError, res } from '@/app/(backend)/lib/response';
import { checkCategoryDetailParams } from '@/app/(backend)/api/statistics/dtos/category.schema';
import { categoryDetailService } from '@/app/(backend)/api/statistics/services/categoryDetail.service';
import { cacheControlFor } from '../../../../../lib/cache';

interface RouteContext {
  params: Promise<{ period: string; category: string }>;
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { period, category } = await params;
    const searchParams = new URL(req.url).searchParams;
    const limit = searchParams.get('limit');
    const cursor = searchParams.get('cursor');

    const cateogryParams = checkCategoryDetailParams({
      period,
      category,
      limit,
      cursor,
    });

    const categoryDetail = await categoryDetailService(cateogryParams);

    // Devuelve JSON limpio con los detalles de la categoría de estadísticas
    return res.ok(
      categoryDetail,
      cacheControlFor.category({
        hasCursor: searchParams.has('cursor'),
        hasLimit: searchParams.has('limit'),
      })
    );
  } catch (error) {
    return handleError('GET /api/statistics/[period]/categories/[category]', error);
  }
}
