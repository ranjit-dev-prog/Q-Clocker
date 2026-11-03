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
exports.WorkLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const work_logs_service_1 = require("./work-logs.service");
const create_work_log_dto_1 = require("./dto/create-work-log.dto");
const work_log_query_dto_1 = require("./dto/work-log-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let WorkLogsController = class WorkLogsController {
    workLogsService;
    constructor(workLogsService) {
        this.workLogsService = workLogsService;
    }
    async create(createWorkLogDto, user) {
        return this.workLogsService.create(createWorkLogDto, user);
    }
    async findAll(query, user) {
        return this.workLogsService.findAll(query, user);
    }
    async getDailySummary(date, user) {
        const targetDate = date || new Date().toISOString().substring(0, 10);
        return this.workLogsService.getDailySummary(targetDate, user);
    }
    async findOne(id) {
        return this.workLogsService.findById(id);
    }
};
exports.WorkLogsController = WorkLogsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create daily activity work log with random WLG reference' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Work log recorded' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_work_log_dto_1.CreateWorkLogDto, Object]),
    __metadata("design:returntype", Promise)
], WorkLogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List employee work logs with optional date or task filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns work logs' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [work_log_query_dto_1.WorkLogQueryDto, Object]),
    __metadata("design:returntype", Promise)
], WorkLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('daily-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregated hours and employee activity for a given date' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Daily summary' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkLogsController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get work log details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Work log details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Work log not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkLogsController.prototype, "findOne", null);
exports.WorkLogsController = WorkLogsController = __decorate([
    (0, swagger_1.ApiTags)('Daily Work Logs'),
    (0, common_1.Controller)('work-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [work_logs_service_1.WorkLogsService])
], WorkLogsController);
//# sourceMappingURL=work-logs.controller.js.map