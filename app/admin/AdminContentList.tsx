'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Funnel, Loader2, RefreshCw, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ContentTable } from '@/components/ContentTable';
import { ContentForm } from '@/components/ContentForm';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { Content, ContentCreateInput, ContentUpdateInput } from '@/app/contents/page';
import { ContentStatus } from '@/lib/validation';

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
  { value: '', label: 'Semua Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

function AdminContentListContent() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ContentStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingContent, setDeletingContent] = useState<Content | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toast } = useToast();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (genre) params.set('genre', genre);
      if (status) params.set('status', status);

      const res = await fetch(`/api/contents?${params.toString()}`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Gagal memuat content');
      }

      setContents(json.data);
      setTotalPages(json.meta.totalPages);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setContents([]);
      toast({ title: 'Error', description: 'Gagal memuat daftar content', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, genre, status, toast]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleCreateSubmit = async (data: ContentCreateInput) => {
    try {
      const res = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Gagal membuat content');
      }

      toast({ title: 'Berhasil', description: 'Content berhasil dibuat', type: 'success' });
      setCreateOpen(false);
      fetchContents();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Gagal membuat content', type: 'error' });
      throw err;
    }
  };

  const handleEditSubmit = async (data: ContentUpdateInput) => {
    if (!editingContent) return;
    try {
      const res = await fetch(`/api/contents/${editingContent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Gagal mengupdate content');
      }

      toast({ title: 'Berhasil', description: 'Content berhasil diupdate', type: 'success' });
      setEditOpen(false);
      setEditingContent(null);
      fetchContents();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Gagal mengupdate content', type: 'error' });
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingContent) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/contents/${deletingContent.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Gagal menghapus content');
      }

      toast({ title: 'Berhasil', description: 'Content berhasil dihapus', type: 'success' });
      setDeleteOpen(false);
      setDeletingContent(null);
      fetchContents();
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Gagal menghapus content', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setEditOpen(true);
  };

  const handleDelete = (content: Content) => {
    setDeletingContent(content);
    setDeleteOpen(true);
  };

  const handleView = (content: Content) => {
    window.open(`/contents/${content.id}`, '_blank');
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenre('');
    setStatus('');
    setPage(1);
  };

  const hasFilters = search || genre || status;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 mt-1">Kelola semua content (draft & published)</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Content
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau deskripsi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <Select
              value={genre}
              onChange={(e) => { setGenre(e.target.value); setPage(1); }}
              options={[{ value: '', label: 'Semua Genre' }, ...GENRES.map(g => ({ value: g, label: g }))]}
              placeholder="Filter Genre"
              className="w-full sm:w-48"
            />
            <Select
              value={status}
              onChange={(e) => { setStatus(e.target.value as ContentStatus | ''); setPage(1); }}
              options={STATUS_OPTIONS}
              placeholder="Filter Status"
              className="w-full sm:w-40"
            />
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="h-10">
                <X className="w-4 h-4 mr-1" />
                Hapus Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-700 mb-4" role="alert">{error}</p>
            <Button variant="outline" onClick={fetchContents}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Daftar Content ({total})</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Halaman {page} dari {totalPages}</span>
          </div>
        </CardHeader>
        <CardContent>
          <ContentTable
            contents={contents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-600 px-4">
            Halaman {page} dari {totalPages} ({total} total)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Selanjutnya
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Buat Content Baru"
        description="Isi form di bawah untuk membuat content baru"
      >
        <ContentForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setCreateOpen(false)}
          isEditing={false}
        />
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editOpen}
        onOpenChange={() => { setEditOpen(false); setEditingContent(null); }}
        title="Edit Content"
        description="Perbarui informasi content"
      >
        {editingContent && (
          <ContentForm
            initialData={editingContent}
            onSubmit={handleEditSubmit}
            onCancel={() => { setEditOpen(false); setEditingContent(null); }}
            isEditing={true}
          />
        )}
      </Dialog>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={() => { setDeleteOpen(false); setDeletingContent(null); }}
        title="Hapus Content"
        description={deletingContent 
          ? `Apakah Anda yakin ingin menghapus "${deletingContent.title}"? Tindakan ini tidak dapat dibatalkan.`
          : 'Apakah Anda yakin ingin menghapus content ini? Tindakan ini tidak dapat dibatalkan.'
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Hapus"
        cancelText="Batal"
        variant="destructive"
        loading={deleteLoading}
      />
    </div>
  );
}

export default function AdminContentList() {
  return <AdminContentListContent />;
}