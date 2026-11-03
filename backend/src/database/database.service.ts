import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { getDatabaseConnection, AppDatabase } from './connection';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  public db: AppDatabase;
  public pool: Pool;
  public schema = schema;
  private isConnected = false;

  constructor() {
    const conn = getDatabaseConnection();
    this.db = conn.db;
    this.pool = conn.pool;
  }

  async onModuleInit() {
    try {
      const client = await this.pool.connect();
      client.release();
      this.isConnected = true;
      this.logger.log('Successfully connected to PostgreSQL database with Drizzle ORM');
    } catch (error) {
      this.isConnected = false;
      this.logger.warn(
        `PostgreSQL database connection pending or unavailable (${(error as Error).message}). Ensure PostgreSQL is running on port ${process.env.DB_PORT || 5432}.`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('Database connection pool closed');
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
