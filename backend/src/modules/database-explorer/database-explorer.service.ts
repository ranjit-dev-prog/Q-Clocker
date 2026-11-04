import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { getTableColumns, getTableName, is, sql } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
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

@Injectable()
export class DatabaseExplorerService {
  private readonly logger = new Logger(DatabaseExplorerService.name);

  // Table Categorization Map
  private readonly categoryMap: Record<string, { category: string; description: string }> = {
    roles: { category: 'RBAC & Security', description: 'System and custom role definitions with zero-trust permissions' },
    permissions: { category: 'RBAC & Security', description: 'Granular resource-level permissions and action scopes' },
    role_permissions: { category: 'RBAC & Security', description: 'Many-to-many junction between roles and granular permissions' },
    user_sessions: { category: 'RBAC & Security', description: 'Active and revoked JWT refresh token session states' },
    audit_logs: { category: 'RBAC & Security', description: 'Cryptographic immutable activity ledger for enterprise compliance' },

    users: { category: 'Organization & Workforce', description: 'Enterprise employee directory, auth credentials, and profiles' },
    departments: { category: 'Organization & Workforce', description: 'Organizational divisions with allocated budgets and headcounts' },
    teams: { category: 'Organization & Workforce', description: 'Agile sprint teams led by designated engineering leads' },
    designations: { category: 'Organization & Workforce', description: 'Corporate hierarchy positions and band level tiers' },
    projects: { category: 'Organization & Workforce', description: 'Enterprise deliverable initiatives and client contracts' },
    assets: { category: 'Organization & Workforce', description: 'Physical and cloud infrastructure assets assigned to users' },

    tasks: { category: 'Task Management', description: 'Core work deliverables tracked across agile Kanban boards' },
    task_assignments: { category: 'Task Management', description: 'Multi-user role allocations and effort estimates per task' },
    task_comments: { category: 'Task Management', description: 'Collaboration discussion threads and attachments per task' },
    task_attachments: { category: 'Task Management', description: 'File uploads, specs, and mockups linked to sprint tasks' },
    task_dependencies: { category: 'Task Management', description: 'Prerequisite and blocking relationships between deliverables' },

    tickets: { category: 'ITSM Service Desk', description: 'Enterprise ITIL tickets across IT, HR, and Facility queues' },
    ticket_categories: { category: 'ITSM Service Desk', description: 'Multi-tier service catalog categorization taxonomy' },
    ticket_subcategories: { category: 'ITSM Service Desk', description: 'Granular service classifications with dedicated SLA tiers' },
    sla_policies: { category: 'ITSM Service Desk', description: 'Contractual response and resolution countdown timers' },
    ticket_comments: { category: 'ITSM Service Desk', description: 'Public agent replies and internal private technician work notes' },
    ticket_history: { category: 'ITSM Service Desk', description: '11-state transition audit trail with timestamps and actors' },

    work_logs: { category: 'Time & Attendance', description: 'Daily billable/non-billable time tracking entries' },
    attendance_events: { category: 'Time & Attendance', description: 'Geo-verified clock-in/out and biometric verification records' },
    work_sessions: { category: 'Time & Attendance', description: 'Active stopwatch timers and automatic idle pauses' },
    task_time_entries: { category: 'Time & Attendance', description: 'Itemized duration logs tied directly to Kanban deliverables' },
    ticket_time_entries: { category: 'Time & Attendance', description: 'Technician resolution hours booked against ITSM tickets' },
    timesheets: { category: 'Time & Attendance', description: 'Weekly time packages submitted for managerial approval' },
    timesheet_entries: { category: 'Time & Attendance', description: 'Granular daily breakdown rows within each weekly timesheet' },

    payroll_batches: { category: 'Finance & Payroll', description: 'Monthly bulk payroll execution runs with total disbursement metrics' },
    payslips: { category: 'Finance & Payroll', description: 'Itemized compensation slips with earnings, deductions, and PDF seals' },
    tax_declarations: { category: 'Finance & Payroll', description: 'Section 80C/80D/HRA deductions and tax regime declarations' },

    lifecycle_events: { category: 'Lifecycle & Operations', description: 'Social milestone anniversaries, birthdays, and peer congratulations' },
    reminders: { category: 'Lifecycle & Operations', description: 'Probation reviews, contract expirations, and compliance deadlines' },
    follow_ups: { category: 'Lifecycle & Operations', description: 'Scheduled action items and manager follow-up flags' },
    approvals: { category: 'Lifecycle & Operations', description: 'Multi-stage approval requests for leaves, expenses, and assets' },
    notifications: { category: 'Lifecycle & Operations', description: 'In-app, push, and email dispatch event queues' },
    performance_reviews: { category: 'Lifecycle & Operations', description: 'Evaluation scores, complexity ratings, and manager feedback' },
    app_settings: { category: 'Lifecycle & Operations', description: 'Enterprise global branding, security policies, and config flags' },
  };

  constructor(
    private readonly dbService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly departmentsService: DepartmentsService,
    private readonly tasksService: TasksService,
    private readonly ticketsService: TicketsService,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
    private readonly workLogsService: WorkLogsService,
    private readonly payrollService: PayrollService,
    private readonly lifecycleService: LifecycleService,
  ) {}

  /**
   * Return all 39 Drizzle ORM relational database tables
   */
  async getTables(): Promise<TableSummary[]> {
    const tables: TableSummary[] = [];

    for (const [key, val] of Object.entries(schema)) {
      if (val && is(val, PgTable)) {
        const tableName = getTableName(val);
        const cols = getTableColumns(val);
        const meta = this.categoryMap[tableName] || {
          category: 'Other System Tables',
          description: `Relational schema table for ${tableName}`,
        };

        const rowCount = await this.estimateRowCount(tableName, val);

        tables.push({
          name: tableName,
          key,
          category: meta.category,
          columnCount: Object.keys(cols).length,
          rowCount,
          description: meta.description,
        });
      }
    }

    // Sort by category then name
    return tables.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }

