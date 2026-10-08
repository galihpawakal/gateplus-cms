import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig } from './config';

export async function updateSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseConfig();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  // #region agent log
  fetch('http://127.0.0.1:7785/ingest/ca84c8f6-a8f0-45f4-8e78-c48f4d949781', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7e78b3' },
    body: JSON.stringify({
      sessionId: '7e78b3',
      runId: 'pre-fix',
      hypothesisId: 'H4',
      location: 'utils/supabase/middleware.ts:updateSession',
      message: 'Supabase auth.getUser result',
      data: {
        path: request.nextUrl.pathname,
        hasUser: Boolean(userData?.user),
        errorMessage: userError?.message ?? null,
        errorStatus: userError?.status ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return response;
}