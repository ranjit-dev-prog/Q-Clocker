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
var PermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const enums_1 = require("../enums");
let PermissionsGuard = class PermissionsGuard {
    static { PermissionsGuard_1 = this; }
    reflector;
    dbService;
    static DEFAULT_ROLE_PERMISSIONS = {
        SUPER_ADMIN: ['*'],
        ADMIN: [
            'task.create',
            'task.assign',
            'task.update',
            'task.approve',
            'ticket.create',
            'ticket.assign',
            'ticket.escalate',
            'ticket.resolve',
            'attendance.record',
            'attendance.correct',
            'timesheet.submit',
            'timesheet.approve',
            'employee.manage',
            'department.manage',
            'report.export',
            'audit.view',
        ],
        TEAM_LEAD: [
            'task.create',
            'task.assign',
            'task.update',
            'task.approve',
            'ticket.create',
            'ticket.assign',
            'ticket.resolve',
            'attendance.record',
            'timesheet.submit',
            'timesheet.approve',
            'report.export',
        ],
        EMPLOYEE: [
            'task.update',
            'ticket.create',
            'attendance.record',
            'timesheet.submit',
        ],
        AUDITOR: [
            'audit.view',
            'report.export',
        ],
    };
    constructor(reflector, dbService) {
        this.reflector = reflector;
        this.dbService = dbService;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication token missing or invalid');
        }
        const userRoleCode = user.role || user.roleCode;
        if (userRoleCode === enums_1.UserRole.SUPER_ADMIN || userRoleCode === 'SUPER_ADMIN') {
            return true;
        }
        const userPermissions = await this.getUserPermissions(user.roleId, userRoleCode);
        const hasAll = requiredPermissions.every((perm) => userPermissions.includes(perm) || userPermissions.includes('*'));
        if (!hasAll) {
            throw new common_1.ForbiddenException(`Insufficient privileges: Missing required permission(s) [${requiredPermissions.join(', ')}]`);
        }
        return true;
    }
    async getUserPermissions(roleId, roleCode) {
        if (this.dbService.getConnectionStatus() && roleId) {
            try {
                const rows = await this.dbService.db
                    .select({ code: schema.permissions.code })
                    .from(schema.rolePermissions)
                    .innerJoin(schema.permissions, (0, drizzle_orm_1.eq)(schema.rolePermissions.permissionId, schema.permissions.id))
                    .where((0, drizzle_orm_1.eq)(schema.rolePermissions.roleId, roleId));
                if (rows.length > 0) {
                    return rows.map((r) => r.code);
                }
            }
            catch {
            }
        }
        if (roleCode && PermissionsGuard_1.DEFAULT_ROLE_PERMISSIONS[roleCode]) {
            return PermissionsGuard_1.DEFAULT_ROLE_PERMISSIONS[roleCode];
        }
        return [];
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = PermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        database_service_1.DatabaseService])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map