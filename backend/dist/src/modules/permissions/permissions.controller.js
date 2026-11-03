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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async findAll() {
        return this.permissionsService.findAll();
    }
    async getMatrix() {
        return this.permissionsService.getMatrix();
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'List all available granular system permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of permissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('matrix'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN, enums_1.UserRole.AUDITOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get full permission matrix by role and capability' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permission matrix' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getMatrix", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map