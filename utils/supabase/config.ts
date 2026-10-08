export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // #region agent log
  fetch('http://127.0.0.1:7785/ingest/ca84c8f6-a8f0-45f4-8e78-c48f4d949781', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7e78b3' },
    body: JSON.stringify({
      sessionId: '7e78b3',
      runId: 'pre-fix',
      hypothesisId: 'H2',
      location: 'utils/supabase/config.ts:getSupabaseConfig',
      message: 'Supabase env presence',
      data: {
        hasUrl: Boolean(url),
        hasPublishableKey: Boolean(publishableKey),
        urlHost: url ? (() => { try { return new URL(url).host; } catch { return 'invalid-url'; } })() : null,
        keyShape: publishableKey
          ? publishableKey.startsWith('sb_publishable_')
            ? 'publishable'
            : publishableKey.startsWith('eyJ')
              ? 'jwt-legacy'
              : 'other'
          : null,
        isPlaceholderUrl: url === 'https://your-project.supabase.co',
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!url || !publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  }

  return { url, publishableKey };
}