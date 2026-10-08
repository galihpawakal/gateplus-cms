import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

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

export function successResponse<T>(data: T, meta?: Record<string, unknown>, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status });
}

export function createdResponse<T>(data: T, meta?: Record<string, unknown>): NextResponse<ApiResponse<T>> {
  return successResponse(data, meta, 201);
}

export function noContentResponse(): NextResponse<ApiResponse<null>> {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: Record<string, string[]> | string[]
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { success: false, error: { code, message, details } },
    { status }
  );
}

export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse<null>> {
  const details: Record<string, string[]> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!details[path]) details[path] = [];
    details[path].push(err.message);
  });
  return errorResponse('VALIDATION_ERROR', 'Validasi gagal', 422, details);
}

export function notFoundResponse(resource = 'Resource'): NextResponse<ApiResponse<null>> {
  return errorResponse('NOT_FOUND', `${resource} tidak ditemukan`, 404);
}

export function internalErrorResponse(message = 'Terjadi kesalahan server'): NextResponse<ApiResponse<null>> {
  return errorResponse('INTERNAL_ERROR', message, 500);
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error('[API Error]', error);
  
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }
  
  if (error instanceof Error) {
    if (error instanceof SyntaxError) {
      return errorResponse('INVALID_JSON', 'Body JSON tidak valid', 400);
    }
    if (error.message.includes('P2003')) {
      return errorResponse('FOREIGN_KEY_CONSTRAINT', 'Data terkait tidak ditemukan', 400);
    }
    if (error.message.includes('P2002')) {
      return errorResponse('UNIQUE_CONSTRAINT', 'Data sudah ada', 409);
    }
  }
  
  return internalErrorResponse();
}