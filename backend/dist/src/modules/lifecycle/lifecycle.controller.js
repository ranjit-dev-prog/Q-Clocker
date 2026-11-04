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
exports.LifecycleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lifecycle_service_1 = require("./lifecycle.service");
const lifecycle_dto_1 = require("./dto/lifecycle.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
let LifecycleController = class LifecycleController {
    lifecycleService;
    constructor(lifecycleService) {
        this.lifecycleService = lifecycleService;
    }
    async getCelebrations() {
        return this.lifecycleService.getCelebrationsFeed();
    }
    async congratulate(id, user) {
        return this.lifecycleService.congratulate(id, user);
    }
    async getReminders(urgency) {
        return this.lifecycleService.getReminders(urgency);
    }
    async notifyReminder(id, actor) {
        return this.lifecycleService.sendReminderNotification(id, actor);
    }
    async extendProbation(id, dto, actor) {
        return this.lifecycleService.extendProbation(id, dto, actor);
    }
    async resolveReminder(id) {
        return this.lifecycleService.resolveReminder(id);
    }
};
exports.LifecycleController = LifecycleController;
__decorate([
    (0, common_1.Get)('celebrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get corporate celebrations feed (Birthdays, Milestones, Anniversaries)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "getCelebrations", null);
__decorate([
    (0, common_1.Post)('events/:id/congratulate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send 1-click peer congratulations on a work anniversary or birthday' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "congratulate", null);
__decorate([
    (0, common_1.Get)('reminders'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Dedicated HR Reminders Console (Probation, Contract, Document Expiry)' }),
    __param(0, (0, common_1.Query)('urgency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "getReminders", null);
__decorate([
    (0, common_1.Post)('reminders/:id/notify'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Dispatch urgent push notification reminder to employee and manager' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "notifyReminder", null);
__decorate([
    (0, common_1.Post)('reminders/:id/extend-probation'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Extend employee probation period with mandatory audit reason' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lifecycle_dto_1.ExtendProbationDto, Object]),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "extendProbation", null);
__decorate([
    (0, common_1.Post)('reminders/:id/resolve'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Mark compliance/probation reminder as resolved' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LifecycleController.prototype, "resolveReminder", null);
exports.LifecycleController = LifecycleController = __decorate([
    (0, swagger_1.ApiTags)('Workforce Lifecycle & Compliance'),
    (0, common_1.Controller)('lifecycle'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lifecycle_service_1.LifecycleService])
], LifecycleController);
//# sourceMappingURL=lifecycle.controller.js.map