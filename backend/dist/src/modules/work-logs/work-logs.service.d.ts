import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
export declare class WorkLogsService {
    private readonly prisma;
    private readonly logger;
    private demoWorkLogs;
    constructor(prisma: PrismaService);
    create(createWorkLogDto: CreateWorkLogDto, user: any): Promise<any>;
    findAll(query: WorkLogQueryDto, user: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    getDailySummary(date: string, user: any): Promise<{
        date: string;
        totalHours: any;
        activeEmployees: number;
        totalEntries: number;
        logs: any[];
    }>;
}
