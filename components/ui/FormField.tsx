import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id?: string;
  label?: string;
  error?: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormField({ id, label, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('min-w-0 space-y-1', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && <p id={id ? `${id}-error` : undefined} className="text-sm text-red-600" role="alert">{error}</p>}
      {!error && hint && <p id={id ? `${id}-hint` : undefined} className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}