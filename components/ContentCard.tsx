'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ContentStatus } from '@/lib/constants';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatDate, truncate } from '@/lib/utils';

interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string | undefined;
  status: ContentStatus;
  publishedAt: string | undefined;
}

export function ContentCard({ id, title, description, genre, thumbnailUrl, status, publishedAt }: ContentCardProps) {
  return (
    <article>
      <Link href={`/contents/${id}`} className="block group">
        <Card className="h-full transition-shadow hover:shadow-md overflow-hidden">
          <div className="relative">
            <Thumbnail
              src={thumbnailUrl}
              alt={title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              imageClassName="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute right-3 top-3">
              <StatusBadge status={status} />
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