  /**
   * Return column metadata for a specific Drizzle table
   */
  async getTableSchema(tableName: string): Promise<{ tableName: string; columns: ColumnDetail[] }> {
    const tableObj = this.findTable(tableName);
    if (!tableObj) {
      throw new NotFoundException(`Table '${tableName}' not found in Drizzle ORM schema`);
    }

    const cols = getTableColumns(tableObj);
    const columns: ColumnDetail[] = Object.entries(cols).map(([colName, colDef]: [string, any]) => {
      let dataType = colDef.dataType || 'unknown';
      if (colDef.columnType) {
        dataType = colDef.columnType.replace(/Pg/, '').toLowerCase();
      }

      return {
        name: colDef.name || colName,
        dataType,
        isPrimary: Boolean(colDef.primary),
        isNullable: !colDef.notNull,
        hasDefault: Boolean(colDef.hasDefault),
        defaultVal: colDef.default !== undefined ? String(colDef.default) : undefined,
      };
    });

    return { tableName, columns };
  }

  /**
   * Return live rows for a specific Drizzle table (with pagination & search)
   */
  async getTableData(
    tableName: string,
    page = 1,
    limit = 20,
    search?: string,
  ): Promise<{ tableName: string; total: number; page: number; limit: number; columns: string[]; rows: any[] }> {
    const tableObj = this.findTable(tableName);
    if (!tableObj) {
      throw new NotFoundException(`Table '${tableName}' not found in Drizzle schema`);
    }

    const cols = getTableColumns(tableObj);
    const colNames = Object.keys(cols);

    // 1. If database connection is active, query PostgreSQL directly via Drizzle
    if (this.dbService.getConnectionStatus()) {
      try {
        const offset = (page - 1) * limit;
        const rows = await (this.dbService.db as any)
          .select()
          .from(tableObj)
          .limit(limit)
          .offset(offset);

        const countResult = await (this.dbService.db as any)
          .select({ count: sql`count(*)` })
          .from(tableObj);

        const total = Number(countResult[0]?.count) || rows.length;

        return {
          tableName,
          total,
          page,
          limit,
          columns: colNames,
          rows: this.sanitizeRows(rows),
        };
      } catch (err) {
        this.logger.warn(`Direct DB query on ${tableName} failed: ${(err as Error).message}`);
      }
    }

    // 2. Synchronized domain store query (for instant visualization regardless of DB port 5432 status)
    const storeRows = await this.getDomainData(tableName);
    let filtered = [...storeRows];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)),
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedRows = filtered.slice(startIndex, startIndex + limit);

    return {
      tableName,
      total,
      page,
      limit,
      columns: colNames,
      rows: this.sanitizeRows(paginatedRows),
    };
  }

  private findTable(tableName: string): any {
    for (const val of Object.values(schema)) {
      if (val && is(val, PgTable) && getTableName(val) === tableName) {
        return val;
      }
    }
    return null;
  }

  private async estimateRowCount(tableName: string, tableObj: any): Promise<number> {
    if (this.dbService.getConnectionStatus()) {
      try {
        const [res] = await (this.dbService.db as any).select({ count: sql`count(*)` }).from(tableObj);
        return Number(res?.count) || 0;
      } catch {
        // Fallback
      }
    }
    const domainData = await this.getDomainData(tableName);
    return domainData.length;
  }

  private async getDomainData(tableName: string): Promise<any[]> {
    try {
      switch (tableName) {
        case 'users': {
          const res = await this.usersService.findAll({});
          return Array.isArray(res) ? res : (res as any)?.data || [];
        }
        case 'departments': {
          const res = await this.departmentsService.findAll();
          return Array.isArray(res) ? res : [];
        }
        case 'roles': {
          const res = await this.rolesService.findAll();
          return Array.isArray(res) ? res : [];
        }
        case 'permissions': {
          const res = await this.permissionsService.findAll();
          return Array.isArray(res) ? res : [];
        }
        case 'tasks': {
          const kanban = await this.tasksService.getKanbanBoard({ roleCode: 'SUPER_ADMIN' });
          return [
            ...(kanban.backlog || []),
            ...(kanban.inProgress || []),
            ...(kanban.review || []),
            ...(kanban.completed || []),
          ];
        }
        case 'tickets': {
          const res = await this.ticketsService.findAll({}, { roleCode: 'SUPER_ADMIN' });
          return Array.isArray(res) ? res : (res as any)?.data || [];
        }
        case 'ticket_categories': {
          return this.ticketsService.getCategories();
        }
        case 'work_logs': {
          const res = await this.workLogsService.findAll({}, { roleCode: 'SUPER_ADMIN' });
          return Array.isArray(res) ? res : (res as any)?.data || [];
        }
        case 'payroll_batches': {
          return this.payrollService.getAllBatches();
        }
        case 'payslips': {
          return this.payrollService.getMyPayslips('00000000-0000-0000-0000-000000000004');
        }
        case 'lifecycle_events': {
          return this.lifecycleService.getCelebrationsFeed();
        }
        case 'reminders': {
          return this.lifecycleService.getReminders();
        }
        default:
          return [];
      }
    } catch {
      return [];
    }
  }

  private sanitizeRows(rows: any[]): any[] {
    return rows.map((row) => {
      const copy = { ...row };
      if ('passwordHash' in copy) {
        copy.passwordHash = '•'.repeat(16) + ' [BCRYPT_SECURED]';
      }
      return copy;
    });
  }
}
