'use client';

import { Fragment, ReactNode, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { IconButton } from './IconButton';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
}

export function Dialog({ open, onOpenChange, children, title, description }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const getFocusableElements = () => Array.from(dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    ) || []);
    getFocusableElements()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
        >
          {(title || description) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-200">
              <div>
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="text-sm text-gray-500 mt-1">
                    {description}
                  </p>
                )}
              </div>
              <IconButton
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Tutup dialog"
                title="Tutup dialog"
                icon={<X className="h-5 w-5" aria-hidden="true" />}
              />
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </Fragment>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Dialog>
  );
}