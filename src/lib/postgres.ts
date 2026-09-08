import { Pool } from 'pg';

let pool: Pool | null = null;
let isPgOffline = false;
let lastPgCheckTime = 0;
const PG_OFFLINE_COOLDOWN_MS = 15000; // 15 seconds cooldown before re-probing offline PostgreSQL

export function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  
  // If no custom DATABASE_URL configured or dummy placeholder, return null to fallback smoothly
  if (!connectionString || connectionString.includes('your-postgres-connection-string')) {
    return null;
  }

  // Fast circuit breaker: if PostgreSQL failed recently, skip trying for 15s to keep website load 0ms
  if (isPgOffline && Date.now() - lastPgCheckTime < PG_OFFLINE_COOLDOWN_MS) {
    return null;
  }

  if (!pool) {
    const isRemote = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');

    pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 1500, // Reduced timeout so pages never hang
      ssl: isRemote ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.warn('PostgreSQL Pool notice:', err?.message || err);
      isPgOffline = true;
      lastPgCheckTime = Date.now();
    });
  }
  return pool;
}

export async function queryPg<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const p = getPgPool();
    if (!p) return [];
    const result = await p.query(sql, params);
    isPgOffline = false; // Connection healthy
    return result.rows as T[];
  } catch (error: any) {
    isPgOffline = true;
    lastPgCheckTime = Date.now();
    console.warn('PostgreSQL Query Notice:', error?.message || error);
    return [];
  }
}


