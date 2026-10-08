import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(classes));
}

export function toISOString(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  return new Date(date).toISOString();
}