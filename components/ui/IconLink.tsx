import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { iconControlClassName } from './IconButton';

interface IconLinkProps extends Omit<LinkProps, 'children'> {
  'aria-label': string;
  title?: string;
  icon: ReactNode;
  className?: string;
}

export function IconLink({ icon, className, title, ...props }: IconLinkProps) {
  return (
    <Link className={cn(iconControlClassName, className)} title={title || props['aria-label']} {...props}>
      {icon}
    </Link>
  );
}