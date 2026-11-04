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
const ExcelJS = require("exceljs");
let UsersService = UsersService_1 = class UsersService {
    dbService;
    logger = new common_1.Logger(UsersService_1.name);
    memoryUsers = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            referenceId: 'EMP-ADM001',
            employeeCode: 'EMP001',
            email: 'superadmin@qclocker.io',
            personalEmail: 'alex.vance@gmail.com',
            firstName: 'Alexander',
            lastName: 'Vance',
            phone: '+1-555-0100',
            roleCode: enums_1.UserRole.SUPER_ADMIN,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            designationId: '80000000-0000-0000-0000-000000000002',
            designationName: 'Lead Cloud Infrastructure Architect',
            teamId: null,
            managerId: null,
            managerName: null,
            jobTitle: 'Chief Information Officer',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-01',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-01').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            referenceId: 'EMP-SYS001',
            employeeCode: 'EMP002',
            email: 'sysadmin@qclocker.io',
            personalEmail: 'ben.hayes@gmail.com',
            firstName: 'Benjamin',
            lastName: 'Hayes',
            phone: '+1-555-0101',
            roleCode: enums_1.UserRole.ADMIN,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            designationId: '80000000-0000-0000-0000-000000000002',
            designationName: 'Principal Systems Administrator',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'Principal Systems Administrator',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-05',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-05').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            referenceId: 'EMP-HR001',
            employeeCode: 'EMP003',
            email: 'hradmin@qclocker.io',
            personalEmail: 'elena.rostova@gmail.com',
            firstName: 'Elena',
            lastName: 'Rostova',
            phone: '+1-555-0102',
            roleCode: enums_1.UserRole.HR_MANAGER,
            departmentId: '10000000-0000-0000-0000-000000000003',
            departmentName: 'Human Resources',
            designationId: '80000000-0000-0000-0000-000000000003',
            designationName: 'HR Director',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'Director of Human Resources',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-08',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-08').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            referenceId: 'EMP-MGR001',
            employeeCode: 'EMP004',
            email: 'itmanager@qclocker.io',
            personalEmail: 'marcus.chen@gmail.com',
            firstName: 'Marcus',
            lastName: 'Chen',
            phone: '+1-555-0103',
            roleCode: enums_1.UserRole.IT_MANAGER,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            designationId: '80000000-0000-0000-0000-000000000002',
            designationName: 'IT Operations Lead',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'IT Infrastructure & Operations Manager',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-10',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-10').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000005',
            referenceId: 'EMP-DPT001',
            employeeCode: 'EMP005',
            email: 'deptmanager@qclocker.io',
            personalEmail: 'diana.prince@gmail.com',
            firstName: 'Diana',
            lastName: 'Prince',
            phone: '+1-555-0104',
            roleCode: enums_1.UserRole.DEPARTMENT_MANAGER,
            departmentId: '10000000-0000-0000-0000-000000000002',
            departmentName: 'Software Engineering',
            designationId: '80000000-0000-0000-0000-000000000001',
            designationName: 'Director of Engineering',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'Engineering Department Director',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-12',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-12').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000006',
            referenceId: 'EMP-TL0001',
            employeeCode: 'EMP006',
            email: 'teamlead@qclocker.io',
            personalEmail: 'sarah.jenkins@gmail.com',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            phone: '+1-555-0105',
            roleCode: enums_1.UserRole.TEAM_LEAD,
            departmentId: '10000000-0000-0000-0000-000000000002',
            departmentName: 'Software Engineering',
            designationId: '80000000-0000-0000-0000-000000000001',
            designationName: 'Full-Stack Software Engineer',
            teamId: '20000000-0000-0000-0000-000000000001',
            managerId: '00000000-0000-0000-0000-000000000005',
            managerName: 'Diana Prince',
            jobTitle: 'Senior Engineering Lead',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-01-15',
            workLocation: 'Hybrid',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-01-15').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000007',
            referenceId: 'EMP-EMP001',
            employeeCode: 'EMP007',
            email: 'employee@qclocker.io',
            personalEmail: 'david.ross@gmail.com',
            firstName: 'David',
            lastName: 'Ross',
            phone: '+1-555-0106',
            roleCode: enums_1.UserRole.EMPLOYEE,
            departmentId: '10000000-0000-0000-0000-000000000002',
            departmentName: 'Software Engineering',
            designationId: '80000000-0000-0000-0000-000000000001',
            designationName: 'Full-Stack Software Engineer',
            teamId: '20000000-0000-0000-0000-000000000001',
            managerId: '00000000-0000-0000-0000-000000000006',
            managerName: 'Sarah Jenkins',
            jobTitle: 'Full-Stack Software Engineer',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-02-01',
            workLocation: 'Remote',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-02-01').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000008',
            referenceId: 'EMP-AUD001',
            employeeCode: 'EMP008',
            email: 'auditor@qclocker.io',
            personalEmail: 'rachel.adams@gmail.com',
            firstName: 'Rachel',
            lastName: 'Adams',
            phone: '+1-555-0107',
            roleCode: enums_1.UserRole.AUDITOR,
            departmentId: '10000000-0000-0000-0000-000000000004',
            departmentName: 'Quality Assurance & Audit',
            designationId: '80000000-0000-0000-0000-000000000004',
            designationName: 'Compliance Auditor',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'Senior Compliance & IT Auditor',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-02-10',
            workLocation: 'Headquarters',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-02-10').toISOString(),
        },
        {
            id: '00000000-0000-0000-0000-000000000009',
            referenceId: 'EMP-VIW001',
            employeeCode: 'EMP009',
            email: 'viewer@qclocker.io',
            personalEmail: 'victor.stone@gmail.com',
            firstName: 'Victor',
            lastName: 'Stone',
            phone: '+1-555-0108',
            roleCode: enums_1.UserRole.VIEWER,
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            designationId: '80000000-0000-0000-0000-000000000002',
            designationName: 'Board Observer',
            teamId: null,
            managerId: '00000000-0000-0000-0000-000000000001',
            managerName: 'Alexander Vance',
            jobTitle: 'Executive Stakeholder & Observer',
            employmentType: enums_1.EmploymentType.FULL_TIME,
            joiningDate: '2026-02-15',
            workLocation: 'Remote',
            hasLoginAccount: true,
            accountStatus: enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date('2026-02-15').toISOString(),
        },
    ];
    constructor(dbService) {
        this.dbService = dbService;
    }
    async create(dto, creatorUser) {
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
            if (dto.employeeCode) {
                const existingCode = await this.dbService.db
                    .select()
                    .from(schema.users)
                    .where((0, drizzle_orm_1.eq)(schema.users.employeeCode, dto.employeeCode.trim()))
                    .limit(1);
                if (existingCode.length > 0) {
                    throw new common_1.ConflictException(`Employee badge code '${dto.employeeCode}' is already taken`);
                }
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
                    description: 'Application Role',
                    isSystem: true,
                })
                    .returning();
            }
            const rawPassword = dto.password || crypto.randomBytes(16).toString('hex') + '!2026';
            const passwordHash = await bcrypt.hash(rawPassword, 10);
            const referenceId = (0, reference_id_util_1.generateReferenceId)('EMP');
            let invitationToken = null;
            let invitationExpires = null;
            let accountStatus = enums_1.AccountStatus.ACTIVE;
            if (dto.sendInvitation) {
                const rawToken = crypto.randomBytes(32).toString('hex');
                invitationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
                invitationExpires = new Date(Date.now() + 48 * 3600 * 1000);
                accountStatus = enums_1.AccountStatus.INVITATION_PENDING;
            }
            const [newUser] = await this.dbService.db
                .insert(schema.users)
                .values({
                referenceId,
                employeeCode: dto.employeeCode?.trim() || `EMP${Math.floor(1000 + Math.random() * 9000)}`,
                email: normalizedEmail,
                personalEmail: dto.personalEmail?.trim() || null,
                passwordHash,
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                phone: dto.phone?.trim() || null,
                roleId: role.id,
                roleCode: dto.roleCode,
                departmentId: dto.departmentId || null,
                teamId: dto.teamId || null,
                designationId: dto.designationId || null,
                managerId: dto.managerId || null,
                jobTitle: dto.jobTitle?.trim() || 'Team Member',
                employmentType: dto.employmentType || enums_1.EmploymentType.FULL_TIME,
                joiningDate: dto.joiningDate || new Date().toISOString().substring(0, 10),
                workLocation: dto.workLocation?.trim() || 'Headquarters',
                hasLoginAccount: dto.hasLoginAccount !== false,
                accountStatus,
                invitationToken,
                invitationTokenExpiresAt: invitationExpires,
                isActive: true,
            })
                .returning();
            const { passwordHash: _, ...sanitized } = newUser;
            return sanitized;
        }
        const existing = this.memoryUsers.find((u) => u.email === normalizedEmail);
        if (existing) {
            throw new common_1.ConflictException('An employee with this email already exists');
        }
        if (dto.employeeCode && this.memoryUsers.some((u) => u.employeeCode === dto.employeeCode)) {
            throw new common_1.ConflictException(`Employee badge code '${dto.employeeCode}' is already taken`);
        }
        const referenceId = (0, reference_id_util_1.generateReferenceId)('EMP');
        const newUser = {
            id: crypto.randomUUID(),
            referenceId,
            employeeCode: dto.employeeCode?.trim() || `EMP${Math.floor(1000 + Math.random() * 9000)}`,
            email: normalizedEmail,
            personalEmail: dto.personalEmail?.trim() || null,
            firstName: dto.firstName.trim(),
            lastName: dto.lastName.trim(),
            phone: dto.phone?.trim() || null,
            roleCode: dto.roleCode,
            departmentId: dto.departmentId || null,
            departmentName: 'Operations',
            teamId: dto.teamId || null,
            designationId: dto.designationId || null,
            designationName: dto.jobTitle || 'Team Member',
            managerId: dto.managerId || null,
            managerName: null,
            jobTitle: dto.jobTitle?.trim() || 'Team Member',
            employmentType: dto.employmentType || enums_1.EmploymentType.FULL_TIME,
            joiningDate: dto.joiningDate || new Date().toISOString().substring(0, 10),
            workLocation: dto.workLocation?.trim() || 'Headquarters',
            hasLoginAccount: dto.hasLoginAccount !== false,
            accountStatus: dto.sendInvitation ? enums_1.AccountStatus.INVITATION_PENDING : enums_1.AccountStatus.ACTIVE,
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        this.memoryUsers.push(newUser);
        return newUser;
    }
    async findAll(query) {
        const roleFilter = query.roleCode || query.role;
        const activeFilter = query.isActive !== undefined
            ? typeof query.isActive === 'string'
                ? query.isActive === 'true'
                : Boolean(query.isActive)
            : undefined;
        if (this.dbService.getConnectionStatus()) {
            const conditions = [];
            if (roleFilter) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.roleCode, roleFilter));
            }
            if (query.departmentId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.departmentId, query.departmentId));
            }
            if (activeFilter !== undefined) {
                conditions.push((0, drizzle_orm_1.eq)(schema.users.isActive, activeFilter));
            }
            if (query.search) {
                const pattern = `%${query.search.trim()}%`;
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.users.firstName, pattern), (0, drizzle_orm_1.ilike)(schema.users.lastName, pattern), (0, drizzle_orm_1.ilike)(schema.users.email, pattern), (0, drizzle_orm_1.ilike)(schema.users.referenceId, pattern), (0, drizzle_orm_1.ilike)(schema.users.jobTitle, pattern)));
            }
            const rows = await this.dbService.db
                .select({
                id: schema.users.id,
                referenceId: schema.users.referenceId,
                employeeCode: schema.users.employeeCode,
                email: schema.users.email,
                personalEmail: schema.users.personalEmail,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                phone: schema.users.phone,
                avatarUrl: schema.users.avatarUrl,
                roleCode: schema.users.roleCode,
                departmentId: schema.users.departmentId,
                departmentName: schema.departments.name,
                teamId: schema.users.teamId,
                designationId: schema.users.designationId,
                managerId: schema.users.managerId,
                jobTitle: schema.users.jobTitle,
                employmentType: schema.users.employmentType,
                joiningDate: schema.users.joiningDate,
                workLocation: schema.users.workLocation,
                hasLoginAccount: schema.users.hasLoginAccount,
                accountStatus: schema.users.accountStatus,
                isActive: schema.users.isActive,
                createdAt: schema.users.createdAt,
            })
                .from(schema.users)
                .leftJoin(schema.departments, (0, drizzle_orm_1.eq)(schema.users.departmentId, schema.departments.id))
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(schema.users.createdAt));
            return rows;
        }
        return this.memoryUsers.filter((u) => {
            if (roleFilter && u.roleCode !== roleFilter)
                return false;
            if (query.departmentId && u.departmentId !== query.departmentId)
                return false;
            if (activeFilter !== undefined && u.isActive !== activeFilter)
                return false;
            if (query.search) {
                const s = query.search.toLowerCase();
                return (u.firstName.toLowerCase().includes(s) ||
                    u.lastName.toLowerCase().includes(s) ||
                    u.email.toLowerCase().includes(s) ||
                    (u.referenceId && u.referenceId.toLowerCase().includes(s)));
            }
            return true;
        });
    }
    async findOne(id) {
        if (this.dbService.getConnectionStatus()) {
            const [user] = await this.dbService.db
                .select({
                id: schema.users.id,
                referenceId: schema.users.referenceId,
                employeeCode: schema.users.employeeCode,
                email: schema.users.email,
                personalEmail: schema.users.personalEmail,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                phone: schema.users.phone,
                avatarUrl: schema.users.avatarUrl,
                roleCode: schema.users.roleCode,
                departmentId: schema.users.departmentId,
                departmentName: schema.departments.name,
                teamId: schema.users.teamId,
                designationId: schema.users.designationId,
                managerId: schema.users.managerId,
                jobTitle: schema.users.jobTitle,
                employmentType: schema.users.employmentType,
                joiningDate: schema.users.joiningDate,
                workLocation: schema.users.workLocation,
                hasLoginAccount: schema.users.hasLoginAccount,
                accountStatus: schema.users.accountStatus,
                isActive: schema.users.isActive,
                createdAt: schema.users.createdAt,
            })
                .from(schema.users)
                .leftJoin(schema.departments, (0, drizzle_orm_1.eq)(schema.users.departmentId, schema.departments.id))
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.users.id, id), (0, drizzle_orm_1.eq)(schema.users.referenceId, id)))
                .limit(1);
            if (!user)
                throw new common_1.NotFoundException(`Employee '${id}' not found`);
            return user;
        }
        const user = this.memoryUsers.find((u) => u.id === id || u.referenceId === id);
        if (!user)
            throw new common_1.NotFoundException(`Employee '${id}' not found`);
        return user;
    }
    async update(id, dto) {
        const existing = await this.findOne(id);
        if (dto.managerId && dto.managerId === existing.id) {
            throw new common_1.BadRequestException('An employee cannot report to themselves');
        }
        if (this.dbService.getConnectionStatus()) {
            const updateData = {
                updatedAt: new Date(),
            };
            if (dto.firstName)
                updateData.firstName = dto.firstName.trim();
            if (dto.lastName)
                updateData.lastName = dto.lastName.trim();
            if (dto.employeeCode)
                updateData.employeeCode = dto.employeeCode.trim();
            if (dto.personalEmail !== undefined)
                updateData.personalEmail = dto.personalEmail;
            if (dto.phone !== undefined)
                updateData.phone = dto.phone;
            if (dto.roleCode)
                updateData.roleCode = dto.roleCode;
            if (dto.departmentId !== undefined)
                updateData.departmentId = dto.departmentId;
            if (dto.teamId !== undefined)
                updateData.teamId = dto.teamId;
            if (dto.designationId !== undefined)
                updateData.designationId = dto.designationId;
            if (dto.managerId !== undefined)
                updateData.managerId = dto.managerId;
            if (dto.jobTitle)
                updateData.jobTitle = dto.jobTitle.trim();
            if (dto.employmentType)
                updateData.employmentType = dto.employmentType;
            if (dto.joiningDate)
                updateData.joiningDate = dto.joiningDate;
            if (dto.workLocation)
                updateData.workLocation = dto.workLocation.trim();
            if (dto.hasLoginAccount !== undefined)
                updateData.hasLoginAccount = dto.hasLoginAccount;
            if (dto.accountStatus)
                updateData.accountStatus = dto.accountStatus;
            if (dto.isActive !== undefined)
                updateData.isActive = dto.isActive;
            await this.dbService.db
                .update(schema.users)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.users.id, existing.id));
            return this.findOne(existing.id);
        }
        const user = this.memoryUsers.find((u) => u.id === existing.id);
        Object.assign(user, dto, { updatedAt: new Date().toISOString() });
        return user;
    }
    async archive(id, actorUser) {
        const existing = await this.findOne(id);
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.users)
                .set({
                isActive: false,
                accountStatus: enums_1.AccountStatus.ARCHIVED,
                archivedAt: new Date(),
                archivedById: actorUser?.id || null,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.users.id, existing.id));
            await this.dbService.db
                .update(schema.userSessions)
                .set({ isRevoked: true, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.userSessions.userId, existing.id));
            return { success: true, message: `Employee ${existing.referenceId} safely archived` };
        }
        const user = this.memoryUsers.find((u) => u.id === existing.id);
        user.isActive = false;
        user.accountStatus = enums_1.AccountStatus.ARCHIVED;
        return { success: true, message: `Employee ${existing.referenceId} safely archived` };
    }
    async reactivate(id) {
        const existing = await this.findOne(id);
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.users)
                .set({
                isActive: true,
                accountStatus: enums_1.AccountStatus.ACTIVE,
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.users.id, existing.id));
            return { success: true, message: `Employee ${existing.referenceId} reactivated` };
        }
        const user = this.memoryUsers.find((u) => u.id === existing.id);
        user.isActive = true;
        user.accountStatus = enums_1.AccountStatus.ACTIVE;
        return { success: true, message: `Employee ${existing.referenceId} reactivated` };
    }
    async remove(id) {
        return this.archive(id);
    }
    async findSubordinates(managerId) {
        if (this.dbService.getConnectionStatus()) {
            return this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.managerId, managerId), (0, drizzle_orm_1.eq)(schema.users.isActive, true)));
        }
        return this.memoryUsers.filter((u) => u.managerId === managerId && u.isActive);
    }
    getImportTemplate() {
        return `employee_code,first_name,last_name,email,department,designation,manager_email,role,joining_date,employment_type,work_location
EMP005,Rahul,Sharma,rahul.sharma@qclocker.io,Information Technology,Senior DevOps Architect,itmanager@qclocker.io,EMPLOYEE,2026-11-01,FULL_TIME,Headquarters
EMP006,Priya,Nair,priya.nair@qclocker.io,Software Engineering,Full-Stack Software Engineer,teamlead@qclocker.io,EMPLOYEE,2026-11-01,FULL_TIME,Hybrid`;
    }
    previewImport(csvContent, actorUser) {
        const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
            throw new common_1.BadRequestException('CSV file must contain a header row and at least one data row');
        }
        const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const rows = [];
        const errors = [];
        const existingEmails = new Set(this.memoryUsers.map((u) => u.email.toLowerCase()));
        const seenCsvEmails = new Set();
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = line.split(',').map((val) => {
                let clean = val.trim();
                if (clean.startsWith('=') || clean.startsWith('+') || clean.startsWith('-') || clean.startsWith('@')) {
                    clean = clean.replace(/^[=+\-@]+/, '');
                }
                return clean;
            });
            const rowObj = {};
            rawHeaders.forEach((header, idx) => {
                rowObj[header] = values[idx] || '';
            });
            const email = (rowObj.email || '').toLowerCase().trim();
            const firstName = rowObj.first_name || '';
            const lastName = rowObj.last_name || '';
            const role = (rowObj.role || 'EMPLOYEE').toUpperCase().trim();
            if (!email) {
                errors.push({ rowNumber: i + 1, field: 'email', error: 'Email address is required' });
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push({ rowNumber: i + 1, field: 'email', error: 'Invalid email address format' });
            }
            else if (seenCsvEmails.has(email)) {
                errors.push({ rowNumber: i + 1, field: 'email', error: 'Duplicate email detected in CSV' });
            }
            else if (existingEmails.has(email)) {
                errors.push({ rowNumber: i + 1, field: 'email', error: 'Employee with this email already exists in system' });
            }
            else {
                seenCsvEmails.add(email);
            }
            if (!firstName) {
                errors.push({ rowNumber: i + 1, field: 'first_name', error: 'First name is required' });
            }
            if (!lastName) {
                errors.push({ rowNumber: i + 1, field: 'last_name', error: 'Last name is required' });
            }
            if ((role === 'SUPER_ADMIN' || role === 'ADMIN') && actorUser?.role !== enums_1.UserRole.SUPER_ADMIN) {
                errors.push({
                    rowNumber: i + 1,
                    field: 'role',
                    error: 'Only Super Administrators can import users with ADMIN or SUPER_ADMIN privileges',
                });
            }
            rows.push({
                employee_code: rowObj.employee_code || undefined,
                first_name: firstName,
                last_name: lastName,
                email,
                department: rowObj.department || 'Information Technology',
                designation: rowObj.designation || 'Software Engineer',
                manager_email: rowObj.manager_email || undefined,
                role: role || 'EMPLOYEE',
                joining_date: rowObj.joining_date || new Date().toISOString().substring(0, 10),
                employment_type: rowObj.employment_type || 'FULL_TIME',
                work_location: rowObj.work_location || 'Headquarters',
            });
        }
        return {
            totalRows: rows.length,
            validRows: rows.length - errors.length,
            invalidRows: errors.length,
            preview: rows.slice(0, 50),
            errors,
        };
    }
    async confirmImport(rows, actorUser) {
        let imported = 0;
        const failures = [];
        for (const r of rows) {
            try {
                await this.create({
                    employeeCode: r.employee_code,
                    firstName: r.first_name,
                    lastName: r.last_name,
                    email: r.email,
                    roleCode: r.role || enums_1.UserRole.EMPLOYEE,
                    jobTitle: r.designation,
                    employmentType: r.employment_type || enums_1.EmploymentType.FULL_TIME,
                    joiningDate: r.joining_date,
                    workLocation: r.work_location,
                    hasLoginAccount: true,
                    sendInvitation: true,
                }, actorUser);
                imported++;
            }
            catch (err) {
                failures.push({ email: r.email, error: err.message });
            }
        }
        return {
            importedCount: imported,
            failureCount: failures.length,
            failures,
            summary: `Successfully imported ${imported} employee(s). ${failures.length} failed.`,
        };
    }
    async getAdminDashboardMetrics() {
        const all = await this.findAll({});
        const activeEmployees = all.filter((u) => u.isActive && u.accountStatus === enums_1.AccountStatus.ACTIVE).length;
        const inactiveEmployees = all.filter((u) => !u.isActive || u.accountStatus === enums_1.AccountStatus.DEACTIVATED).length;
        const pendingInvitations = all.filter((u) => u.accountStatus === enums_1.AccountStatus.INVITATION_PENDING).length;
        const archivedEmployees = all.filter((u) => u.accountStatus === enums_1.AccountStatus.ARCHIVED).length;
        const roleDist = {};
        all.forEach((u) => {
            roleDist[u.roleCode] = (roleDist[u.roleCode] || 0) + 1;
        });
        const deptDist = {};
        all.forEach((u) => {
            const dName = u.departmentName || 'General';
            deptDist[dName] = (deptDist[dName] || 0) + 1;
        });
        return {
            totalEmployees: all.length,
            activeEmployees,
            inactiveEmployees,
            pendingInvitations,
            archivedEmployees,
            totalDepartments: Object.keys(deptDist).length,
            roleDistribution: roleDist,
            departmentDistribution: deptDist,
            recentRegistrations: all.slice(0, 5),
        };
    }
    async generateBulkTemplate() {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Q Clocker Enterprise Identity Engine';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Employee_Onboarding', {
            views: [{ state: 'frozen', ySplit: 1 }],
        });
        sheet.columns = [
            { header: 'EmployeeCode', key: 'employeeCode', width: 16 },
            { header: 'FirstName', key: 'firstName', width: 16 },
            { header: 'LastName', key: 'lastName', width: 16 },
            { header: 'CorporateEmail', key: 'email', width: 28 },
            { header: 'RoleCode', key: 'roleCode', width: 22 },
            { header: 'DepartmentCode', key: 'departmentCode', width: 18 },
            { header: 'JobTitle', key: 'jobTitle', width: 26 },
            { header: 'Phone', key: 'phone', width: 18 },
            { header: 'EmploymentType', key: 'employmentType', width: 18 },
            { header: 'WorkLocation', key: 'workLocation', width: 18 },
        ];
        const headerRow = sheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4338CA' },
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 26;
        sheet.addRow({
            employeeCode: 'EMP101',
            firstName: 'Emily',
            lastName: 'Carter',
            email: 'emily.carter@qclocker.io',
            roleCode: 'EMPLOYEE',
            departmentCode: 'ENG',
            jobTitle: 'Senior Full Stack Engineer',
            phone: '+1-555-0182',
            employmentType: 'FULL_TIME',
            workLocation: 'New York HQ',
        });
        sheet.addRow({
            employeeCode: 'EMP102',
            firstName: 'Liam',
            lastName: 'Nakamura',
            email: 'liam.nakamura@qclocker.io',
            roleCode: 'TEAM_LEAD',
            departmentCode: 'ENG',
            jobTitle: 'Lead Software Architect',
            phone: '+1-555-0183',
            employmentType: 'FULL_TIME',
            workLocation: 'San Francisco Hub',
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
    async bulkUpload(file, actorUser) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file buffer provided for bulk onboarding');
        }
        const rowsData = [];
        const isCsv = file.mimetype === 'text/csv' || (file.originalname && file.originalname.endsWith('.csv'));
        if (isCsv) {
            const content = file.buffer.toString('utf-8');
            const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
            if (lines.length <= 1) {
                throw new common_1.BadRequestException('CSV file must contain a header row and at least one data row');
            }
            const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
                const row = {};
                headers.forEach((h, idx) => {
                    row[h] = values[idx] || '';
                });
                rowsData.push({ rowNumber: i + 1, data: row });
            }
        }
        else {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
            if (!sheet || sheet.rowCount < 2) {
                throw new common_1.BadRequestException('Workbook must contain at least one data row');
            }
            const headers = [];
            const headerRow = sheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                headers[colNumber] = String(cell.value || '').trim();
            });
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1)
                    return;
                const rowData = {};
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber];
                    if (header) {
                        let val = cell.value;
                        if (val && typeof val === 'object' && 'text' in val) {
                            val = val.text;
                        }
                        rowData[header] = String(val ?? '').trim();
                    }
                });
                if (Object.keys(rowData).length > 0) {
                    rowsData.push({ rowNumber, data: rowData });
                }
            });
        }
        const report = {
            totalRows: rowsData.length,
            validRows: 0,
            invalidRows: 0,
            errors: [],
            insertedUsers: [],
        };
        for (const item of rowsData) {
            const d = item.data;
            const rowNum = item.rowNumber;
            const getVal = (...keys) => {
                for (const k of keys) {
                    for (const actualKey of Object.keys(d)) {
                        if (actualKey.toLowerCase() === k.toLowerCase()) {
                            return d[actualKey];
                        }
                    }
                }
                return '';
            };
            const firstName = getVal('firstName', 'first_name');
            const lastName = getVal('lastName', 'last_name');
            const email = getVal('email', 'corporateEmail', 'corporate_email');
            const employeeCode = getVal('employeeCode', 'employee_code') || `EMP-${Date.now().toString().slice(-4)}`;
            const roleCode = getVal('roleCode', 'role_code', 'role') || enums_1.UserRole.EMPLOYEE;
            const jobTitle = getVal('jobTitle', 'job_title', 'designation') || 'Employee';
            const phone = getVal('phone', 'phone_number');
            const employmentType = getVal('employmentType', 'employment_type') || enums_1.EmploymentType.FULL_TIME;
            const workLocation = getVal('workLocation', 'work_location') || 'Headquarters';
            if (!firstName || !lastName || !email) {
                report.invalidRows++;
                report.errors.push({
                    rowNumber: rowNum,
                    email,
                    error: 'Missing mandatory fields: firstName, lastName, and email are required',
                });
                continue;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                report.invalidRows++;
                report.errors.push({
                    rowNumber: rowNum,
                    email,
                    error: `Invalid corporate email format: ${email}`,
                });
                continue;
            }
            const existing = this.memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (existing) {
                report.invalidRows++;
                report.errors.push({
                    rowNumber: rowNum,
                    email,
                    error: `Account with email ${email} already exists`,
                });
                continue;
            }
            const tempPass = `Temp#${crypto.randomBytes(4).toString('hex')}2026!`;
            try {
                const created = await this.create({
                    firstName,
                    lastName,
                    email,
                    employeeCode,
                    roleCode: roleCode,
                    jobTitle,
                    phone,
                    employmentType: employmentType,
                    workLocation,
                    hasLoginAccount: true,
                    sendInvitation: true,
                }, actorUser);
                const memUser = this.memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
                if (memUser) {
                    memUser.isPasswordChangeRequired = true;
                    memUser.temporaryPassword = tempPass;
                }
                report.validRows++;
                report.insertedUsers.push({
                    id: created.id,
                    email: created.email,
                    employeeCode: created.employeeCode,
                    temporaryPassword: tempPass,
                });
            }
            catch (err) {
                report.invalidRows++;
                report.errors.push({
                    rowNumber: rowNum,
                    email,
                    error: err?.message || 'Failed to persist employee record',
                });
            }
        }
        return report;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map