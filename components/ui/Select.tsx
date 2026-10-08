'use client';

import { forwardRef, SelectHTMLAttributes, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <FormField id={selectId} label={label} error={error} hint={helperText} className={containerClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-10 w-full appearance-none rounded-control border border-ui-border bg-white px-3 pr-10 text-gray-900 shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-hint` : undefined}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        </div>
      </FormField>
    );
  }
);

Select.displayName = 'Select';