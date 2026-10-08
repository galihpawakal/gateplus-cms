'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ContentStatus } from '@/lib/constants';
import { IconButton } from '@/components/ui/IconButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatDateTime, toISOString } from '@/lib/utils';

interface ContentDetailClientProps {
  content: {
    id: string;
    title: string;
    description: string;
    genre: string;
    thumbnailUrl: string | undefined;
    status: ContentStatus;
    publishedAt: Date | string | undefined;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}

export default function ContentDetailClient({ content }: ContentDetailClientProps) {
  const { title, description, genre, thumbnailUrl, status, publishedAt, updatedAt } = content;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description.slice(0, 100),
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          navigator.clipboard.writeText(window.location.href);
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link disalin ke clipboard!');
    }
  };

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <Link 
        href="/contents" 
        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar
      </Link>

      <Thumbnail src={thumbnailUrl} alt={title} className="mb-6" sizes="100vw" priority />

      <PageHeader
        title={title}
        eyebrow={<div className="flex flex-wrap items-center gap-2"><Badge variant="secondary">{genre}</Badge><StatusBadge status={status} /></div>}
        description={(
          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-gray-500">
          {publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={toISOString(publishedAt)}>{formatDateTime(publishedAt)}</time>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <time dateTime={toISOString(updatedAt)}>{formatDateTime(updatedAt)} (diperbarui)</time>
          </span>
          </div>
        )}
      />

      <div className="prose prose-lg max-w-none text-gray-700">
        <div className="whitespace-pre-wrap">{description}</div>
      </div>

      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Bagikan:</span>
            <IconButton
              aria-label="Bagikan content"
              title="Bagikan content"
              onClick={handleShare}
              icon={<Share2 className="h-4 w-4" aria-hidden="true" />}
            />
          </div>
        </div>
      </footer>
    </article>
  );
}