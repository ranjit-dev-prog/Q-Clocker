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
exports.TicketsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tickets_service_1 = require("./tickets.service");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const update_ticket_dto_1 = require("./dto/update-ticket.dto");
const ticket_query_dto_1 = require("./dto/ticket-query.dto");
const ticket_comment_dto_1 = require("./dto/ticket-comment.dto");
const ticket_time_entry_dto_1 = require("./dto/ticket-time-entry.dto");
const ticket_task_link_dto_1 = require("./dto/ticket-task-link.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TicketsController = class TicketsController {
    ticketsService;
    constructor(ticketsService) {
        this.ticketsService = ticketsService;
    }
    async create(createTicketDto, user) {
        return this.ticketsService.create(createTicketDto, user);
    }
    async findAll(query, user) {
        return this.ticketsService.findAll(query, user);
    }
    async getCategories() {
        return this.ticketsService.getCategories();
    }
    async getMetrics() {
        return this.ticketsService.getMetrics();
    }
    async findOne(id, user) {
        return this.ticketsService.findById(id, user);
    }
    async update(id, updateTicketDto, user) {
        return this.ticketsService.update(id, updateTicketDto, user);
    }
    async transition(id, dto, user) {
        return this.ticketsService.transitionStatus(id, dto, user);
    }
    async assign(id, dto, user) {
        return this.ticketsService.assign(id, dto, user);
    }
    async escalate(id, dto, user) {
        return this.ticketsService.escalate(id, dto, user);
    }
    async resolve(id, dto, user) {
        return this.ticketsService.resolve(id, dto, user);
    }
    async reopen(id, dto, user) {
        return this.ticketsService.reopen(id, dto, user);
    }
    async addComment(id, dto, user) {
        return this.ticketsService.addComment(id, dto, user);
    }
    async startTimer(id, user, dto) {
        return this.ticketsService.startTimer(id, user, dto);
    }
    async stopTimer(id, user) {
        return this.ticketsService.stopTimer(id, user);
    }
    async addManualTimeEntry(id, dto, user) {
        return this.ticketsService.addManualTimeEntry(id, dto, user);
    }
    async createTaskFromTicket(id, dto, user) {
        return this.ticketsService.createTaskFromTicket(id, dto, user);
    }
    async linkExistingTask(id, dto, user) {
        return this.ticketsService.linkExistingTask(id, dto, user);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create an IT service ticket with random TKT reference, priority matrix and SLA' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ticket created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter tickets by status, category, priority, SLA status, or keyword' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns filtered ticket list with live SLA calculations' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_query_dto_1.TicketQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get IT service category catalog and subcategories with default SLAs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Category and subcategory hierarchy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ITSM executive KPIs, SLA compliance rates, and operational metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Executive ITSM metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full ticket details, history audit log, linked tasks, and time entries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket properties' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/transition'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Transition ticket lifecycle status through validated state machine' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket status transitioned' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.TransitionTicketStatusDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "transition", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Assign or reassign ticket to a technician and/or support team' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket assignment updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.AssignTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)(':id/escalate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Escalate ticket to a higher management tier or specialized team' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket escalated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.EscalateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "escalate", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an incident ticket with mandatory root-cause and fix summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket marked resolved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.ResolveTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/reopen'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reopen a previously resolved ticket with mandatory reason' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket reopened' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.ReopenTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "reopen", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a public reply or internal technician note' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment logged' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_comment_dto_1.CreateTicketCommentDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addComment", null);
__decorate([
    (0, common_1.Post)(':id/timer/start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start a live triage/fix stopwatch timer for this ticket' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Timer started' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ticket_time_entry_dto_1.StartTicketTimerDto]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "startTimer", null);
__decorate([
    (0, common_1.Post)(':id/timer/stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Stop the active triage/fix stopwatch timer and persist duration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Timer stopped and duration recorded' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "stopTimer", null);
__decorate([
    (0, common_1.Post)(':id/time-entries'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a manual time log entry to this ticket' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Time entry created' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_time_entry_dto_1.CreateTicketTimeEntryDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addManualTimeEntry", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a downstream action task from this ticket' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created and linked' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_task_link_dto_1.CreateTaskFromTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "createTaskFromTicket", null);
__decorate([
    (0, common_1.Post)(':id/link-task'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Link an existing task to this ticket' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task linked successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_task_link_dto_1.LinkExistingTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "linkExistingTask", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('ITSM Ticket Management'),
    (0, common_1.Controller)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map