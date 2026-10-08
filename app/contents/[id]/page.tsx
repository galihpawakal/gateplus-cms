import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';
import ContentDetailClient from './ContentDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const content = await prisma.content.findUnique({
    where: { id },
    select: { title: true, description: true, thumbnailUrl: true, publishedAt: true },
  });

  if (!content || content.status !== 'published') {
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

  if (!content || content.status !== 'published') {
    notFound();
  }

  return <ContentDetailClient content={content} />;
}