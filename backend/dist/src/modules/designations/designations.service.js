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
const prisma_service_1 = require("../../prisma/prisma.service");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const crypto = require("crypto");
let DesignationsService = class DesignationsService {
    prisma;
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        if (this.prisma.isConnected) {
            return this.prisma.designation.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }
        return this.demoDesignations;
    }
    async findOne(id) {
        if (this.prisma.isConnected) {
            const des = await this.prisma.designation.findFirst({
                where: {
                    OR: [{ id }, { referenceId: id }, { code: id }],
                },
            });
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
        if (this.prisma.isConnected) {
            const existing = await this.prisma.designation.findUnique({
                where: { code },
            });
            if (existing) {
                throw new common_1.ConflictException(`Designation with code '${code}' already exists`);
            }
            const newDes = await this.prisma.designation.create({
                data: {
                    referenceId,
                    name: dto.name.trim(),
                    code,
                    departmentId: dto.departmentId || null,
                    description: dto.description?.trim() || null,
                    isActive: dto.isActive !== false,
                },
            });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DesignationsService);
//# sourceMappingURL=designations.service.js.map