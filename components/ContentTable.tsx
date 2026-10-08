'use client';

import Image from 'next/image';
import { formatDate, getStatusBadgeClass, getStatusLabel, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MoreHorizontal, Trash2, Edit, Eye } from 'lucide-react';
import { Content } from '@/lib/types';

interface ContentTableProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (content: Content) => void;
  onView: (content: Content) => void;
  loading?: boolean;
}

export function ContentTable({ contents, onEdit, onDelete, onView, loading }: ContentTableProps) {
  if (loading && contents.length === 0) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thumbnail</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publish Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 animate-pulse">
                <td className="px-4 py-4"><div className="w-16 h-10 bg-gray-200 rounded" /></td>
                <td className="px-4 py-4"><div className="h-4 w-3/4 bg-gray-200 rounded" /></td>
                <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                <td className="px-4 py-4"><div className="h-5 w-20 bg-gray-200 rounded-full" /></td>
                <td className="px-4 py-4"><div className="h-4 w-28 bg-gray-200 rounded" /></td>
                <td className="px-4 py-4"><div className="h-8 w-24 bg-gray-200 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2zM8 7h8M8 11h8M8 15h8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada content</h3>
        <p className="text-gray-500">Mulai dengan membuat content pertama Anda</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="grid">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Thumbnail</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Genre</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">Publish Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contents.map((content) => (
            <tr key={content.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                {content.thumbnailUrl ? (
                  <Image
                    src={content.thumbnailUrl}
                    alt={content.title}
                    width={64}
                    height={40}
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="max-w-xs">
                  <p className="font-medium text-gray-900 truncate">{content.title}</p>
                  <p className="text-sm text-gray-500 truncate">{content.description.slice(0, 80)}...</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-700">{content.genre}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={content.status === 'published' ? 'success' : 'warning'} className="text-xs">
                  {getStatusLabel(content.status)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {content.publishedAt ? formatDate(content.publishedAt) : '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(content)}
                    className="h-8 w-8 p-0"
                    aria-label={`Lihat ${content.title}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(content)}
                    className="h-8 w-8 p-0"
                    aria-label={`Edit ${content.title}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(content)}
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    aria-label={`Hapus ${content.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}