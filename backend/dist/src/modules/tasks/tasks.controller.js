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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const task_query_dto_1 = require("./dto/task-query.dto");
const task_comment_dto_1 = require("./dto/task-comment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(createTaskDto, user) {
        return this.tasksService.create(createTaskDto, user);
    }
    async findAll(query, user) {
        return this.tasksService.findAll(query, user);
    }
    async getKanban(user) {
        return this.tasksService.getKanbanBoard(user);
    }
    async findOne(id) {
        return this.tasksService.findById(id);
    }
    async update(id, updateTaskDto, user) {
        return this.tasksService.update(id, updateTaskDto, user);
    }
    async updateStatus(id, dto, user) {
        return this.tasksService.updateStatus(id, dto, user);
    }
    async addComment(id, dto, user) {
        return this.tasksService.addComment(id, dto, user);
    }
    async getComments(id) {
        return this.tasksService.getComments(id);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new enterprise task with random TSK reference' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter tasks by status, department, priority, or keyword' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns filtered task list' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_query_dto_1.TaskQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('kanban'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Kanban board with columns: Backlog, In Progress, Review, Completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns grouped tasks for Kanban UI' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getKanban", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete task details, assignments, comments and dependencies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task properties, assignee, dates, or estimates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task status via Kanban drag-and-drop' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a comment or internal note to a task' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment recorded' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_comment_dto_1.CreateTaskCommentDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id/comments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments for a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of comments' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getComments", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Task Management'),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map