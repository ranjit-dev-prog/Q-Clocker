"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRIZZLE_PROVIDER = void 0;
exports.getDatabaseConnection = getDatabaseConnection;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const schema = require("./schema");
const dotenv = require("dotenv");
dotenv.config();
exports.DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';
let cachedDb = null;
let cachedPool = null;
function getDatabaseConnection() {
    if (cachedDb && cachedPool) {
        return { db: cachedDb, pool: cachedPool };
    }
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL ||
            `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'q_clocker'}`,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    });
    const db = (0, node_postgres_1.drizzle)(pool, { schema });
    cachedDb = db;
    cachedPool = pool;
    return { db, pool };
}
//# sourceMappingURL=connection.js.map