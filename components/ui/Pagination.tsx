'use client';

import { Button } from './Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}>
        Sebelumnya
      </Button>
      <p className="px-2 text-center text-sm text-gray-600" aria-live="polite">
        Halaman {page} dari {totalPages} ({total} total)
      </p>
      <Button variant="secondary" size="sm" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        Berikutnya
      </Button>
    </nav>
  );
}