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
var WorkLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkLogsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
let WorkLogsService = WorkLogsService_1 = class WorkLogsService {
    dbService;
    logger = new common_1.Logger(WorkLogsService_1.name);
    demoWorkLogs = [
        {
            id: '70000000-0000-0000-0000-000000000001',
            referenceId: 'WLG-8K9N2M',
            employeeId: '00000000-0000-0000-0000-000000000004',
            employeeName: 'David Ross',
            taskId: '20000000-0000-0000-0000-000000000001',
            taskTitle: 'Implement Drizzle ORM Schema & Relational Models',
            taskReference: 'TSK-9X4K21',
            ticketId: null,
            ticketTitle: null,
            ticketReference: null,
            logDate: '2026-11-03',
            startTime: '09:00',
            endTime: '13:00',
            totalHours: '4.00',
            workDescription: 'Engineered normalized database schemas with proper foreign keys, constraints, and DDL migrations.',
            investigationPerformed: 'Benchmarked PostgreSQL connection pool limits under synthetic concurrent query stress.',
            actionsTaken: 'Authored 26 table definitions and verified backward-compatible rollback migrations.',
            challengesFaced: 'Resolving circular relation between departments and manager users.',
            status: 'SUBMITTED',
            createdAt: new Date('2026-11-03T13:00:00Z'),
        },
        {
            id: '70000000-0000-0000-0000-000000000002',
            referenceId: 'WLG-3R7P4X',
            employeeId: '00000000-0000-0000-0000-000000000004',
            employeeName: 'David Ross',
            taskId: '20000000-0000-0000-0000-000000000002',
            taskTitle: 'Angular Standalone Shell & Tailwind Layout',
            taskReference: 'TSK-3M8N7Q',
            ticketId: null,
            ticketTitle: null,
            ticketReference: null,
            logDate: '2026-11-03',
            startTime: '14:00',
            endTime: '17:30',
            totalHours: '3.50',
            workDescription: 'Crafted responsive enterprise layout with theme toggling and live role switching.',
            investigationPerformed: 'Audited Tailwind CSS build sizes and bundle splitting.',
            actionsTaken: 'Created standalone components, sidebar navigation, and header profile widget.',
            challengesFaced: null,
            status: 'APPROVED',
            createdAt: new Date('2026-11-03T17:30:00Z'),
        },
    ];
    constructor(dbService) {
        this.dbService = dbService;
    }
    async create(createWorkLogDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('WLG');
        const totalHoursStr = createWorkLogDto.totalHours.toFixed(2);
        if (this.dbService.getConnectionStatus()) {
            const [newLog] = await this.dbService.db
                .insert(schema.workLogs)
                .values({
                referenceId,
                employeeId: user.id,
                taskId: createWorkLogDto.taskId || null,
                ticketId: createWorkLogDto.ticketId || null,
                logDate: createWorkLogDto.logDate,
                startTime: createWorkLogDto.startTime,
                endTime: createWorkLogDto.endTime,
                totalHours: totalHoursStr,
                workDescription: createWorkLogDto.workDescription.trim(),
                investigationPerformed: createWorkLogDto.investigationPerformed?.trim() || null,
                actionsTaken: createWorkLogDto.actionsTaken?.trim() || null,
                challengesFaced: createWorkLogDto.challengesFaced?.trim() || null,
                status: 'SUBMITTED',
            })
                .returning();
            if (createWorkLogDto.taskId) {
                try {
                    await this.dbService.db
                        .update(schema.tasks)
                        .set({
                        actualHours: (0, drizzle_orm_1.sql) `${schema.tasks.actualHours} + ${createWorkLogDto.totalHours}`,
                        updatedAt: new Date(),
                    })
                        .where((0, drizzle_orm_1.eq)(schema.tasks.id, createWorkLogDto.taskId));
                }
                catch (err) {
                    this.logger.warn(`Failed to increment task hours: ${err.message}`);
                }
            }
            return this.findById(newLog.id);
        }
        const newLog = {
            id: crypto.randomUUID(),
            referenceId,
            employeeId: user.id,
            employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
            taskId: createWorkLogDto.taskId || null,
            taskTitle: createWorkLogDto.taskId ? 'Linked Task' : null,
            taskReference: createWorkLogDto.taskId ? 'TSK-LINKED' : null,
            ticketId: createWorkLogDto.ticketId || null,
            ticketTitle: createWorkLogDto.ticketId ? 'Linked Ticket' : null,
            ticketReference: createWorkLogDto.ticketId ? 'TKT-LINKED' : null,
            logDate: createWorkLogDto.logDate,
            startTime: createWorkLogDto.startTime,
            endTime: createWorkLogDto.endTime,
            totalHours: totalHoursStr,
            workDescription: createWorkLogDto.workDescription.trim(),
            investigationPerformed: createWorkLogDto.investigationPerformed?.trim() || null,
            actionsTaken: createWorkLogDto.actionsTaken?.trim() || null,
            challengesFaced: createWorkLogDto.challengesFaced?.trim() || null,
            status: 'SUBMITTED',
            createdAt: new Date(),
        };
        this.demoWorkLogs.unshift(newLog);
        return newLog;
    }
    async findAll(query, user) {
        if (this.dbService.getConnectionStatus()) {
            const conditions = [];
            if (user.role === enums_1.UserRole.EMPLOYEE) {
                conditions.push((0, drizzle_orm_1.eq)(schema.workLogs.employeeId, user.id));
            }
            else if (query.employeeId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.workLogs.employeeId, query.employeeId));
            }
            if (query.logDate) {
                conditions.push((0, drizzle_orm_1.eq)(schema.workLogs.logDate, query.logDate));
            }
            if (query.taskId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.workLogs.taskId, query.taskId));
            }
            if (query.ticketId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.workLogs.ticketId, query.ticketId));
            }
            const rows = await this.dbService.db
                .select({
                id: schema.workLogs.id,
                referenceId: schema.workLogs.referenceId,
                employeeId: schema.workLogs.employeeId,
                employeeFirstName: schema.users.firstName,
                employeeLastName: schema.users.lastName,
                employeeEmail: schema.users.email,
                taskId: schema.workLogs.taskId,
                taskTitle: schema.tasks.title,
                taskReference: schema.tasks.referenceId,
                ticketId: schema.workLogs.ticketId,
                ticketTitle: schema.tickets.title,
                ticketReference: schema.tickets.referenceId,
                logDate: schema.workLogs.logDate,
                startTime: schema.workLogs.startTime,
                endTime: schema.workLogs.endTime,
                totalHours: schema.workLogs.totalHours,
                workDescription: schema.workLogs.workDescription,
                investigationPerformed: schema.workLogs.investigationPerformed,
                actionsTaken: schema.workLogs.actionsTaken,
                challengesFaced: schema.workLogs.challengesFaced,
                status: schema.workLogs.status,
                createdAt: schema.workLogs.createdAt,
            })
                .from(schema.workLogs)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.workLogs.employeeId, schema.users.id))
                .leftJoin(schema.tasks, (0, drizzle_orm_1.eq)(schema.workLogs.taskId, schema.tasks.id))
                .leftJoin(schema.tickets, (0, drizzle_orm_1.eq)(schema.workLogs.ticketId, schema.tickets.id))
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(schema.workLogs.logDate), (0, drizzle_orm_1.desc)(schema.workLogs.createdAt));
            return rows.map((r) => ({
                ...r,
                employeeName: `${r.employeeFirstName || ''} ${r.employeeLastName || ''}`.trim() || 'Employee',
            }));
        }
        return this.demoWorkLogs.filter((l) => {
            if (user.role === enums_1.UserRole.EMPLOYEE && l.employeeId !== user.id)
                return false;
            if (query.employeeId && l.employeeId !== query.employeeId)
                return false;
            if (query.logDate && l.logDate !== query.logDate)
                return false;
            return true;
        });
    }
    async findById(id) {
        if (this.dbService.getConnectionStatus()) {
            const [log] = await this.dbService.db
                .select()
                .from(schema.workLogs)
                .where((0, drizzle_orm_1.eq)(schema.workLogs.id, id))
                .limit(1);
            if (!log)
                throw new common_1.NotFoundException(`Work log '${id}' not found`);
            return log;
        }
        const log = this.demoWorkLogs.find((l) => l.id === id || l.referenceId === id);
        if (!log)
            throw new common_1.NotFoundException(`Work log '${id}' not found`);
        return log;
    }
    async getDailySummary(date, user) {
        const logs = await this.findAll({ logDate: date }, user);
        const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.totalHours || 0), 0);
        const uniqueEmployees = new Set(logs.map((l) => l.employeeId)).size;
        return {
            date,
            totalHours: totalHours.toFixed(2),
            activeEmployees: uniqueEmployees,
            totalEntries: logs.length,
            logs,
        };
    }
};
exports.WorkLogsService = WorkLogsService;
exports.WorkLogsService = WorkLogsService = WorkLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], WorkLogsService);
//# sourceMappingURL=work-logs.service.js.map