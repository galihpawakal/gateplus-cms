import { ContentStatus, CONTENT_STATUS_BADGE_VARIANTS, CONTENT_STATUS_LABELS } from '@/lib/constants';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={CONTENT_STATUS_BADGE_VARIANTS[status]} className={className}>
      {CONTENT_STATUS_LABELS[status]}
    </Badge>
  );
}