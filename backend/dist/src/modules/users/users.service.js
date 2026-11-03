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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const enums_1 = require("../../common/enums");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const crypto = require("crypto");
let UsersService = UsersService_1 = class UsersService {
    dbService;
    logger = new common_1.Logger(UsersService_1.name);
    memoryUsers = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'superadmin@qclocker.io',
            firstName: 'Alexander',
            lastName: 'Vance',
            phone: '+1-555-0100',
            roleCode: enums_1.UserRole.SUPER_ADMIN,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            teamId: null,
            managerId: null,
            jobTitle: 'Chief Information Officer',
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            email: 'itmanager@qclocker.io',
            firstName: 'Marcus',
            lastName: 'Chen',
            phone: '+1-555-0101',
            roleCode: enums_1.UserRole.ADMIN,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            jobTitle: 'IT Infrastructure & Operations Manager',
            isActive: true,
            createdAt: new Date('2026-01-10').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            email: 'teamlead@qclocker.io',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            phone: '+1-555-0102',
            roleCode: enums_1.UserRole.TEAM_LEAD,
            departmentId: '10000000-0000-0000-0000-000000000002',
            departmentName: 'Software Engineering',
            teamId: '20000000-0000-0000-0000-000000000001',
            managerId: '00000000-0000-0000-0000-000000000001',
            jobTitle: 'Senior Engineering Lead',
            isActive: true,
            createdAt: new Date('2026-01-15').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            email: 'employee@qclocker.io',
            firstName: 'David',
            lastName: 'Ross',
            phone: '+1-555-0103',
            roleCode: enums_1.UserRole.EMPLOYEE,
            departmentId: '10000000-0000-0000-0000-000000000002',
            departmentName: 'Software Engineering',
            teamId: '20000000-0000-0000-0000-000000000001',
            managerId: '00000000-0000-0000-0000-000000000003',
            jobTitle: 'Full-Stack Software Engineer',
            isActive: true,
            createdAt: new Date('2026-02-01').toISOString(),
        },
    ];
    constructor(dbService) {
        this.dbService = dbService;
    }
    async create(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        if (this.dbService.getConnectionStatus()) {
            const existing = await this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.email, normalizedEmail))
                .limit(1);
            if (existing.length > 0) {
                throw new common_1.ConflictException('An employee with this email already exists');
            }
            let [role] = await this.dbService.db
                .select()
                .from(schema.roles)
                .where((0, drizzle_orm_1.eq)(schema.roles.code, dto.roleCode))
                .limit(1);
            if (!role) {
                [role] = await this.dbService.db
                    .insert(schema.roles)
                    .values({
                    code: dto.roleCode,
                    name: dto.roleCode.replace('_', ' '),
                    description: `${dto.roleCode} Role`,
                    isSystem: true,
                })
                    .returning();
            }
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const [newUser] = await this.dbService.db
                .insert(schema.users)
                .values({
                referenceId: (0, reference_id_util_1.generateReferenceId)('EMP'),
                email: normalizedEmail,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                roleId: role.id,
                roleCode: dto.roleCode,
                departmentId: dto.departmentId || null,
                teamId: dto.teamId || null,
                managerId: dto.managerId || null,
                jobTitle: dto.jobTitle || 'Team Member',
                isActive: true,
            })
                .returning();
            const { passwordHash: _, ...clean } = newUser;
            return clean;
        }
        const existing = this.memoryUsers.find((u) => u.email === normalizedEmail);
        if (existing) {
            throw new common_1.ConflictException('An employee with this email already exists');
        }
        const newUser = {
            id: crypto.randomUUID(),
            referenceId: (0, reference_id_util_1.generateReferenceId)('EMP'),
            email: normalizedEmail,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone || null,
            roleCode: dto.roleCode,
            departmentId: dto.departmentId || null,
            departmentName: 'General',
            teamId: dto.teamId || null,
            managerId: dto.managerId || null,
            jobTitle: dto.jobTitle || 'Team Member',
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        this.memoryUsers.push(newUser);
        return newUser;
    }
    async findAll(query) {
        if (this.dbService.getConnectionStatus()) {
            let conditions = [(0, drizzle_orm_1.isNull)(schema.users.deletedAt)];
            if (query?.role) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.roleCode, query.role));
            }
            if (query?.departmentId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.departmentId, query.departmentId));
            }
            if (query?.isActive !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.isActive, query.isActive === 'true'));
            }
            if (query?.search) {
                const term = `%${query.search.trim()}%`;
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.users.firstName, term), (0, drizzle_orm_1.ilike)(schema.users.lastName, term), (0, drizzle_orm_1.ilike)(schema.users.email, term)));
            }
            return this.dbService.db
                .select({
                id: schema.users.id,
                email: schema.users.email,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                phone: schema.users.phone,
                avatarUrl: schema.users.avatarUrl,
                roleCode: schema.users.roleCode,
                departmentId: schema.users.departmentId,
                teamId: schema.users.teamId,
                managerId: schema.users.managerId,
                jobTitle: schema.users.jobTitle,
                isActive: schema.users.isActive,
                createdAt: schema.users.createdAt,
            })
                .from(schema.users)
                .where((0, drizzle_orm_1.and)(...conditions))
                .orderBy((0, drizzle_orm_1.desc)(schema.users.createdAt));
        }
        let results = [...this.memoryUsers];
        if (query?.role) {
            results = results.filter((u) => u.roleCode === query.role);
        }
        if (query?.departmentId) {
            results = results.filter((u) => u.departmentId === query.departmentId);
        }
        if (query?.isActive !== undefined) {
            const activeBool = query.isActive === 'true';
            results = results.filter((u) => u.isActive === activeBool);
        }
        if (query?.search) {
            const q = query.search.toLowerCase();
            results = results.filter((u) => u.firstName.toLowerCase().includes(q) ||
                u.lastName.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q));
        }
        return results;
    }
    async findOne(id) {
        if (this.dbService.getConnectionStatus()) {
            const [user] = await this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.id, id), (0, drizzle_orm_1.isNull)(schema.users.deletedAt)))
                .limit(1);
            if (!user)
                throw new common_1.NotFoundException('Employee not found');
            const { passwordHash, ...cleanUser } = user;
            return cleanUser;
        }
        const found = this.memoryUsers.find((u) => u.id === id);
        if (!found)
            throw new common_1.NotFoundException('Employee not found');
        return found;
    }
    async update(id, dto) {
        if (this.dbService.getConnectionStatus()) {
            const [existing] = await this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.id, id))
                .limit(1);
            if (!existing)
                throw new common_1.NotFoundException('Employee not found');
            const updatePayload = {
                updatedAt: new Date(),
            };
            if (dto.firstName)
                updatePayload.firstName = dto.firstName;
            if (dto.lastName)
                updatePayload.lastName = dto.lastName;
            if (dto.phone !== undefined)
                updatePayload.phone = dto.phone;
            if (dto.roleCode)
                updatePayload.roleCode = dto.roleCode;
            if (dto.departmentId !== undefined)
                updatePayload.departmentId = dto.departmentId;
            if (dto.teamId !== undefined)
                updatePayload.teamId = dto.teamId;
            if (dto.managerId !== undefined)
                updatePayload.managerId = dto.managerId;
            if (dto.jobTitle !== undefined)
                updatePayload.jobTitle = dto.jobTitle;
            if (dto.isActive !== undefined)
                updatePayload.isActive = dto.isActive;
            const [updated] = await this.dbService.db
                .update(schema.users)
                .set(updatePayload)
                .where((0, drizzle_orm_1.eq)(schema.users.id, id))
                .returning();
            const { passwordHash, ...clean } = updated;
            return clean;
        }
        const index = this.memoryUsers.findIndex((u) => u.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Employee not found');
        this.memoryUsers[index] = {
            ...this.memoryUsers[index],
            ...dto,
        };
        return this.memoryUsers[index];
    }
    async remove(id) {
        if (this.dbService.getConnectionStatus()) {
            const [user] = await this.dbService.db
                .update(schema.users)
                .set({ deletedAt: new Date(), isActive: false })
                .where((0, drizzle_orm_1.eq)(schema.users.id, id))
                .returning();
            if (!user)
                throw new common_1.NotFoundException('Employee not found');
            return { message: 'Employee successfully deactivated and archived' };
        }
        const index = this.memoryUsers.findIndex((u) => u.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Employee not found');
        this.memoryUsers[index].isActive = false;
        return { message: 'Employee successfully deactivated and archived' };
    }
    async findSubordinates(managerId) {
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db
                .select({
                id: schema.users.id,
                email: schema.users.email,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                roleCode: schema.users.roleCode,
                jobTitle: schema.users.jobTitle,
                isActive: schema.users.isActive,
            })
                .from(schema.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.managerId, managerId), (0, drizzle_orm_1.isNull)(schema.users.deletedAt)));
        }
        return this.memoryUsers.filter((u) => u.managerId === managerId);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map