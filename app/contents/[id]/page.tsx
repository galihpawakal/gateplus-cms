import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';
import { PUBLISHED_STATUS } from '@/lib/constants';
import ContentDetailClient from './ContentDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = await prisma.content.findUnique({
    where: { id },
    select: { title: true, description: true, thumbnailUrl: true, publishedAt: true, status: true },
  });

  if (!content || content.status !== PUBLISHED_STATUS) {
    return { title: 'Content Tidak Ditemukan' };
  }

  return {
    title: content.title,
    description: content.description.slice(0, 160),
    openGraph: {
      title: content.title,
      description: content.description.slice(0, 160),
      images: content.thumbnailUrl ? [content.thumbnailUrl] : [],
      type: 'article',
      publishedTime: content.publishedAt?.toISOString(),
    },
  };
}

export default async function ContentDetailPage({ params }: Props) {
  const { id } = await params;
  const content = await prisma.content.findUnique({
    where: { id },
  });

  if (!content || content.status !== PUBLISHED_STATUS) {
    notFound();
  }

  // Convert null to undefined for client component
  const clientContent = {
    ...content,
    thumbnailUrl: content.thumbnailUrl ?? undefined,
    publishedAt: content.publishedAt ?? undefined,
  };

  return <ContentDetailClient content={clientContent} />;
}