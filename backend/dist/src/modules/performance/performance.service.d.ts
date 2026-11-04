import { DatabaseService } from '../../database/database.service';
import { PerformanceEvaluation } from './dto/performance.dto';
import { TasksService } from '../tasks/tasks.service';
import { TicketsService } from '../tickets/tickets.service';
export declare class PerformanceService {
    private readonly dbService;
    private readonly tasksService;
    private readonly ticketsService;
    private readonly logger;
    private memoryReviews;
    constructor(dbService: DatabaseService, tasksService: TasksService, ticketsService: TicketsService);
    getMyPerformance(user: any): Promise<PerformanceEvaluation>;
}
