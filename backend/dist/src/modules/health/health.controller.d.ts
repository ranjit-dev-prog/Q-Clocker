import { DatabaseService } from '../../database/database.service';
export declare class HealthController {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    check(): {
        status: string;
        version: string;
        timestamp: string;
        uptimeSeconds: number;
        database: {
            status: string;
            engine: string;
        };
        memory: {
            heapUsedMb: number;
            rssMb: number;
        };
    };
}
