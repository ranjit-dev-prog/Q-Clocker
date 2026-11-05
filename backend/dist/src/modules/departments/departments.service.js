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
var DepartmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const crypto = require("crypto");
let DepartmentsService = DepartmentsService_1 = class DepartmentsService {
    prisma;
    logger = new common_1.Logger(DepartmentsService_1.name);
    memoryDepts = [
        {
            id: '10000000-0000-0000-0000-000000000001',
            name: 'Information Technology',
            code: 'IT',
            description: 'Enterprise IT infrastructure, helpdesk, network operations and cybersecurity',
            managerId: '00000000-0000-0000-0000-000000000002',
            managerName: 'Marcus Chen',
            memberCount: 12,
            teamCount: 2,
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
        {
            id: '10000000-0000-0000-0000-000000000002',
            name: 'Software Engineering',
            code: 'ENG',
            description: 'Core product engineering, platform development, API architecture and QA',
            managerId: '00000000-0000-0000-0000-000000000003',
            managerName: 'Sarah Jenkins',
            memberCount: 24,
            teamCount: 3,
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
        {
            id: '10000000-0000-0000-0000-000000000003',
            name: 'Operations & Facilities',
            code: 'OPS',
            description: 'Business continuity, facilities, vendor relationships and client delivery',
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            memberCount: 8,
            teamCount: 1,
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
        {
            id: '10000000-0000-0000-0000-000000000004',
            name: 'Human Resources',
            code: 'HR',
            description: 'Talent acquisition, employee satisfaction, compensation and organizational policy',
            managerId: null,
            managerName: 'Emma Watson',
            memberCount: 4,
            teamCount: 1,
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
    ];
    memoryTeams = [
        {
            id: '20000000-0000-0000-0000-000000000001',
            departmentId: '10000000-0000-0000-0000-000000000002',
            name: 'Backend Core Squad',
            description: 'High-throughput microservices and relational data pipelines',
            leadId: '00000000-0000-0000-0000-000000000003',
            leadName: 'Sarah Jenkins',
            isActive: true,
        },
        {
            id: '20000000-0000-0000-0000-000000000002',
            departmentId: '10000000-0000-0000-0000-000000000002',
            name: 'Frontend Design Systems',
            description: 'Angular architecture, responsive dashboards, and microfrontends',
            leadId: null,
            leadName: 'Unassigned',
            isActive: true,
        },
        {
            id: '20000000-0000-0000-0000-000000000003',
            departmentId: '10000000-0000-0000-0000-000000000001',
            name: 'Helpdesk & Security Operations',
            description: 'Tier 1/2 IT Support, endpoint security, and access control',
            leadId: '00000000-0000-0000-0000-000000000002',
            leadName: 'Marcus Chen',
            isActive: true,
        },
    ];
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const code = dto.code.toUpperCase().trim();
        if (this.prisma.isConnected) {
            const existing = await this.prisma.department.findUnique({
                where: { code },
            });
            if (existing) {
                throw new common_1.ConflictException(`Department code '${code}' already exists`);
            }
            const newDept = await this.prisma.department.create({
                data: {
                    referenceId: (0, reference_id_util_1.generateReferenceId)('DEP'),
                    name: dto.name.trim(),
                    code,
                    description: dto.description,
                    managerId: dto.managerId || null,
                    isActive: true,
                },
            });
            return newDept;
        }
        const existing = this.memoryDepts.find((d) => d.code === code);
        if (existing) {
            throw new common_1.ConflictException(`Department code '${code}' already exists`);
        }
        const newDept = {
            id: crypto.randomUUID(),
            referenceId: (0, reference_id_util_1.generateReferenceId)('DEP'),
            name: dto.name.trim(),
            code,
            description: dto.description || '',
            managerId: dto.managerId || null,
            managerName: 'Unassigned',
            memberCount: 0,
            teamCount: 0,
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        this.memoryDepts.push(newDept);
        return newDept;
    }
    async findAll() {
        if (this.prisma.isConnected) {
            return this.prisma.department.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.memoryDepts;
    }
    async findOne(id) {
        if (this.prisma.isConnected) {
            const dept = await this.prisma.department.findFirst({
                where: {
                    OR: [{ id }, { referenceId: id }, { code: id }],
                },
            });
            if (!dept)
                throw new common_1.NotFoundException('Department not found');
            return dept;
        }
        const found = this.memoryDepts.find((d) => d.id === id);
        if (!found)
            throw new common_1.NotFoundException('Department not found');
        return found;
    }
    async update(id, dto) {
        if (this.prisma.isConnected) {
            const existing = await this.prisma.department.findFirst({
                where: {
                    OR: [{ id }, { referenceId: id }],
                },
            });
            if (!existing)
                throw new common_1.NotFoundException('Department not found');
            const updated = await this.prisma.department.update({
                where: { id: existing.id },
                data: {
                    name: dto.name || existing.name,
                    description: dto.description !== undefined ? dto.description : existing.description,
                    managerId: dto.managerId !== undefined ? dto.managerId : existing.managerId,
                    isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
                    updatedAt: new Date(),
                },
            });
            return updated;
        }
        const index = this.memoryDepts.findIndex((d) => d.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Department not found');
        this.memoryDepts[index] = {
            ...this.memoryDepts[index],
            ...dto,
        };
        return this.memoryDepts[index];
    }
    async remove(id) {
        if (this.prisma.isConnected) {
            const existing = await this.prisma.department.findFirst({
                where: { OR: [{ id }, { referenceId: id }] },
            });
            if (!existing)
                throw new common_1.NotFoundException('Department not found');
            await this.prisma.department.update({
                where: { id: existing.id },
                data: { isActive: false, updatedAt: new Date() },
            });
            return { message: 'Department deactivated successfully' };
        }
        const index = this.memoryDepts.findIndex((d) => d.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Department not found');
        this.memoryDepts[index].isActive = false;
        return { message: 'Department deactivated successfully' };
    }
    async createTeam(departmentId, dto) {
        await this.findOne(departmentId);
        if (this.prisma.isConnected) {
            const newTeam = await this.prisma.team.create({
                data: {
                    referenceId: (0, reference_id_util_1.generateReferenceId)('TEM'),
                    departmentId,
                    name: dto.name,
                    leadId: dto.leadId || null,
                    description: dto.description || null,
                    isActive: true,
                },
            });
            return newTeam;
        }
        const newTeam = {
            id: crypto.randomUUID(),
            referenceId: (0, reference_id_util_1.generateReferenceId)('TEM'),
            departmentId,
            name: dto.name,
            description: dto.description || '',
            leadId: dto.leadId || null,
            leadName: 'Unassigned',
            isActive: true,
        };
        this.memoryTeams.push(newTeam);
        return newTeam;
    }
    async findTeams(departmentId) {
        if (this.prisma.isConnected) {
            return this.prisma.team.findMany({
                where: { departmentId },
            });
        }
        return this.memoryTeams.filter((t) => t.departmentId === departmentId);
    }
    async getOrgChart() {
        const depts = await this.findAll();
        const tree = await Promise.all(depts.map(async (dept) => {
            const teams = await this.findTeams(dept.id);
            return {
                id: dept.id,
                name: dept.name,
                code: dept.code,
                referenceId: dept.referenceId,
                head: dept.managerName || 'Unassigned Head',
                teams: teams.map((t) => ({
                    id: t.id,
                    name: t.name,
                    lead: t.leadName || 'Team Lead',
                })),
            };
        }));
        return {
            organizationName: 'Q Clocker Enterprise',
            ceo: 'Alexander Vance (Chief Information Officer)',
            departments: tree,
        };
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = DepartmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map