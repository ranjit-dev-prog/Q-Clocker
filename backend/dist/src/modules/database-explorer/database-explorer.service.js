"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatabaseExplorerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExplorerService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const departments_service_1 = require("../departments/departments.service");
const tasks_service_1 = require("../tasks/tasks.service");
const tickets_service_1 = require("../tickets/tickets.service");
const roles_service_1 = require("../roles/roles.service");
const permissions_service_1 = require("../permissions/permissions.service");
const work_logs_service_1 = require("../work-logs/work-logs.service");
const payroll_service_1 = require("../payroll/payroll.service");
const lifecycle_service_1 = require("../lifecycle/lifecycle.service");
let DatabaseExplorerService = DatabaseExplorerService_1 = class DatabaseExplorerService {
    prisma;
    usersService;
    departmentsService;
    tasksService;
    ticketsService;
    rolesService;
    permissionsService;
    workLogsService;
    payrollService;
    lifecycleService;
    logger = new common_1.Logger(DatabaseExplorerService_1.name);
    categoryMap = {
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
    constructor(prisma, usersService, departmentsService, tasksService, ticketsService, rolesService, permissionsService, workLogsService, payrollService, lifecycleService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.departmentsService = departmentsService;
        this.tasksService = tasksService;
        this.ticketsService = ticketsService;
        this.rolesService = rolesService;
        this.permissionsService = permissionsService;
        this.workLogsService = workLogsService;
        this.payrollService = payrollService;
        this.lifecycleService = lifecycleService;
    }
    async getTables() {
        const models = client_1.Prisma.dmmf.datamodel.models;
        const tables = [];
        for (const model of models) {
            const tableName = model.dbName || model.name.toLowerCase();
            const scalarFields = model.fields.filter((f) => f.kind === 'scalar');
            const meta = this.categoryMap[tableName] || {
                category: 'Other System Tables',
                description: `Relational schema table for ${tableName}`,
            };
            const rowCount = await this.estimateRowCount(model);
            tables.push({
                name: tableName,
                key: model.name,
                category: meta.category,
                columnCount: scalarFields.length,
                rowCount,
                description: meta.description,
            });
        }
        return tables.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    async getTableSchema(tableName) {
        const model = this.findModel(tableName);
        if (!model) {
            throw new common_1.NotFoundException(`Table '${tableName}' not found in Prisma ORM schema`);
        }
        const scalarFields = model.fields.filter((f) => f.kind === 'scalar');
        const columns = scalarFields.map((f) => {
            const colName = f.dbName || f.name;
            return {
                name: colName,
                dataType: (f.type || 'String').toLowerCase(),
                isPrimary: f.name === 'id' || Boolean(f.isId),
                isNullable: !f.isRequired,
                hasDefault: Boolean(f.hasDefaultValue || f.default !== undefined),
                defaultVal: f.default !== undefined ? String(f.default) : undefined,
            };
        });
        return { tableName, columns };
    }
    async getTableData(tableName, page = 1, limit = 20, search) {
        const model = this.findModel(tableName);
        if (!model) {
            throw new common_1.NotFoundException(`Table '${tableName}' not found in Prisma schema`);
        }
        const scalarFields = model.fields.filter((f) => f.kind === 'scalar');
        const colNames = scalarFields.map((f) => f.dbName || f.name);
        const delegateName = model.name.charAt(0).toLowerCase() + model.name.slice(1);
        if (this.prisma.isConnected && this.prisma[delegateName]) {
            try {
                const offset = (page - 1) * limit;
                const delegate = this.prisma[delegateName];
                const [rows, total] = await Promise.all([
                    delegate.findMany({
                        skip: offset,
                        take: limit,
                    }),
                    delegate.count(),
                ]);
                return {
                    tableName,
                    total,
                    page,
                    limit,
                    columns: colNames,
                    rows: this.sanitizeRows(rows),
                };
            }
            catch (err) {
                this.logger.warn(`Direct DB query on ${tableName} (${delegateName}) failed: ${err.message}`);
            }
        }
        const storeRows = await this.getDomainData(tableName);
        let filtered = [...storeRows];
        if (search && search.trim()) {
            const q = search.trim().toLowerCase();
            filtered = filtered.filter((row) => Object.values(row).some((val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)));
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
    findModel(tableName) {
        const target = tableName.toLowerCase();
        return client_1.Prisma.dmmf.datamodel.models.find((m) => (m.dbName && m.dbName.toLowerCase() === target) || m.name.toLowerCase() === target);
    }
    async estimateRowCount(model) {
        const delegateName = model.name.charAt(0).toLowerCase() + model.name.slice(1);
        if (this.prisma.isConnected && this.prisma[delegateName]) {
            try {
                return await this.prisma[delegateName].count();
            }
            catch {
            }
        }
        const domainData = await this.getDomainData(model.dbName || model.name.toLowerCase());
        return domainData.length;
    }
    async getDomainData(tableName) {
        try {
            switch (tableName) {
                case 'users': {
                    const res = await this.usersService.findAll({});
                    return Array.isArray(res) ? res : res?.data || [];
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
                    return Array.isArray(res) ? res : res?.data || [];
                }
                case 'ticket_categories': {
                    return this.ticketsService.getCategories();
                }
                case 'work_logs': {
                    const res = await this.workLogsService.findAll({}, { roleCode: 'SUPER_ADMIN' });
                    return Array.isArray(res) ? res : res?.data || [];
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
        }
        catch {
            return [];
        }
    }
    sanitizeRows(rows) {
        return rows.map((row) => {
            const copy = { ...row };
            if ('passwordHash' in copy) {
                copy.passwordHash = '•'.repeat(16) + ' [BCRYPT_SECURED]';
            }
            return copy;
        });
    }
};
exports.DatabaseExplorerService = DatabaseExplorerService;
exports.DatabaseExplorerService = DatabaseExplorerService = DatabaseExplorerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        departments_service_1.DepartmentsService,
        tasks_service_1.TasksService,
        tickets_service_1.TicketsService,
        roles_service_1.RolesService,
        permissions_service_1.PermissionsService,
        work_logs_service_1.WorkLogsService,
        payroll_service_1.PayrollService,
        lifecycle_service_1.LifecycleService])
], DatabaseExplorerService);
//# sourceMappingURL=database-explorer.service.js.map