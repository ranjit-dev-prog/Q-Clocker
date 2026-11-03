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
    async getMetrics() {
        return this.ticketsService.getMetrics();
    }
    async findOne(id) {
        return this.ticketsService.findById(id);
    }
    async update(id, updateTicketDto, user) {
        return this.ticketsService.update(id, updateTicketDto, user);
    }
    async resolve(id, dto, user) {
        return this.ticketsService.resolve(id, dto, user);
    }
    async addComment(id, dto, user) {
        return this.ticketsService.addComment(id, dto, user);
    }
};
exports.TicketsController = TicketsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create an IT service ticket with random TKT reference and SLA calculation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ticket created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List and filter tickets by status, category, priority, or technician' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns filtered ticket list with SLA breach flags' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ticket_query_dto_1.TicketQueryDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ITSM & SLA compliance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SLA compliance and ticket volumes' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full ticket details, history audit log, and comments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket details, assign technician, or change priority' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve an incident ticket with root-cause and fix summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ticket marked resolved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ticket_dto_1.ResolveTicketDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a user comment or internal technician note to a ticket' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Comment logged' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ticket_comment_dto_1.CreateTicketCommentDto, Object]),
    __metadata("design:returntype", Promise)
], TicketsController.prototype, "addComment", null);
exports.TicketsController = TicketsController = __decorate([
    (0, swagger_1.ApiTags)('ITSM Ticket Management'),
    (0, common_1.Controller)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [tickets_service_1.TicketsService])
], TicketsController);
//# sourceMappingURL=tickets.controller.js.map