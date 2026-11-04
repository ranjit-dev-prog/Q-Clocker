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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_query_dto_1 = require("./dto/user-query.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const enums_1 = require("../../common/enums");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAdminDashboardMetrics() {
        return this.usersService.getAdminDashboardMetrics();
    }
    getImportTemplate() {
        return this.usersService.getImportTemplate();
    }
    previewImport(body, actor) {
        return this.usersService.previewImport(body.csvContent, actor);
    }
    confirmImport(body, actor) {
        return this.usersService.confirmImport(body.rows, actor);
    }
    async create(createUserDto, actor) {
        return this.usersService.create(createUserDto, actor);
    }
    async findAll(query) {
        return this.usersService.findAll(query);
    }
    async findOne(id) {
        return this.usersService.findOne(id);
    }
    async update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async archive(id, actor) {
        return this.usersService.archive(id, actor);
    }
    async reactivate(id) {
        return this.usersService.reactivate(id);
    }
    async remove(id) {
        return this.usersService.remove(id);
    }
    async findSubordinates(id) {
        return this.usersService.findSubordinates(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('admin-dashboard'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Enterprise Admin Dashboard Metrics (Employee, Role, Department distributions)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aggregated workforce metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAdminDashboardMetrics", null);
__decorate([
    (0, common_1.Get)('import/template'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="employee_import_template.csv"'),
    (0, swagger_1.ApiOperation)({ summary: 'Download employee bulk import CSV template' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getImportTemplate", null);
__decorate([
    (0, common_1.Post)('import/preview'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Preview and validate CSV employee import with formula injection sanitization' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "previewImport", null);
__decorate([
    (0, common_1.Post)('import/confirm'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Execute batch employee import' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "confirmImport", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new employee account (Super Admin / Admin / HR Manager)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Employee created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden: Insufficient privileges' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.SYSTEM_ADMINISTRATOR, enums_1.UserRole.HR_MANAGER, enums_1.UserRole.HR_ADMINISTRATOR, enums_1.UserRole.HR_EXECUTIVE, enums_1.UserRole.IT_MANAGER, enums_1.UserRole.IT_EXECUTIVE, enums_1.UserRole.DEPARTMENT_MANAGER, enums_1.UserRole.TEAM_LEAD, enums_1.UserRole.EMPLOYEE, enums_1.UserRole.AUDITOR, enums_1.UserRole.READ_ONLY, enums_1.UserRole.VIEWER),
    (0, swagger_1.ApiOperation)({ summary: 'List employees with optional filters (Search, Role, Department, Active)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of employees returned' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_query_dto_1.UserQueryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee details by UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee profile returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee account details (Super Admin / Admin / HR Manager)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Safely archive an employee without destroying audit or timesheet history' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "archive", null);
__decorate([
    (0, common_1.Post)(':id/reactivate'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.HR_MANAGER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate an archived employee account' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft-delete employee (Super Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee deactivated and archived' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden: Super Admin only' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/subordinates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get team members/subordinates managed by this employee' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of subordinates' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findSubordinates", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Employees'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map