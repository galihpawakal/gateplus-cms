'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContentForm, ContentFormValues } from '@/components/ContentForm';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { Content } from '@/lib/types';

interface ContentEditorProps {
  contentId?: string;
}

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]> | string[];
  };
}

function toDateTimeLocal(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function ContentEditor({ contentId }: ContentEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState<Content | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadFormData() {
      setLoading(true);
      setLoadError(null);
      try {
        const [genresResponse, contentResponse] = await Promise.all([
          fetch('/api/genres'),
          contentId ? fetch(`/api/contents/${contentId}`) : Promise.resolve(null),
        ]);
        const genresResult = await genresResponse.json() as ApiResult<string[]>;
        if (!genresResponse.ok || !genresResult.success || !genresResult.data) {
          throw new Error(genresResult.error?.message || 'Gagal memuat genre');
        }

        let loadedContent: Content | null = null;
        if (contentResponse) {
          const contentResult = await contentResponse.json() as ApiResult<Content>;
          if (!contentResponse.ok || !contentResult.success || !contentResult.data) {
            throw new Error(contentResult.error?.message || 'Gagal memuat content');
          }
          loadedContent = contentResult.data;
        }

        if (!cancelled) {
          setGenres(genresResult.data);
          setContent(loadedContent);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Gagal memuat form');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFormData();
    return () => { cancelled = true; };
  }, [contentId]);

  const handleSubmit = async (values: ContentFormValues) => {
    setSaving(true);
    setFieldErrors({});
    try {
      const response = await fetch(contentId ? `/api/contents/${contentId}` : '/api/contents', {
        method: contentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          thumbnailUrl: values.thumbnailUrl || '',
          publishedAt: values.publishedAt || null,
        }),
      });
      const result = await response.json() as ApiResult<Content>;

      if (!response.ok || !result.success) {
        const details = result.error?.details;
        if (details && !Array.isArray(details)) {
          setFieldErrors(Object.fromEntries(
            Object.entries(details).map(([field, messages]) => [field, messages[0]])
          ));
        }
        throw new Error(result.error?.message || 'Gagal menyimpan content');
      }

      toast({
        title: 'Berhasil',
        description: contentId ? 'Content berhasil diperbarui' : 'Content berhasil dibuat',
        type: 'success',
      });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Gagal',
        description: error instanceof Error ? error.message : 'Gagal menyimpan content',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6" role="status" aria-label="Memuat form content">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }
  if (loadError) {
    return <ErrorState title="Form content gagal dimuat" description={loadError} onRetry={() => window.location.reload()} />;
  }

  const initialData = content ? {
    ...content,
    thumbnailUrl: content.thumbnailUrl || undefined,
    publishedAt: toDateTimeLocal(content.publishedAt),
  } : undefined;

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title={contentId ? 'Edit Content' : 'Tambah Content'}
        description={contentId ? 'Perbarui informasi content.' : 'Isi informasi content baru.'}
      />
      <ContentForm
        initialData={initialData}
        genres={genres}
        serverErrors={fieldErrors}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin')}
        isEditing={Boolean(contentId)}
        loading={saving}
      />
    </div>
  );
}