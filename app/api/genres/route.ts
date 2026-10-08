import { prisma } from '@/lib/db';
import { handleApiError, successResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const genres = await prisma.content.findMany({
      where: { genre: { not: '' } },
      select: { genre: true },
      distinct: ['genre'],
      orderBy: { genre: 'asc' },
    });

    return successResponse(genres.map(({ genre }) => genre));
  } catch (error) {
    return handleApiError(error);
  }
}