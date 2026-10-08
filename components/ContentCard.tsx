'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate, truncate, getStatusBadgeClass, getStatusLabel } from '@/lib/utils';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  isSkeleton?: boolean;
}

export function ContentCard({ 
  id, 
  title, 
  description, 
  genre, 
  thumbnailUrl, 
  status, 
  publishedAt, 
  isSkeleton = false 
}: ContentCardProps) {
  if (isSkeleton) {
    return <SkeletonCard />;
  }

  return (
    <article>
      <Link href={`/contents/${id}`} className="block group">
        <Card className="h-full transition-shadow hover:shadow-md overflow-hidden">
          <div className="relative aspect-video bg-gray-100 overflow-hidden">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge 
                variant={status === 'published' ? 'success' : 'warning'} 
                className="text-xs"
              >
                {getStatusLabel(status)}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="font-medium text-gray-700">{genre}</span>
              <span>•</span>
              <time dateTime={publishedAt || ''}>{formatDate(publishedAt)}</time>
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {truncate(description, 150)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </article>
  );
}