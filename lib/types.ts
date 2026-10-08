import { ContentStatus } from './constants';

export interface Content {
  id: string;
  title: string;
  description: string;
  genre: string;
  thumbnailUrl: string | undefined;
  status: ContentStatus;
  publishedAt: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCreateInput {
  title: string;
  description: string;
  genre: string;
  status: ContentStatus;
  thumbnailUrl?: string;
  publishedAt?: string | null;
}

export interface ContentUpdateInput {
  title?: string;
  description?: string;
  genre?: string;
  status?: ContentStatus;
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