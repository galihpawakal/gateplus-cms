'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Clock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, getStatusLabel } from '@/lib/utils';

interface ContentDetailClientProps {
  content: {
    id: string;
    title: string;
    description: string;
    genre: string;
    thumbnailUrl: string | null;
    status: 'draft' | 'published';
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export default function ContentDetailClient({ content }: ContentDetailClientProps) {
  const { title, description, genre, thumbnailUrl, status, publishedAt, createdAt, updatedAt } = content;

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

      {thumbnailUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{genre}</Badge>
          <Badge variant={status === 'published' ? 'success' : 'warning'}>
            {getStatusLabel(status)}
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <time dateTime={updatedAt}>{formatDateTime(updatedAt)} (diperbarui)</time>
          </span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none text-gray-700">
        <div className="whitespace-pre-wrap">{description}</div>
      </div>

      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Bagikan:</span>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </footer>
    </article>
  );
}