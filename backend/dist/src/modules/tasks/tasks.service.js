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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
const notifications_service_1 = require("../notifications/notifications.service");
let TasksService = TasksService_1 = class TasksService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(TasksService_1.name);
    demoTasks = [
        {
            id: '20000000-0000-0000-0000-000000000001',
            referenceId: 'TSK-9X4K21',
            taskNumber: 'TSK-9X4K21',
            title: 'Implement Prisma ORM Schema & Relational Models',
            description: 'Define all 26 tables, foreign keys, indexes, and migration DDL for the enterprise ERP database.',
            departmentId: '10000000-0000-0000-0000-000000000001',
            teamId: null,
            projectId: null,
            priority: 'HIGH',
            category: 'Development',
            startDate: new Date('2026-11-01T09:00:00Z'),
            dueDate: new Date('2026-11-04T18:00:00Z'),
            estimatedHours: '6.00',
            actualHours: '4.50',
            status: enums_1.TaskStatus.IN_PROGRESS,
            completionPercentage: 75,
            createdById: '00000000-0000-0000-0000-000000000001',
            reviewedById: '00000000-0000-0000-0000-000000000002',
            assignedEmployeeId: '00000000-0000-0000-0000-000000000004',
            assignedEmployeeName: 'David Ross',
            createdByName: 'Alexander Vance',
            departmentName: 'Information Technology',
            createdAt: new Date('2026-11-01T09:00:00Z'),
            updatedAt: new Date('2026-11-03T10:00:00Z'),
        },
        {
            id: '20000000-0000-0000-0000-000000000002',
            referenceId: 'TSK-3M8N7Q',
            taskNumber: 'TSK-3M8N7Q',
            title: 'Angular Standalone Shell & Tailwind Layout',
            description: 'Modern enterprise UI components with dark mode, responsive sidebar, and header navigation.',
            departmentId: '10000000-0000-0000-0000-000000000001',
            teamId: null,
            projectId: null,
            priority: 'CRITICAL',
            category: 'Frontend',
            startDate: new Date('2026-11-02T09:00:00Z'),
            dueDate: new Date('2026-11-03T18:00:00Z'),
            estimatedHours: '8.00',
            actualHours: '8.00',
            status: enums_1.TaskStatus.COMPLETED,
            completionPercentage: 100,
            createdById: '00000000-0000-0000-0000-000000000002',
            reviewedById: '00000000-0000-0000-0000-000000000003',
            assignedEmployeeId: '00000000-0000-0000-0000-000000000004',
            assignedEmployeeName: 'David Ross',
            createdByName: 'Marcus Chen',
            departmentName: 'Information Technology',
            createdAt: new Date('2026-11-02T09:00:00Z'),
            updatedAt: new Date('2026-11-03T12:00:00Z'),
        },
        {
            id: '20000000-0000-0000-0000-000000000003',
            referenceId: 'TSK-5R2W9P',
            taskNumber: 'TSK-5R2W9P',
            title: 'Audit Log Interceptor & Role-Based Access Guards',
            description: 'Enforce enterprise security auditing and granular permissions on critical mutating endpoints.',
            departmentId: '10000000-0000-0000-0000-000000000001',
            teamId: null,
            projectId: null,
            priority: 'HIGH',
            category: 'Security',
            startDate: new Date('2026-11-03T09:00:00Z'),
            dueDate: new Date('2026-11-05T18:00:00Z'),
            estimatedHours: '5.00',
            actualHours: '3.00',
            status: enums_1.TaskStatus.PENDING_REVIEW,
            completionPercentage: 90,
            createdById: '00000000-0000-0000-0000-000000000001',
            reviewedById: '00000000-0000-0000-0000-000000000002',
            assignedEmployeeId: '00000000-0000-0000-0000-000000000003',
            assignedEmployeeName: 'Sarah Jenkins',
            createdByName: 'Alexander Vance',
            departmentName: 'Information Technology',
            createdAt: new Date('2026-11-03T09:00:00Z'),
            updatedAt: new Date('2026-11-03T14:00:00Z'),
        },
        {
            id: '20000000-0000-0000-0000-000000000004',
            referenceId: 'TSK-8K7L3X',
            taskNumber: 'TSK-8K7L3X',
            title: 'Configure PostgreSQL 16 Multi-Container Deployment',
            description: 'Prepare production-ready compose manifests with health checks, volumes, and connection pooling.',
            departmentId: '10000000-0000-0000-0000-000000000001',
            teamId: null,
            projectId: null,
            priority: 'MEDIUM',
            category: 'DevOps',
            startDate: new Date('2026-11-02T09:00:00Z'),
            dueDate: new Date('2026-11-03T18:00:00Z'),
            estimatedHours: '3.00',
            actualHours: '2.50',
            status: enums_1.TaskStatus.ASSIGNED,
            completionPercentage: 0,
            createdById: '00000000-0000-0000-0000-000000000001',
            reviewedById: '00000000-0000-0000-0000-000000000002',
            assignedEmployeeId: '00000000-0000-0000-0000-000000000002',
            assignedEmployeeName: 'Marcus Chen',
            createdByName: 'Alexander Vance',
            departmentName: 'Information Technology',
            createdAt: new Date('2026-11-02T09:00:00Z'),
            updatedAt: new Date('2026-11-03T09:00:00Z'),
        },
    ];
    demoComments = [
        {
            id: '30000000-0000-0000-0000-000000000001',
            taskId: '20000000-0000-0000-0000-000000000001',
            userId: '00000000-0000-0000-0000-000000000002',
            userName: 'Marcus Chen',
            comment: 'Remember to index referenceId and foreign keys for sub-second lookup.',
            isInternal: false,
            createdAt: new Date('2026-11-02T11:00:00Z'),
        },
    ];
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(createTaskDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('TSK');
        const taskNumber = referenceId;
        const assigneeId = createTaskDto.assignedEmployeeId || createTaskDto.leadAssigneeId || null;
        if (this.prisma.isConnected) {
            const newTask = await this.prisma.task.create({
                data: {
                    referenceId,
                    taskNumber,
                    title: createTaskDto.title.trim(),
                    description: createTaskDto.description?.trim() || null,
                    departmentId: createTaskDto.departmentId || user.departmentId || null,
                    teamId: createTaskDto.teamId || null,
                    projectId: createTaskDto.projectId || null,
                    priority: createTaskDto.priority || 'MEDIUM',
                    category: createTaskDto.category || 'General',
                    startDate: new Date(createTaskDto.startDate),
                    dueDate: new Date(createTaskDto.dueDate),
                    estimatedHours: createTaskDto.estimatedHours ? createTaskDto.estimatedHours : 0,
                    actualHours: 0,
                    status: createTaskDto.status || enums_1.TaskStatus.ASSIGNED,
                    completionPercentage: 0,
                    createdById: user.id,
                    reviewedById: createTaskDto.reviewerId || null,
                },
            });
            if (assigneeId) {
                await this.prisma.taskAssignment.create({
                    data: {
                        taskId: newTask.id,
                        employeeId: assigneeId,
                        assignedById: user.id,
                    },
                });
                if (this.notificationsService) {
                    this.notificationsService.createNotification({
                        userId: assigneeId,
                        title: 'Task Assigned',
                        message: `You were assigned as lead to task ${newTask.referenceId}: "${newTask.title}"`,
                        type: 'TASK_ASSIGNED',
                        link: '/tasks',
                    });
                }
            }
            if (createTaskDto.collaboratorIds && createTaskDto.collaboratorIds.length > 0 && this.notificationsService) {
                for (const colId of createTaskDto.collaboratorIds) {
                    this.notificationsService.createNotification({
                        userId: colId,
                        title: 'Task Collaboration',
                        message: `You were added as a collaborator to task ${newTask.referenceId}: "${newTask.title}"`,
                        type: 'TASK_ASSIGNED',
                        link: '/tasks',
                    });
                }
            }
            if (createTaskDto.dependsOnTaskId) {
                await this.prisma.taskDependency.create({
                    data: {
                        taskId: newTask.id,
                        dependsOnTaskId: createTaskDto.dependsOnTaskId,
                    },
                });
            }
            return this.findById(newTask.id);
        }
        const newTask = {
            id: crypto.randomUUID(),
            referenceId,
            taskNumber,
            title: createTaskDto.title.trim(),
            description: createTaskDto.description?.trim() || '',
            departmentId: createTaskDto.departmentId || user.departmentId || null,
            teamId: createTaskDto.teamId || null,
            projectId: createTaskDto.projectId || null,
            priority: createTaskDto.priority || 'MEDIUM',
            category: createTaskDto.category || 'General',
            startDate: new Date(createTaskDto.startDate),
            dueDate: new Date(createTaskDto.dueDate),
            estimatedHours: createTaskDto.estimatedHours ? createTaskDto.estimatedHours.toFixed(2) : '0.00',
            actualHours: '0.00',
            status: createTaskDto.status || enums_1.TaskStatus.ASSIGNED,
            completionPercentage: 0,
            createdById: user.id,
            createdByName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User',
            reviewedById: createTaskDto.reviewerId || null,
            assignedEmployeeId: assigneeId || user.id,
            assignedEmployeeName: assigneeId ? 'Assigned Employee' : 'Self',
            departmentName: 'Operations',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        if (assigneeId && this.notificationsService) {
            this.notificationsService.createNotification({
                userId: assigneeId,
                title: 'Task Assigned',
                message: `You were assigned as lead to task ${newTask.referenceId}: "${newTask.title}"`,
                type: 'TASK',
                link: '/tasks',
            });
        }
        this.demoTasks.unshift(newTask);
        return newTask;
    }
    async findAll(query, user) {
        if (this.prisma.isConnected) {
            const where = {};
            if (query.status) {
                where.status = query.status;
            }
            if (query.priority) {
                where.priority = query.priority;
            }
            if (query.departmentId) {
                where.departmentId = query.departmentId;
            }
            if (query.teamId) {
                where.teamId = query.teamId;
            }
            if (query.category) {
                where.category = query.category;
            }
            if (query.search) {
                const pattern = query.search.trim();
                where.OR = [
                    { title: { contains: pattern, mode: 'insensitive' } },
                    { referenceId: { contains: pattern, mode: 'insensitive' } },
                    { description: { contains: pattern, mode: 'insensitive' } },
                ];
            }
            const rows = await this.prisma.task.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            });
            const now = new Date();
            return rows.map((t) => ({
                ...t,
                isOverdue: t.status !== enums_1.TaskStatus.COMPLETED &&
                    t.status !== enums_1.TaskStatus.CANCELLED &&
                    t.dueDate &&
                    new Date(t.dueDate) < now,
            }));
        }
        const now = new Date();
        return this.demoTasks
            .filter((t) => {
            if (query.status && t.status !== query.status)
                return false;
            if (query.priority && t.priority !== query.priority)
                return false;
            if (query.departmentId && t.departmentId !== query.departmentId)
                return false;
            if (query.search) {
                const q = query.search.toLowerCase();
                return (t.title.toLowerCase().includes(q) ||
                    t.referenceId.toLowerCase().includes(q) ||
                    t.description?.toLowerCase().includes(q));
            }
            return true;
        })
            .map((t) => ({
            ...t,
            isOverdue: t.status !== enums_1.TaskStatus.COMPLETED &&
                t.status !== enums_1.TaskStatus.CANCELLED &&
                new Date(t.dueDate) < now,
        }));
    }
    async findById(id) {
        if (this.prisma.isConnected) {
            const task = await this.prisma.task.findFirst({
                where: {
                    OR: [{ id }, { referenceId: id }],
                },
                include: {
                    assignments: {
                        include: { employee: true },
                    },
                    comments: {
                        include: { author: true },
                        orderBy: { createdAt: 'desc' },
                    },
                    dependencies: true,
                },
            });
            if (!task) {
                throw new common_1.NotFoundException(`Task with ID or Reference '${id}' not found`);
            }
            const assignments = task.assignments.map((a) => ({
                id: a.id,
                employeeId: a.employeeId,
                assignedById: a.assignedById,
                assignedAt: a.assignedAt,
                employeeFirstName: a.employee?.firstName,
                employeeLastName: a.employee?.lastName,
                employeeEmail: a.employee?.email,
            }));
            const comments = task.comments.map((c) => ({
                id: c.id,
                comment: c.comment,
                isInternal: false,
                createdAt: c.createdAt,
                authorFirstName: c.author?.firstName,
                authorLastName: c.author?.lastName,
                authorRole: c.author?.roleCode,
            }));
            const now = new Date();
            return {
                ...task,
                isOverdue: task.status !== enums_1.TaskStatus.COMPLETED &&
                    task.status !== enums_1.TaskStatus.CANCELLED &&
                    task.dueDate &&
                    new Date(task.dueDate) < now,
                assignments,
                comments,
                dependencies: task.dependencies,
            };
        }
        const task = this.demoTasks.find((t) => t.id === id || t.referenceId === id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID or Reference '${id}' not found`);
        }
        const comments = this.demoComments.filter((c) => c.taskId === task.id);
        return {
            ...task,
            isOverdue: task.status !== enums_1.TaskStatus.COMPLETED &&
                task.status !== enums_1.TaskStatus.CANCELLED &&
                new Date(task.dueDate) < new Date(),
            assignments: [
                {
                    employeeId: task.assignedEmployeeId,
                    employeeFirstName: task.assignedEmployeeName?.split(' ')[0] || 'David',
                    employeeLastName: task.assignedEmployeeName?.split(' ')[1] || 'Ross',
                },
            ],
            comments,
            dependencies: [],
        };
    }
    async update(id, updateTaskDto, user) {
        if (this.prisma.isConnected) {
            const existing = await this.prisma.task.findFirst({
                where: { OR: [{ id }, { referenceId: id }] },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Task with ID '${id}' not found`);
            }
            const updateData = {
                updatedAt: new Date(),
            };
            if (updateTaskDto.title)
                updateData.title = updateTaskDto.title.trim();
            if (updateTaskDto.description !== undefined)
                updateData.description = updateTaskDto.description;
            if (updateTaskDto.priority)
                updateData.priority = updateTaskDto.priority;
            if (updateTaskDto.category)
                updateData.category = updateTaskDto.category;
            if (updateTaskDto.status)
                updateData.status = updateTaskDto.status;
            if (updateTaskDto.completionPercentage !== undefined)
                updateData.completionPercentage = updateTaskDto.completionPercentage;
            if (updateTaskDto.estimatedHours !== undefined)
                updateData.estimatedHours = updateTaskDto.estimatedHours;
            if (updateTaskDto.actualHours !== undefined)
                updateData.actualHours = updateTaskDto.actualHours;
            if (updateTaskDto.startDate)
                updateData.startDate = new Date(updateTaskDto.startDate);
            if (updateTaskDto.dueDate)
                updateData.dueDate = new Date(updateTaskDto.dueDate);
            if (updateTaskDto.reviewerId)
                updateData.reviewedById = updateTaskDto.reviewerId;
            if (updateTaskDto.reviewFeedback) {
                updateData.reviewFeedback = updateTaskDto.reviewFeedback;
                updateData.reviewedAt = new Date();
            }
            if (updateTaskDto.status === enums_1.TaskStatus.COMPLETED) {
                updateData.completedAt = new Date();
                updateData.completionPercentage = 100;
            }
            await this.prisma.task.update({
                where: { id: existing.id },
                data: updateData,
            });
            if (updateTaskDto.assignedEmployeeId) {
                await this.prisma.taskAssignment.upsert({
                    where: {
                        taskId_employeeId: {
                            taskId: existing.id,
                            employeeId: updateTaskDto.assignedEmployeeId,
                        },
                    },
                    update: {
                        assignedById: user.id,
                        assignedAt: new Date(),
                    },
                    create: {
                        taskId: existing.id,
                        employeeId: updateTaskDto.assignedEmployeeId,
                        assignedById: user.id,
                    },
                });
            }
            return this.findById(existing.id);
        }
        const task = this.demoTasks.find((t) => t.id === id || t.referenceId === id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID '${id}' not found`);
        }
        Object.assign(task, {
            ...updateTaskDto,
            updatedAt: new Date(),
        });
        if (updateTaskDto.status === enums_1.TaskStatus.COMPLETED) {
            task.completedAt = new Date();
            task.completionPercentage = 100;
        }
        return task;
    }
    async updateStatus(id, dto, user) {
        return this.update(id, {
            status: dto.status,
            completionPercentage: dto.completionPercentage,
            actualHours: dto.actualHours,
            reviewFeedback: dto.feedback,
        }, user);
    }
    async addComment(id, dto, user) {
        const task = await this.findById(id);
        if (this.prisma.isConnected) {
            const newComment = await this.prisma.taskComment.create({
                data: {
                    taskId: task.id,
                    userId: user.id,
                    comment: dto.comment.trim(),
                },
            });
            return newComment;
        }
        const comment = {
            id: crypto.randomUUID(),
            taskId: task.id,
            userId: user.id,
            userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            comment: dto.comment.trim(),
            isInternal: dto.isInternal || false,
            createdAt: new Date(),
        };
        this.demoComments.unshift(comment);
        return comment;
    }
    async getComments(id) {
        const task = await this.findById(id);
        if (this.prisma.isConnected) {
            const comments = await this.prisma.taskComment.findMany({
                where: { taskId: task.id },
                include: { author: true },
                orderBy: { createdAt: 'desc' },
            });
            return comments.map((c) => ({
                id: c.id,
                comment: c.comment,
                isInternal: false,
                createdAt: c.createdAt,
                authorFirstName: c.author?.firstName,
                authorLastName: c.author?.lastName,
                authorRole: c.author?.roleCode,
            }));
        }
        return this.demoComments.filter((c) => c.taskId === task.id);
    }
    async getKanbanBoard(user) {
        const allTasks = await this.findAll({}, user);
        const backlog = allTasks.filter((t) => t.status === enums_1.TaskStatus.DRAFT ||
            t.status === enums_1.TaskStatus.ASSIGNED ||
            t.status === enums_1.TaskStatus.ACCEPTED);
        const inProgress = allTasks.filter((t) => t.status === enums_1.TaskStatus.IN_PROGRESS || t.status === enums_1.TaskStatus.ON_HOLD);
        const review = allTasks.filter((t) => t.status === enums_1.TaskStatus.PENDING_REVIEW);
        const completed = allTasks.filter((t) => t.status === enums_1.TaskStatus.COMPLETED);
        return {
            backlog,
            inProgress,
            review,
            completed,
            stats: {
                total: allTasks.length,
                backlogCount: backlog.length,
                inProgressCount: inProgress.length,
                reviewCount: review.length,
                completedCount: completed.length,
                overdueCount: allTasks.filter((t) => t.isOverdue).length,
            },
        };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map