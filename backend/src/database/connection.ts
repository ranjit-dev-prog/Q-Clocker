import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

export type AppDatabase = NodePgDatabase<typeof schema>;

let cachedDb: AppDatabase | null = null;
let cachedPool: Pool | null = null;

export function getDatabaseConnection(): { db: AppDatabase; pool: Pool } {
  if (cachedDb && cachedPool) {
    return { db: cachedDb, pool: cachedPool };
  }

  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'q_clocker'}`,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  const db = drizzle(pool, { schema });

  cachedDb = db;
  cachedPool = pool;

  return { db, pool };
}
