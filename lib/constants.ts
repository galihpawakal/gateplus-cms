export const CONTENT_STATUSES = ['draft', 'published'] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export const DRAFT_STATUS = CONTENT_STATUSES[0];
export const PUBLISHED_STATUS = CONTENT_STATUSES[1];

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};

export const CONTENT_STATUS_BADGE_VARIANTS = {
  draft: 'warning',
  published: 'success',
} as const;

export const CONTENT_STATUS_OPTIONS = CONTENT_STATUSES.map((status) => ({
  value: status,
  label: CONTENT_STATUS_LABELS[status],
}));

export const ALL_STATUS_OPTION = { value: '', label: 'Semua Status' };