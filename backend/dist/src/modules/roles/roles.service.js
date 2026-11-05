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
var RolesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const crypto = require("crypto");
let RolesService = class RolesService {
    static { RolesService_1 = this; }
    prisma;
    static SYSTEM_ROLES = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            code: 'SUPER_ADMIN',
            name: 'Super Administrator',
            description: 'Complete organizational control across all departments and configuration',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            code: 'ADMIN',
            name: 'Administrator',
            description: 'Organizational administration, user management, and operational workflows',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            code: 'HR_MANAGER',
            name: 'HR Manager',
            description: 'Human resources administration, employee lifecycle, and attendance oversight',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            code: 'HR_EXECUTIVE',
            name: 'HR Executive',
            description: 'Employee onboarding, records management, and document verification',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000005',
            code: 'IT_MANAGER',
            name: 'IT Manager',
            description: 'IT operations, infrastructure, ticket dispatch, and security response',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000006',
            code: 'IT_EXECUTIVE',
            name: 'IT Executive',
            description: 'Technical support, incident resolution, and hardware/software assets',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000007',
            code: 'TEAM_LEAD',
            name: 'Team Lead',
            description: 'Sprint planning, task assignment, progress review, and timesheet approvals',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000008',
            code: 'EMPLOYEE',
            name: 'Employee',
            description: 'Task execution, timesheet logging, ticketing, and performance review',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000009',
            code: 'AUDITOR',
            name: 'Compliance Auditor',
            description: 'Read-only audit and compliance inspection access across all operational logs',
            isSystem: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000010',
            code: 'READ_ONLY',
            name: 'Read Only Viewer',
            description: 'Restricted read-only access for external guests or stakeholders',
            isSystem: true,
        },
    ];
    customRoles = [];
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        if (this.prisma.isConnected) {
            const dbRoles = await this.prisma.role.findMany();
            if (dbRoles.length > 0) {
                return dbRoles.map((r) => ({
                    ...r,
                    permissionCount: permissions_guard_1.PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.length || 0,
                }));
            }
        }
        const all = [...RolesService_1.SYSTEM_ROLES, ...this.customRoles];
        return all.map((r) => ({
            ...r,
            permissionCount: permissions_guard_1.PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.length ||
                (permissions_guard_1.PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.includes('*') ? 40 : 0),
        }));
    }
    async findOne(id) {
        if (this.prisma.isConnected) {
            const role = await this.prisma.role.findFirst({
                where: {
                    OR: [{ id }, { code: id }],
                },
            });
            if (role) {
                return {
                    ...role,
                    permissions: permissions_guard_1.PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[role.code] || [],
                };
            }
        }
        const role = RolesService_1.SYSTEM_ROLES.find((r) => r.id === id || r.code === id) ||
            this.customRoles.find((r) => r.id === id || r.code === id);
        if (!role) {
            throw new common_1.NotFoundException(`Role '${id}' not found`);
        }
        return {
            ...role,
            permissions: permissions_guard_1.PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[role.code] || [],
        };
    }
    async create(dto) {
        const code = dto.code.toUpperCase().replace(/\s+/g, '_');
        if (this.prisma.isConnected) {
            const existing = await this.prisma.role.findUnique({
                where: { code },
            });
            if (existing) {
                throw new common_1.ConflictException(`Role with code '${code}' already exists`);
            }
            const newRole = await this.prisma.role.create({
                data: {
                    name: dto.name.trim(),
                    code,
                    description: dto.description?.trim() || null,
                    isSystem: false,
                },
            });
            return newRole;
        }
        const existing = [...RolesService_1.SYSTEM_ROLES, ...this.customRoles].find((r) => r.code === code);
        if (existing) {
            throw new common_1.ConflictException(`Role with code '${code}' already exists`);
        }
        const newRole = {
            id: crypto.randomUUID(),
            name: dto.name.trim(),
            code,
            description: dto.description?.trim() || null,
            isSystem: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.customRoles.push(newRole);
        return newRole;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map