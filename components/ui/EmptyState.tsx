import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center" aria-live="polite">
      <div className="text-gray-400">{icon || <Inbox className="h-12 w-12" aria-hidden="true" />}</div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="max-w-xl text-sm text-gray-600">{description}</p>}
      </div>
      {action}
    </section>
  );
}