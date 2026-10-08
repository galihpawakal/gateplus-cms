import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { contentQuerySchema, contentCreateSchema } from '@/lib/validation';
import { successResponse, createdResponse, handleApiError } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = contentQuerySchema.parse({
      search: searchParams.get('search') || undefined,
      genre: searchParams.get('genre') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    const { search, genre, status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (genre) {
      where.genre = { equals: genre, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          genre: true,
          thumbnailUrl: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return successResponse(contents, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contentCreateSchema.parse(body);

    const content = await prisma.content.create({
      data: {
        title: validated.title,
        description: validated.description,
        genre: validated.genre,
        thumbnailUrl: validated.thumbnailUrl || null,
        status: validated.status,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
      },
    });

    return createdResponse(content);
  } catch (error) {
    return handleApiError(error);
  }
}