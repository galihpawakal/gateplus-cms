import { z } from 'zod';
import { CONTENT_STATUSES, PUBLISHED_STATUS } from './constants';

export const contentStatusEnum = z.enum(CONTENT_STATUSES);

const publishedAtSchema = z
  .string()
  .datetime({ offset: true, local: true })
  .transform((value) => new Date(value).toISOString())
  .optional()
  .nullable();

export const contentBaseSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  genre: z.string().min(1, 'Genre wajib diisi').max(100, 'Genre maksimal 100 karakter'),
  status: contentStatusEnum,
  thumbnailUrl: z.string().url('URL thumbnail tidak valid').optional().or(z.literal('')),
  publishedAt: publishedAtSchema,
});

export const contentCreateSchema = contentBaseSchema.refine(
  (data) => data.status !== PUBLISHED_STATUS || (data.publishedAt && data.publishedAt.length > 0),
  {
    message: 'Tanggal publish wajib diisi jika status Published',
    path: ['publishedAt'],
  }
);

export const contentUpdateSchema = contentBaseSchema.partial().refine(
  (data) => {
    if (data.status === PUBLISHED_STATUS && (!data.publishedAt || data.publishedAt.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Tanggal publish wajib diisi jika status Published',
    path: ['publishedAt'],
  }
);

export const contentQuerySchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  status: contentStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ContentCreateInput = z.infer<typeof contentCreateSchema>;
export type ContentUpdateInput = z.infer<typeof contentUpdateSchema>;
export type ContentQueryInput = z.infer<typeof contentQuerySchema>;
export type ContentStatus = z.infer<typeof contentStatusEnum>;