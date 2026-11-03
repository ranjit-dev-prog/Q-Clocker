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
exports.DesignationsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
let DesignationsService = class DesignationsService {
    dbService;
    demoDesignations = [
        {
            id: '80000000-0000-0000-0000-000000000001',
            referenceId: 'DSG-SWE001',
            name: 'Full-Stack Software Engineer',
            code: 'SWE_FULLSTACK',
            departmentId: '10000000-0000-0000-0000-000000000001',
            description: 'End-to-end web architecture and microservices implementation',
            isActive: true,
            createdAt: new Date(),
        },
        {
            id: '80000000-0000-0000-0000-000000000002',
            referenceId: 'DSG-DEVOPS',
            name: 'Lead Cloud Infrastructure Architect',
            code: 'CLOUD_ARCH',
            departmentId: '10000000-0000-0000-0000-000000000001',
            description: 'Kubernetes orchestration, CI/CD pipelines, and cloud reliability',
            isActive: true,
            createdAt: new Date(),
        },
        {
            id: '80000000-0000-0000-0000-000000000003',
            referenceId: 'DSG-QAENG',
            name: 'Senior QA Automation Engineer',
            code: 'QA_AUTOMATION',
            departmentId: '10000000-0000-0000-0000-000000000001',
            description: 'Automated test suite maintenance and performance testing',
            isActive: true,
            createdAt: new Date(),
        },
        {
            id: '80000000-0000-0000-0000-000000000004',
            referenceId: 'DSG-HRMGR',
            name: 'Human Resources Operations Manager',
            code: 'HR_OPERATIONS_MGR',
            departmentId: '10000000-0000-0000-0000-000000000002',
            description: 'People operations, organizational development, and compliance',
            isActive: true,
            createdAt: new Date(),
        },
    ];
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAll() {
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db.select().from(schema.designations);
        }
        return this.demoDesignations;
    }
    async findOne(id) {
        if (this.dbService.getConnectionStatus()) {
            const [des] = await this.dbService.db
                .select()
                .from(schema.designations)
                .where((0, drizzle_orm_1.eq)(schema.designations.id, id))
                .limit(1);
            if (!des)
                throw new common_1.NotFoundException(`Designation '${id}' not found`);
            return des;
        }
        const des = this.demoDesignations.find((d) => d.id === id || d.referenceId === id);
        if (!des)
            throw new common_1.NotFoundException(`Designation '${id}' not found`);
        return des;
    }
    async create(dto) {
        const code = dto.code.toUpperCase().trim();
        const referenceId = (0, reference_id_util_1.generateReferenceId)('DSG');
        if (this.dbService.getConnectionStatus()) {
            const existing = await this.dbService.db
                .select()
                .from(schema.designations)
                .where((0, drizzle_orm_1.eq)(schema.designations.code, code))
                .limit(1);
            if (existing.length > 0) {
                throw new common_1.ConflictException(`Designation with code '${code}' already exists`);
            }
            const [newDes] = await this.dbService.db
                .insert(schema.designations)
                .values({
                referenceId,
                name: dto.name.trim(),
                code,
                departmentId: dto.departmentId || null,
                description: dto.description?.trim() || null,
                isActive: dto.isActive !== false,
            })
                .returning();
            return newDes;
        }
        const existing = this.demoDesignations.find((d) => d.code === code);
        if (existing) {
            throw new common_1.ConflictException(`Designation with code '${code}' already exists`);
        }
        const newDes = {
            id: crypto.randomUUID(),
            referenceId,
            name: dto.name.trim(),
            code,
            departmentId: dto.departmentId || null,
            description: dto.description?.trim() || null,
            isActive: dto.isActive !== false,
            createdAt: new Date(),
        };
        this.demoDesignations.unshift(newDes);
        return newDes;
    }
};
exports.DesignationsService = DesignationsService;
exports.DesignationsService = DesignationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DesignationsService);
//# sourceMappingURL=designations.service.js.map