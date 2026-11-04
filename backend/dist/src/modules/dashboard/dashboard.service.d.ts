import { DatabaseService } from '../../database/database.service';
import { TasksService } from '../tasks/tasks.service';
import { TicketsService } from '../tickets/tickets.service';
import { UsersService } from '../users/users.service';
import { DepartmentsService } from '../departments/departments.service';
import { WorkLogsService } from '../work-logs/work-logs.service';
import { DashboardSummaryResponse } from './dto/dashboard.dto';
export declare class DashboardService {
    private readonly dbService;
    private readonly tasksService;
    private readonly ticketsService;
    private readonly usersService;
    private readonly departmentsService;
    private readonly workLogsService;
    private readonly logger;
    constructor(dbService: DatabaseService, tasksService: TasksService, ticketsService: TicketsService, usersService: UsersService, departmentsService: DepartmentsService, workLogsService: WorkLogsService);
    getSummary(user: any): Promise<DashboardSummaryResponse>;
}
