import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry: () => void;
  retryLabel?: string;
  action?: ReactNode;
}

export function ErrorState({ title, description, onRetry, retryLabel = 'Coba lagi', action }: ErrorStateProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-3 rounded-control border border-red-200 bg-red-50 px-4 py-8 text-center" role="alert">
      <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
      <div className="space-y-1">
        <h2 className="font-semibold text-red-900">{title}</h2>
        <p className="max-w-xl text-sm text-red-800">{description}</p>
      </div>
      {action || <Button variant="secondary" onClick={onRetry}>{retryLabel}</Button>}
    </section>
  );
}