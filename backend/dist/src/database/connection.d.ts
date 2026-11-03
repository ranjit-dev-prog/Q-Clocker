import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
export declare const DRIZZLE_PROVIDER = "DRIZZLE_PROVIDER";
export type AppDatabase = NodePgDatabase<typeof schema>;
export declare function getDatabaseConnection(): {
    db: AppDatabase;
    pool: Pool;
};
