export interface Content {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string | undefined;
  status: 'draft' | 'published';
  publishedAt: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCreateInput {
  title: string;
  description: string;
  genre: string;
  status: 'draft' | 'published';
  thumbnailUrl?: string;
  publishedAt?: string | null;
}

export interface ContentUpdateInput {
  title?: string;
  description?: string;
  genre?: string;
  status?: 'draft' | 'published';
  thumbnailUrl?: string;
  publishedAt?: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]> | string[];
  };
}