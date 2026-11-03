import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { AppDatabase } from './connection';
import * as schema from './schema';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    db: AppDatabase;
    pool: Pool;
    schema: typeof schema;
    private isConnected;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getConnectionStatus(): boolean;
}
