'use client';

import { useEffect, useId, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormField } from './FormField';
import { IconButton } from './IconButton';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  label,
  placeholder = 'Cari judul...',
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const generatedId = useId();
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (inputValue === value) return;
    const timer = window.setTimeout(() => onChange(inputValue), debounceMs);
    return () => window.clearTimeout(timer);
  }, [debounceMs, inputValue, onChange, value]);

  const clearSearch = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <FormField id={generatedId} label={label} className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          id={generatedId}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-control border border-ui-border bg-white py-0 pl-10 pr-12 text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
          aria-label={label}
        />
        {inputValue && (
          <IconButton
            type="button"
            aria-label={`Hapus ${label.toLowerCase()}`}
            title={`Hapus ${label.toLowerCase()}`}
            icon={<X className="h-4 w-4" aria-hidden="true" />}
            onClick={clearSearch}
            className="absolute right-0 top-0"
          />
        )}
      </div>
    </FormField>
  );
}