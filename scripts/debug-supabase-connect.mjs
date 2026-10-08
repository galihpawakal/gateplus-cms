import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'debug-7e78b3.log');
const sessionId = '7e78b3';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

function log(hypothesisId, message, data) {
  const entry = {
    sessionId,
    runId: 'pre-fix',
    hypothesisId,
    location: 'scripts/debug-supabase-connect.mjs',
    message,
    data,
    timestamp: Date.now(),
  };
  fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`);
}

const env = {
  ...loadEnvFile(path.join(process.cwd(), '.env')),
  ...loadEnvFile(path.join(process.cwd(), '.env.local')),
};

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const dbUrl = env.DATABASE_URL ?? '';
const directUrl = env.DIRECT_URL ?? '';

function dbHost(connectionString) {
  const m = connectionString.match(/@([^:/]+)/);
  return m ? m[1] : null;
}

log('H2', 'Env summary', {
  hasUrl: Boolean(url),
  hasPublishableKey: Boolean(key),
  urlHost: url ? new URL(url).host : null,
  keyShape: key?.startsWith('sb_publishable_') ? 'publishable' : key?.startsWith('eyJ') ? 'jwt-legacy' : 'other',
  databaseHost: dbHost(dbUrl),
  directHost: dbHost(directUrl),
  authAndDbSameProject:
    Boolean(url) && Boolean(dbUrl) && url.includes('zhjhhdbycufqbiomejas')
      ? dbHost(dbUrl)?.includes('supabase')
      : null,
});

if (url && key) {
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      headers: { apikey: key },
    });
    log('H4', 'Supabase auth health', { status: res.status, ok: res.ok });
  } catch (err) {
    log('H4', 'Supabase auth health failed', { error: err instanceof Error ? err.message : String(err) });
  }
} else {
  log('H2', 'Skipped health check', { reason: 'missing url or key' });
}

log('H3', 'Database target vs Supabase cloud', {
  databasePointsToLocalhost: dbHost(dbUrl) === 'localhost' || dbHost(dbUrl) === '127.0.0.1',
  supabaseProjectRefInUrl: url?.includes('zhjhhdbycufqbiomejas') ?? false,
});
