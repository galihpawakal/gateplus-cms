'use client';

import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';
import { FormField } from './FormField';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <FormField id={inputId} label={label} error={error} hint={helperText}>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-control border border-ui-border bg-white px-3 text-gray-900 shadow-sm placeholder:text-gray-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
          {...props}
        />
      </FormField>
    );
  }
);

Input.displayName = 'Input';