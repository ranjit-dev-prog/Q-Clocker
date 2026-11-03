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
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
let TasksService = TasksService_1 = class TasksService {
    dbService;
    logger = new common_1.Logger(TasksService_1.name);
    demoTasks = [
        {
            id: '20000000-0000-0000-0000-000000000001',
            referenceId: 'TSK-9X4K21',
            taskNumber: 'TSK-9X4K21',
            title: 'Implement Drizzle ORM Schema & Relational Models',
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
    constructor(dbService) {
        this.dbService = dbService;
    }
    async create(createTaskDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('TSK');
        const taskNumber = referenceId;
        if (this.dbService.getConnectionStatus()) {
            const [newTask] = await this.dbService.db
                .insert(schema.tasks)
                .values({
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
                estimatedHours: createTaskDto.estimatedHours ? createTaskDto.estimatedHours.toFixed(2) : '0.00',
                actualHours: '0.00',
                status: createTaskDto.status || enums_1.TaskStatus.ASSIGNED,
                completionPercentage: 0,
                createdById: user.id,
                reviewedById: createTaskDto.reviewerId || null,
            })
                .returning();
            if (createTaskDto.assignedEmployeeId) {
                await this.dbService.db.insert(schema.taskAssignments).values({
                    taskId: newTask.id,
                    employeeId: createTaskDto.assignedEmployeeId,
                    assignedById: user.id,
                });
            }
            if (createTaskDto.dependsOnTaskId) {
                await this.dbService.db.insert(schema.taskDependencies).values({
                    taskId: newTask.id,
                    dependsOnTaskId: createTaskDto.dependsOnTaskId,
                    dependencyType: 'BLOCKS',
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
            assignedEmployeeId: createTaskDto.assignedEmployeeId || user.id,
            assignedEmployeeName: createTaskDto.assignedEmployeeId ? 'Assigned Employee' : 'Self',
            departmentName: 'Operations',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.demoTasks.unshift(newTask);
        return newTask;
    }
    async findAll(query, user) {
        if (this.dbService.getConnectionStatus()) {
            const conditions = [];
            if (query.status) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tasks.status, query.status));
            }
            if (query.priority) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tasks.priority, query.priority));
            }
            if (query.departmentId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tasks.departmentId, query.departmentId));
            }
            if (query.teamId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tasks.teamId, query.teamId));
            }
            if (query.category) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tasks.category, query.category));
            }
            if (query.search) {
                const searchPattern = `%${query.search.trim()}%`;
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.tasks.title, searchPattern), (0, drizzle_orm_1.ilike)(schema.tasks.referenceId, searchPattern), (0, drizzle_orm_1.ilike)(schema.tasks.description, searchPattern)));
            }
            if (user.role === enums_1.UserRole.EMPLOYEE) {
            }
            const rows = await this.dbService.db
                .select({
                id: schema.tasks.id,
                referenceId: schema.tasks.referenceId,
                taskNumber: schema.tasks.taskNumber,
                title: schema.tasks.title,
                description: schema.tasks.description,
                priority: schema.tasks.priority,
                category: schema.tasks.category,
                status: schema.tasks.status,
                completionPercentage: schema.tasks.completionPercentage,
                startDate: schema.tasks.startDate,
                dueDate: schema.tasks.dueDate,
                estimatedHours: schema.tasks.estimatedHours,
                actualHours: schema.tasks.actualHours,
                createdById: schema.tasks.createdById,
                reviewedById: schema.tasks.reviewedById,
                departmentId: schema.tasks.departmentId,
                teamId: schema.tasks.teamId,
                createdAt: schema.tasks.createdAt,
                updatedAt: schema.tasks.updatedAt,
            })
                .from(schema.tasks)
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(schema.tasks.createdAt));
            const now = new Date();
            return rows.map((t) => ({
                ...t,
                isOverdue: t.status !== enums_1.TaskStatus.COMPLETED &&
                    t.status !== enums_1.TaskStatus.CANCELLED &&
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
        if (this.dbService.getConnectionStatus()) {
            const [task] = await this.dbService.db
                .select()
                .from(schema.tasks)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tasks.id, id), (0, drizzle_orm_1.eq)(schema.tasks.referenceId, id)))
                .limit(1);
            if (!task) {
                throw new common_1.NotFoundException(`Task with ID or Reference '${id}' not found`);
            }
            const assignments = await this.dbService.db
                .select({
                id: schema.taskAssignments.id,
                employeeId: schema.taskAssignments.employeeId,
                assignedById: schema.taskAssignments.assignedById,
                assignedAt: schema.taskAssignments.assignedAt,
                employeeFirstName: schema.users.firstName,
                employeeLastName: schema.users.lastName,
                employeeEmail: schema.users.email,
            })
                .from(schema.taskAssignments)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.taskAssignments.employeeId, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.taskAssignments.taskId, task.id));
            const comments = await this.dbService.db
                .select({
                id: schema.taskComments.id,
                comment: schema.taskComments.comment,
                isInternal: schema.taskComments.isInternal,
                createdAt: schema.taskComments.createdAt,
                authorFirstName: schema.users.firstName,
                authorLastName: schema.users.lastName,
                authorRole: schema.users.roleCode,
            })
                .from(schema.taskComments)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.taskComments.userId, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.taskComments.taskId, task.id))
                .orderBy((0, drizzle_orm_1.desc)(schema.taskComments.createdAt));
            const dependencies = await this.dbService.db
                .select()
                .from(schema.taskDependencies)
                .where((0, drizzle_orm_1.eq)(schema.taskDependencies.taskId, task.id));
            const now = new Date();
            return {
                ...task,
                isOverdue: task.status !== enums_1.TaskStatus.COMPLETED &&
                    task.status !== enums_1.TaskStatus.CANCELLED &&
                    new Date(task.dueDate) < now,
                assignments,
                comments,
                dependencies,
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
        if (this.dbService.getConnectionStatus()) {
            const [existing] = await this.dbService.db
                .select()
                .from(schema.tasks)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tasks.id, id), (0, drizzle_orm_1.eq)(schema.tasks.referenceId, id)))
                .limit(1);
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
                updateData.estimatedHours = updateTaskDto.estimatedHours.toFixed(2);
            if (updateTaskDto.actualHours !== undefined)
                updateData.actualHours = updateTaskDto.actualHours.toFixed(2);
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
            await this.dbService.db
                .update(schema.tasks)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tasks.id, existing.id));
            if (updateTaskDto.assignedEmployeeId) {
                await this.dbService.db.insert(schema.taskAssignments).values({
                    taskId: existing.id,
                    employeeId: updateTaskDto.assignedEmployeeId,
                    assignedById: user.id,
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
        if (this.dbService.getConnectionStatus()) {
            const [newComment] = await this.dbService.db
                .insert(schema.taskComments)
                .values({
                taskId: task.id,
                userId: user.id,
                comment: dto.comment.trim(),
                isInternal: dto.isInternal || false,
            })
                .returning();
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
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db
                .select({
                id: schema.taskComments.id,
                comment: schema.taskComments.comment,
                isInternal: schema.taskComments.isInternal,
                createdAt: schema.taskComments.createdAt,
                authorFirstName: schema.users.firstName,
                authorLastName: schema.users.lastName,
                authorRole: schema.users.roleCode,
            })
                .from(schema.taskComments)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.taskComments.userId, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.taskComments.taskId, task.id))
                .orderBy((0, drizzle_orm_1.desc)(schema.taskComments.createdAt));
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
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map