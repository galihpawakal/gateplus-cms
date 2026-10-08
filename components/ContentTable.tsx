'use client';

import { Eye, Edit, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { IconLink } from '@/components/ui/IconLink';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Thumbnail } from '@/components/ui/Thumbnail';
import { formatDate, truncate } from '@/lib/utils';
import { Content } from '@/lib/types';

interface ContentTableProps {
  contents: Content[];
  onDelete: (content: Content) => void;
  onView: (content: Content) => void;
  loading?: boolean;
}

export function ContentTable({ contents, onDelete, onView, loading }: ContentTableProps) {
  if (loading && contents.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Thumbnail</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Judul</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Genre</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Publish Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="animate-pulse border-b border-gray-100">
                <td className="px-4 py-4"><Skeleton className="aspect-video w-20 rounded" /></td>
                <td className="px-4 py-4"><Skeleton className="h-4 w-3/4 rounded" /></td>
                <td className="px-4 py-4"><Skeleton className="h-4 w-24 rounded" /></td>
                <td className="px-4 py-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                <td className="px-4 py-4"><Skeleton className="h-4 w-28 rounded" /></td>
                <td className="px-4 py-4"><Skeleton className="ml-auto h-10 w-32 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (contents.length === 0) {
    return <EmptyState title="Belum ada content" description="Mulai dengan membuat content pertama Anda." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Thumbnail</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Judul</th>
            <th className="w-32 px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Genre</th>
            <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
            <th className="w-36 px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Publish Date</th>
            <th className="w-44 px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contents.map((content) => (
            <tr key={content.id} className="transition-colors hover:bg-gray-50">
              <td className="px-4 py-3">
                <Thumbnail src={content.thumbnailUrl} alt={content.title} className="w-20 rounded" sizes="80px" />
              </td>
              <td className="px-4 py-3">
                <div className="max-w-xs">
                  <p className="truncate font-medium text-gray-900">{content.title}</p>
                  <p className="truncate text-sm text-gray-500">{truncate(content.description, 80)}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{content.genre}</td>
              <td className="px-4 py-3">
                <StatusBadge status={content.status} className="text-xs" />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {content.publishedAt ? formatDate(content.publishedAt) : '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <IconButton
                    onClick={() => onView(content)}
                    aria-label={`Lihat ${content.title}`}
                    title={`Lihat ${content.title}`}
                    icon={<Eye className="h-4 w-4" aria-hidden="true" />}
                  />
                  <IconLink
                    href={`/admin/edit/${content.id}`}
                    aria-label={`Edit ${content.title}`}
                    className="hover:bg-gray-100"
                    icon={<Edit className="h-4 w-4" aria-hidden="true" />}
                  />
                  <IconButton
                    onClick={() => onDelete(content)}
                    aria-label={`Hapus ${content.title}`}
                    title={`Hapus ${content.title}`}
                    className="text-red-600 hover:bg-red-50"
                    icon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}