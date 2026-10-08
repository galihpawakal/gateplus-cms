import { z } from 'zod';

export const contentStatusEnum = z.enum(['draft', 'published']);

export const contentBaseSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  genre: z.string().min(1, 'Genre wajib diisi').max(100, 'Genre maksimal 100 karakter'),
  status: contentStatusEnum,
  thumbnailUrl: z.string().url('URL thumbnail tidak valid').optional().or(z.literal('')),
  publishedAt: z.string().datetime('Format tanggal tidak valid').optional().nullable(),
});

export const contentCreateSchema = contentBaseSchema.refine(
  (data) => data.status !== 'published' || (data.publishedAt && data.publishedAt.length > 0),
  {
    message: 'Tanggal publish wajib diisi jika status Published',
    path: ['publishedAt'],
  }
);

export const contentUpdateSchema = contentBaseSchema.partial().refine(
  (data) => {
    if (data.status === 'published' && (!data.publishedAt || data.publishedAt.length === 0)) {
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