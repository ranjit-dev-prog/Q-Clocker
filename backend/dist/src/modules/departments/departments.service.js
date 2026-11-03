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
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
let DepartmentsService = DepartmentsService_1 = class DepartmentsService {
    dbService;
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
            departmentId: '10000000-0000-0000-0000-000000000001',
            name: 'Helpdesk & Security Operations',
            description: 'Tier 1/2 IT Support, endpoint security, and access control',
            leadId: '00000000-0000-0000-0000-000000000002',
            leadName: 'Marcus Chen',
            isActive: true,
        },
    ];
    constructor(dbService) {
        this.dbService = dbService;
    }
    async create(dto) {
        const code = dto.code.toUpperCase().trim();
        if (this.dbService.getConnectionStatus()) {
            const existing = await this.dbService.db
                .select()
                .from(schema.departments)
                .where((0, drizzle_orm_1.eq)(schema.departments.code, code))
                .limit(1);
            if (existing.length > 0) {
                throw new common_1.ConflictException(`Department code '${code}' already exists`);
            }
            const [newDept] = await this.dbService.db
                .insert(schema.departments)
                .values({
                referenceId: (0, reference_id_util_1.generateReferenceId)('DEP'),
                name: dto.name.trim(),
                code,
                description: dto.description,
                managerId: dto.managerId || null,
                isActive: true,
            })
                .returning();
            return newDept;
        }
        const existing = this.memoryDepts.find((d) => d.code === code);
        if (existing) {
            throw new common_1.ConflictException(`Department code '${code}' already exists`);
        }
        const newDept = {
            id: `10000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db
                .select()
                .from(schema.departments)
                .orderBy((0, drizzle_orm_1.desc)(schema.departments.createdAt));
        }
        return this.memoryDepts;
    }
    async findOne(id) {
        if (this.dbService.getConnectionStatus()) {
            const [dept] = await this.dbService.db
                .select()
                .from(schema.departments)
                .where((0, drizzle_orm_1.eq)(schema.departments.id, id))
                .limit(1);
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
        if (this.dbService.getConnectionStatus()) {
            const [existing] = await this.dbService.db
                .select()
                .from(schema.departments)
                .where((0, drizzle_orm_1.eq)(schema.departments.id, id))
                .limit(1);
            if (!existing)
                throw new common_1.NotFoundException('Department not found');
            const [updated] = await this.dbService.db
                .update(schema.departments)
                .set({
                name: dto.name || existing.name,
                description: dto.description !== undefined ? dto.description : existing.description,
                managerId: dto.managerId !== undefined ? dto.managerId : existing.managerId,
                isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.departments.id, id))
                .returning();
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
        if (this.dbService.getConnectionStatus()) {
            const [dept] = await this.dbService.db
                .update(schema.departments)
                .set({ isActive: false, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.departments.id, id))
                .returning();
            if (!dept)
                throw new common_1.NotFoundException('Department not found');
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
        if (this.dbService.getConnectionStatus()) {
            const [newTeam] = await this.dbService.db
                .insert(schema.teams)
                .values({
                referenceId: (0, reference_id_util_1.generateReferenceId)('TEM'),
                departmentId,
                name: dto.name,
                leadId: dto.leadId || null,
                description: dto.description || null,
                isActive: true,
            })
                .returning();
            return newTeam;
        }
        const newTeam = {
            id: `20000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db
                .select()
                .from(schema.teams)
                .where((0, drizzle_orm_1.eq)(schema.teams.departmentId, departmentId));
        }
        return this.memoryTeams.filter((t) => t.departmentId === departmentId);
    }
};
exports.DepartmentsService = DepartmentsService;
exports.DepartmentsService = DepartmentsService = DepartmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DepartmentsService);
//# sourceMappingURL=departments.service.js.map