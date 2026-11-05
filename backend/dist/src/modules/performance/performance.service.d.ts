import { PrismaService } from '../../prisma/prisma.service';
import { PerformanceEvaluation } from './dto/performance.dto';
import { TasksService } from '../tasks/tasks.service';
import { TicketsService } from '../tickets/tickets.service';
export declare class PerformanceService {
    private readonly prisma;
    private readonly tasksService;
    private readonly ticketsService;
    private readonly logger;
    private memoryReviews;
    constructor(prisma: PrismaService, tasksService: TasksService, ticketsService: TicketsService);
    getMyPerformance(user: any): Promise<PerformanceEvaluation>;
}
