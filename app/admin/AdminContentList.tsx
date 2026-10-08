'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { ContentTable } from '@/components/ContentTable';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { useToast } from '@/components/ui/Toast';
import { ContentStatus } from '@/lib/constants';
import { Content } from '@/lib/types';
import { useContentFilters } from '@/lib/useContentFilters';

function AdminContentListContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    search,
    setSearch,
    genre,
    setGenre,
    status,
    setStatus,
    page,
    setPage,
    limit,
    initialized,
  } = useContentFilters({ includeStatus: true });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/genres')
      .then((response) => response.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) setGenres(result.data);
      })
      .catch(() => setGenres([]));
  }, []);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      if (genre) params.set('genre', genre);
      if (status) params.set('status', status);

      const response = await fetch(`/api/contents?${params.toString()}`);
      const result = await response.json() as {
        success: boolean;
        data: Content[];
        meta: { total: number; totalPages: number };
        error?: { message: string };
      };
      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Gagal memuat content');
      }
      if (page > Math.max(1, result.meta.totalPages)) {
        setPage(Math.max(1, result.meta.totalPages));
        return;
      }
      setContents(result.data);
      setTotalPages(result.meta.totalPages);
      setTotal(result.meta.total);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Terjadi kesalahan');
      setContents([]);
      toast({ title: 'Error', description: 'Gagal memuat daftar content', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [genre, limit, page, search, setPage, status, toast]);

  useEffect(() => {
    if (initialized) fetchContents();
  }, [fetchContents, initialized]);

  const handleDeleteConfirm = async () => {
    if (!deletingContent) return;
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/contents/${deletingContent.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error?.message || 'Gagal menghapus content');
      }

      toast({ title: 'Berhasil', description: 'Content berhasil dihapus', type: 'success' });
      setDeleteOpen(false);
      setDeletingContent(null);
      await fetchContents();
    } catch (deleteError) {
      toast({ title: 'Error', description: deleteError instanceof Error ? deleteError.message : 'Gagal menghapus content', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setGenre('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Kelola semua content (draft & published)"
        actions={<Button onClick={() => router.push('/admin/create')}><Plus className="mr-2 h-4 w-4" />Tambah Content</Button>}
      />
      <FilterToolbar
        search={search}
        onSearchChange={handleSearchChange}
        genre={genre}
        onGenreChange={(value) => { setGenre(value); setPage(1); }}
        genres={genres}
        status={status}
        onStatusChange={(value: ContentStatus | '') => { setStatus(value); setPage(1); }}
        showStatus
        onReset={handleResetFilters}
      />

      {error && <ErrorState title="Daftar content gagal dimuat" description={error} onRetry={fetchContents} />}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Content ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentTable
            contents={contents}
            onDelete={(content) => { setDeletingContent(content); setDeleteOpen(true); }}
            onView={(content) => window.open(`/contents/${content.id}`, '_blank')}
            loading={loading}
          />
        </CardContent>
      </Card>

      <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Hapus Content"
        description={deletingContent
          ? `Apakah Anda yakin ingin menghapus "${deletingContent.title}"? Tindakan ini tidak dapat dibatalkan.`
          : 'Apakah Anda yakin ingin menghapus content ini? Tindakan ini tidak dapat dibatalkan.'}
        onConfirm={handleDeleteConfirm}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}

export default function AdminContentList() {
  return <AdminContentListContent />;
}