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
const prisma_service_1 = require("../../prisma/prisma.service");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
const crypto = require("crypto");
let WorkLogsService = WorkLogsService_1 = class WorkLogsService {
    prisma;
    logger = new common_1.Logger(WorkLogsService_1.name);
    demoWorkLogs = [
        {
            id: '70000000-0000-0000-0000-000000000001',
            referenceId: 'WLG-8K9N2M',
            employeeId: '00000000-0000-0000-0000-000000000004',
            employeeName: 'David Ross',
            taskId: '20000000-0000-0000-0000-000000000001',
            taskTitle: 'Implement Prisma ORM Schema & Relational Models',
            taskReference: 'TSK-9X4K21',
            ticketId: null,
            ticketTitle: null,
            ticketReference: null,
            logDate: '2026-11-03',
            startTime: '09:00',
            endTime: '13:00',
            totalHours: '4.00',
            workDescription: 'Engineered normalized database schemas with proper foreign keys, constraints, and migrations.',
            investigationPerformed: 'Benchmarked PostgreSQL connection pool limits under synthetic concurrent query stress.',
            actionsTaken: 'Authored 39 model definitions and verified backward-compatible schema relations.',
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createWorkLogDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('WLG');
        const totalHoursStr = createWorkLogDto.totalHours.toFixed(2);
        if (this.prisma.isConnected) {
            const newLog = await this.prisma.workLog.create({
                data: {
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
                },
            });
            if (createWorkLogDto.taskId) {
                try {
                    const task = await this.prisma.task.findUnique({
                        where: { id: createWorkLogDto.taskId },
                    });
                    const currentActual = task ? Number(task.actualHours || 0) : 0;
                    await this.prisma.task.update({
                        where: { id: createWorkLogDto.taskId },
                        data: {
                            actualHours: currentActual + createWorkLogDto.totalHours,
                            updatedAt: new Date(),
                        },
                    });
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
        if (this.prisma.isConnected) {
            const where = {};
            if (user.role === enums_1.UserRole.EMPLOYEE) {
                where.employeeId = user.id;
            }
            else if (query.employeeId) {
                where.employeeId = query.employeeId;
            }
            if (query.logDate) {
                where.logDate = query.logDate;
            }
            if (query.taskId) {
                where.taskId = query.taskId;
            }
            if (query.ticketId) {
                where.ticketId = query.ticketId;
            }
            const rows = await this.prisma.workLog.findMany({
                where,
                include: {
                    employee: {
                        select: { firstName: true, lastName: true, email: true },
                    },
                    task: {
                        select: { title: true, referenceId: true },
                    },
                    ticket: {
                        select: { title: true, referenceId: true },
                    },
                },
                orderBy: [{ logDate: 'desc' }, { createdAt: 'desc' }],
            });
            return rows.map((r) => ({
                id: r.id,
                referenceId: r.referenceId,
                employeeId: r.employeeId,
                employeeFirstName: r.employee?.firstName || null,
                employeeLastName: r.employee?.lastName || null,
                employeeEmail: r.employee?.email || null,
                employeeName: `${r.employee?.firstName || ''} ${r.employee?.lastName || ''}`.trim() || 'Employee',
                taskId: r.taskId,
                taskTitle: r.task?.title || null,
                taskReference: r.task?.referenceId || null,
                ticketId: r.ticketId,
                ticketTitle: r.ticket?.title || null,
                ticketReference: r.ticket?.referenceId || null,
                logDate: r.logDate,
                startTime: r.startTime,
                endTime: r.endTime,
                totalHours: r.totalHours,
                workDescription: r.workDescription,
                investigationPerformed: r.investigationPerformed,
                actionsTaken: r.actionsTaken,
                challengesFaced: r.challengesFaced,
                status: r.status,
                createdAt: r.createdAt,
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
        if (this.prisma.isConnected) {
            const log = await this.prisma.workLog.findFirst({
                where: {
                    OR: [{ id }, { referenceId: id }],
                },
                include: {
                    employee: {
                        select: { firstName: true, lastName: true, email: true },
                    },
                    task: {
                        select: { title: true, referenceId: true },
                    },
                    ticket: {
                        select: { title: true, referenceId: true },
                    },
                },
            });
            if (!log)
                throw new common_1.NotFoundException(`Work log '${id}' not found`);
            return {
                ...log,
                employeeFirstName: log.employee?.firstName || null,
                employeeLastName: log.employee?.lastName || null,
                employeeEmail: log.employee?.email || null,
                employeeName: `${log.employee?.firstName || ''} ${log.employee?.lastName || ''}`.trim() || 'Employee',
                taskTitle: log.task?.title || null,
                taskReference: log.task?.referenceId || null,
                ticketTitle: log.ticket?.title || null,
                ticketReference: log.ticket?.referenceId || null,
            };
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkLogsService);
//# sourceMappingURL=work-logs.service.js.map