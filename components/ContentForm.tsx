'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { contentCreateSchema, contentUpdateSchema, ContentStatus } from '@/lib/validation';

type FormData = {
  title: string;
  description: string;
  genre: string;
  status: ContentStatus;
  thumbnailUrl: string | undefined;
  publishedAt: string | undefined;
};

interface ContentFormProps {
  initialData?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

const GENRES = [
  'Bisnis',
  'Keuangan',
  'Kuliner',
  'Lifestyle',
  'Teknologi',
  'Travel',
  'Hobi',
  'Kesehatan',
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export function ContentForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isEditing = false, 
  loading = false 
}: ContentFormProps) {
  const schema = isEditing ? contentUpdateSchema : contentCreateSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      status: 'draft' as ContentStatus,
      thumbnailUrl: undefined,
      publishedAt: undefined,
      ...initialData,
    },
    mode: 'onChange',
  });

  const status = watch('status');
  const showPublishedAt = status === 'published';

  // Set publishedAt to now when status changes to published
  useEffect(() => {
    if (status === 'published' && !watch('publishedAt')) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setValue('publishedAt', now.toISOString().slice(0, 16));
    }
  }, [status, watch, setValue]);

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Content' : 'Buat Content Baru'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            label="Judul *"
            placeholder="Masukkan judul content"
            error={errors.title?.message}
            {...register('title')}
            maxLength={200}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi *
            </label>
            <textarea
              {...register('description')}
              rows={6}
              className={`
                w-full px-3 py-2 border rounded-lg shadow-sm placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
              `}
              placeholder="Masukkan deskripsi content"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Genre *"
              placeholder="Pilih genre"
              options={[{ value: '', label: 'Pilih genre' }, ...GENRES.map(g => ({ value: g, label: g }))]}
              error={errors.genre?.message}
              {...register('genre')}
            />

            <Select
              label="Status *"
              placeholder="Pilih status"
              options={STATUS_OPTIONS}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>

          <Input
            label="Thumbnail URL"
            placeholder="https://example.com/image.jpg"
            type="url"
            error={errors.thumbnailUrl?.message}
            {...register('thumbnailUrl')}
          />

          {showPublishedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Tanggal Publish *
                <Calendar className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="datetime-local"
                {...register('publishedAt')}
                className={`
                  w-full px-3 py-2 border rounded-lg shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                  ${errors.publishedAt ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                `}
              />
              {errors.publishedAt && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.publishedAt.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Wajib diisi jika status Published</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || loading}>
          Batal
        </Button>
        <Button type="submit" loading={isSubmitting || loading}>
          {isEditing ? 'Simpan Perubahan' : 'Buat Content'}
        </Button>
      </div>
    </form>
  );
}