'use client';

import { useEffect, useState } from 'react';
import { CONTENT_STATUSES, ContentStatus } from '@/lib/constants';

interface ContentFilterOptions {
  includeStatus: boolean;
}

export function useContentFilters({ includeStatus }: ContentFilterOptions) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ContentStatus | ''>('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get('search') || '';
    const initialStatus = params.get('status');
    const initialPage = Number(params.get('page'));
    const initialLimit = Number(params.get('limit'));

    setSearch(initialSearch);
    setGenre(params.get('genre') || '');
    setStatus(includeStatus
      ? CONTENT_STATUSES.find((candidate) => candidate === initialStatus) || ''
      : '');
    setPage(Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1);
    setLimit(Number.isInteger(initialLimit) && initialLimit > 0 && initialLimit <= 100 ? initialLimit : 10);
    setInitialized(true);
  }, [includeStatus]);

  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    if (includeStatus && status) params.set('status', status);
    params.set('page', String(page));
    params.set('limit', String(limit));
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [search, genre, includeStatus, initialized, limit, page, status]);

  return {
    search,
    setSearch,
    genre,
    setGenre,
    status,
    setStatus,
    page,
    setPage,
    limit,
    setLimit,
    initialized,
  };
}