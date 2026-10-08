'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CONTENT_STATUS_OPTIONS, ContentStatus, DRAFT_STATUS, PUBLISHED_STATUS } from '@/lib/constants';
import { contentCreateSchema, contentUpdateSchema } from '@/lib/validation';

export type ContentFormValues = {
  title: string;
  description: string;
  genre: string;
  status: ContentStatus;
  thumbnailUrl: string | undefined;
  publishedAt: string | undefined;
};

interface ContentFormProps {
  initialData?: Partial<ContentFormValues>;
  genres: string[];
  serverErrors?: Record<string, string>;
  onSubmit: (data: ContentFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  loading?: boolean;
}

export function ContentForm({ 
  initialData, 
  genres,
  serverErrors = {},
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
  } = useForm<ContentFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      status: DRAFT_STATUS,
      thumbnailUrl: undefined,
      publishedAt: undefined,
      ...initialData,
    },
    mode: 'onChange',
  });

  const status = watch('status');
  const showPublishedAt = status === PUBLISHED_STATUS;

  // Set publishedAt to now when status changes to published
  useEffect(() => {
    if (status === PUBLISHED_STATUS && !watch('publishedAt')) {
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
            error={serverErrors.title || errors.title?.message}
            {...register('title')}
            maxLength={200}
          />

          <FormField
            id="content-description"
            label="Deskripsi *"
            error={serverErrors.description || errors.description?.message}
          >
            <textarea
              id="content-description"
              {...register('description')}
              rows={6}
              className="min-h-36 w-full rounded-control border border-ui-border px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              aria-invalid={Boolean(serverErrors.description || errors.description)}
              aria-describedby={serverErrors.description || errors.description ? 'content-description-error' : undefined}
              placeholder="Masukkan deskripsi content"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Genre *"
              placeholder="Pilih genre"
              options={genres.map((genre) => ({ value: genre, label: genre }))}
              error={serverErrors.genre || errors.genre?.message}
              {...register('genre')}
            />

            <Select
              label="Status *"
              placeholder="Pilih status"
              options={CONTENT_STATUS_OPTIONS}
              error={serverErrors.status || errors.status?.message}
              {...register('status')}
            />
          </div>

          <Input
            label="Thumbnail URL"
            placeholder="https://example.com/image.jpg"
            type="url"
            error={serverErrors.thumbnailUrl || errors.thumbnailUrl?.message}
            {...register('thumbnailUrl')}
          />

          {showPublishedAt && (
            <FormField
              id="published-at"
              label="Tanggal Publish *"
              error={serverErrors.publishedAt || errors.publishedAt?.message}
              hint="Wajib diisi jika status Published"
            >
              <input
                id="published-at"
                type="datetime-local"
                {...register('publishedAt')}
                className="h-10 w-full rounded-control border border-ui-border px-3 text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                aria-invalid={Boolean(serverErrors.publishedAt || errors.publishedAt)}
                aria-describedby={serverErrors.publishedAt || errors.publishedAt ? 'published-at-error' : 'published-at-hint'}
              />
            </FormField>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting || loading}>
          Batal
        </Button>
        <Button type="submit" loading={isSubmitting || loading}>
          Simpan
        </Button>
      </div>
    </form>
  );
}