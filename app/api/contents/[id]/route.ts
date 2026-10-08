import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { contentUpdateSchema } from '@/lib/validation';
import { successResponse, noContentResponse, notFoundResponse, handleApiError } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      return notFoundResponse('Content');
    }

    return successResponse(content);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = contentUpdateSchema.parse(body);

    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('Content');
    }

    const content = await prisma.content.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        genre: validated.genre,
        thumbnailUrl: validated.thumbnailUrl || null,
        status: validated.status,
        publishedAt: validated.publishedAt ? new Date(validated.publishedAt) : null,
      },
    });

    return successResponse(content);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('Content');
    }

    await prisma.content.delete({ where: { id } });
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}