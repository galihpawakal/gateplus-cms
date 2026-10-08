'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThumbnailProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function Thumbnail({ src, alt, className, imageClassName, sizes = '100vw', priority = false }: ThumbnailProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-control bg-gray-100', className)}>
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', imageClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400" role="img" aria-label={`Thumbnail ${alt} tidak tersedia`}>
          <ImageIcon className="h-12 w-12" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}