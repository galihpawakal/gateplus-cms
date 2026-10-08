'use client';

import { useCallback, useEffect, useState } from 'react';
import { ContentCard } from '@/components/ContentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Content } from '@/lib/types';
import { PUBLISHED_STATUS } from '@/lib/constants';
import { useContentFilters } from '@/lib/useContentFilters';

export default function ContentsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    search,
    setSearch,
    genre,
    setGenre,
    page,
    setPage,
    limit,
    initialized,
  } = useContentFilters({ includeStatus: false });
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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
      params.set('status', PUBLISHED_STATUS);

      const response = await fetch(`/api/contents?${params.toString()}`);
      const result = await response.json() as {
        success: boolean;
        data: Content[];
        meta: { page: number; limit: number; total: number; totalPages: number };
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
    } finally {
      setLoading(false);
    }
  }, [genre, limit, page, search, setPage]);

  useEffect(() => {
    if (initialized) fetchContents();
  }, [fetchContents, initialized]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setGenre('');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader title="Content" description="Jelajahi artikel dan konten terbaru" />
      <FilterToolbar
        search={search}
        onSearchChange={handleSearchChange}
        genre={genre}
        onGenreChange={(value) => { setGenre(value); setPage(1); }}
        genres={genres}
        onReset={handleResetFilters}
      />

      {error ? (
        <ErrorState title="Konten gagal dimuat" description={error} onRetry={fetchContents} />
      ) : loading && contents.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Memuat konten">
          {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : contents.length === 0 ? (
        <EmptyState
          title="Tidak ada content ditemukan"
          description={search || genre ? 'Coba sesuaikan atau reset filter.' : 'Belum ada content yang dipublikasikan.'}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contents.map((content) => <ContentCard key={content.id} {...content} />)}
            {loading && <SkeletonCard />}
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}