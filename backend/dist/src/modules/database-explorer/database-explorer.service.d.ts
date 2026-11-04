import { DatabaseService } from '../../database/database.service';
import { UsersService } from '../users/users.service';
import { DepartmentsService } from '../departments/departments.service';
import { TasksService } from '../tasks/tasks.service';
import { TicketsService } from '../tickets/tickets.service';
import { RolesService } from '../roles/roles.service';
import { PermissionsService } from '../permissions/permissions.service';
import { WorkLogsService } from '../work-logs/work-logs.service';
import { PayrollService } from '../payroll/payroll.service';
import { LifecycleService } from '../lifecycle/lifecycle.service';
export interface TableSummary {
    name: string;
    key: string;
    category: string;
    columnCount: number;
    rowCount: number;
    description: string;
}
export interface ColumnDetail {
    name: string;
    dataType: string;
    isPrimary: boolean;
    isNullable: boolean;
    hasDefault: boolean;
    defaultVal?: string;
}
export declare class DatabaseExplorerService {
    private readonly dbService;
    private readonly usersService;
    private readonly departmentsService;
    private readonly tasksService;
    private readonly ticketsService;
    private readonly rolesService;
    private readonly permissionsService;
    private readonly workLogsService;
    private readonly payrollService;
    private readonly lifecycleService;
    private readonly logger;
    private readonly categoryMap;
    constructor(dbService: DatabaseService, usersService: UsersService, departmentsService: DepartmentsService, tasksService: TasksService, ticketsService: TicketsService, rolesService: RolesService, permissionsService: PermissionsService, workLogsService: WorkLogsService, payrollService: PayrollService, lifecycleService: LifecycleService);
    getTables(): Promise<TableSummary[]>;
    getTableSchema(tableName: string): Promise<{
        tableName: string;
        columns: ColumnDetail[];
    }>;
    getTableData(tableName: string, page?: number, limit?: number, search?: string): Promise<{
        tableName: string;
        total: number;
        page: number;
        limit: number;
        columns: string[];
        rows: any[];
    }>;
    private findTable;
    private estimateRowCount;
    private getDomainData;
    private sanitizeRows;
}
