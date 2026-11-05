import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    isConnected: boolean;
    readonly provider = "postgresql";
    readonly orm = "prisma";
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getConnectionStatus(): {
        connected: boolean;
        provider: string;
        orm: string;
        version: string;
        modelsCount: number;
    };
}
