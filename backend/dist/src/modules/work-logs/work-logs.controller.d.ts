import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
export declare class WorkLogsController {
    private readonly workLogsService;
    constructor(workLogsService: WorkLogsService);
    create(createWorkLogDto: CreateWorkLogDto, user: any): Promise<any>;
    findAll(query: WorkLogQueryDto, user: any): Promise<any[]>;
    getDailySummary(date: string, user: any): Promise<{
        date: string;
        totalHours: any;
        activeEmployees: number;
        totalEntries: number;
        logs: any[];
    }>;
    findOne(id: string): Promise<any>;
}
