'use client';

import { ContentStatus } from '@/lib/constants';
import { ALL_STATUS_OPTION, CONTENT_STATUS_OPTIONS } from '@/lib/constants';
import { Button } from './Button';
import { SearchInput } from './SearchInput';
import { Select } from './Select';

interface FilterToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  genres: string[];
  status?: ContentStatus | '';
  onStatusChange?: (value: ContentStatus | '') => void;
  showStatus?: boolean;
  onReset: () => void;
}

export function FilterToolbar({
  search,
  onSearchChange,
  genre,
  onGenreChange,
  genres,
  status = '',
  onStatusChange,
  showStatus = false,
  onReset,
}: FilterToolbarProps) {
  const hasActiveFilters = Boolean(search || genre || (showStatus && status));
  const genreOptions = [
    { value: '', label: 'Semua genre' },
    ...genres.map((item) => ({ value: item, label: item })),
  ];
  const statusOptions = [ALL_STATUS_OPTION, ...CONTENT_STATUS_OPTIONS];

  return (
    <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-12">
      <SearchInput
        label="Cari judul"
        value={search}
        onChange={onSearchChange}
        className="sm:col-span-2 lg:col-span-6"
      />
      <Select
        label="Filter genre"
        value={genre}
        onChange={(event) => onGenreChange(event.target.value)}
        options={genreOptions}
        containerClassName={showStatus ? 'sm:col-span-1 lg:col-span-3' : 'sm:col-span-2 lg:col-span-3'}
      />
      {showStatus && (
        <Select
          label="Filter status"
          value={status}
          onChange={(event) => onStatusChange?.(event.target.value as ContentStatus | '')}
          options={statusOptions}
          containerClassName="sm:col-span-1 lg:col-span-3"
        />
      )}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          className="sm:col-span-2 sm:justify-self-end lg:col-span-12"
        >
          Reset filter
        </Button>
      )}
    </div>
  );
}