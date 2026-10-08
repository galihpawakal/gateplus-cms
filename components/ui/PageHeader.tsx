import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, eyebrow, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow}
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
        {description && <div className="text-sm text-gray-600">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}