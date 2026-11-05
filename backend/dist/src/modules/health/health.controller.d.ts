import { PrismaService } from '../../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): {
        status: string;
        version: string;
        environment: string;
        timestamp: string;
        uptimeSeconds: number;
        components: {
            frontend: {
                name: string;
                status: string;
                url: string;
                mode: string;
            };
            backend: {
                name: string;
                status: string;
                url: string;
                version: string;
            };
            restApi: {
                name: string;
                status: string;
                prefix: string;
                swaggerUrl: string;
            };
            database: {
                name: string;
                status: string;
                engine: string;
                port: number;
                databaseName: string;
                connectionPool: string;
            };
            prismaOrm: {
                name: string;
                status: string;
                tablesMapped: number;
                studioUrl: string;
            };
            migrations: {
                name: string;
                status: string;
                totalMigrations: number;
            };
            notificationService: {
                name: string;
                status: string;
                channels: string[];
            };
            payrollEngine: {
                name: string;
                status: string;
                capabilities: string[];
            };
            lifecycleService: {
                name: string;
                status: string;
                capabilities: string[];
            };
        };
        resources: {
            heapUsedMb: number;
            heapTotalMb: number;
            rssMb: number;
        };
    };
}
