'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, RefreshCw, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { ContentCard } from '@/components/ContentCard';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

interface Content {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string | null;
  status: 'draft' | 'published';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Content[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
      // Public page only shows published
      params.set('status', 'published');

      const res = await fetch(`/api/contents?${params.toString()}`);
      const json: ApiResponse = await res.json();

      if (!json.success) {
        throw new Error(json.error?.message || 'Gagal memuat content');
      }

      setContents(json.data);
      setTotalPages(json.meta.totalPages);
      setTotal(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      setContents([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, genre]);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const handleRetry = () => {
    fetchContents();
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenre('');
    setPage(1);
  };

  const hasFilters = search || genre;

  if (loading && contents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Content</h1>
          <p className="text-gray-500 mt-1">Jelajahi artikel dan konten terbaru</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Content</h1>
        <p className="text-gray-500 mt-1">Jelajahi artikel dan konten terbaru</p>
      </div>

      {/* Search & Filter */}
      <Card className="mb-6">
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
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-700 mb-4" role="alert">{error}</p>
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      {contents.length === 0 && !loading && !error ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada content ditemukan</h3>
            <p className="text-gray-500 mb-4">
              {hasFilters ? 'Coba ubah pencarian atau filter Anda' : 'Belum ada content yang dipublikasikan'}
            </p>
            {hasFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Hapus Semua Filter
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contents.map((content) => (
              <ContentCard key={content.id} {...content} />
            ))}
            {loading && contents.length > 0 && (
              <SkeletonCard />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
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
        </>
      )}
    </div>
  );
}