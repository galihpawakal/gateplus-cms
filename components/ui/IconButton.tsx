import { ReactNode, forwardRef } from 'react';
import { Button, ButtonProps } from './Button';
import { cn } from '@/lib/utils';

export const iconControlClassName = 'inline-flex h-10 min-h-10 w-10 min-w-10 shrink-0 items-center justify-center rounded-control text-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'aria-label' | 'size'> {
  'aria-label': string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, variant = 'ghost', ...props }, ref) => (
    <Button
      ref={ref}
      variant={variant}
      size="md"
      className={cn(iconControlClassName, 'p-0', className)}
      {...props}
    >
      {icon}
    </Button>
  )
);

IconButton.displayName = 'IconButton';