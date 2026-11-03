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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const enums_1 = require("../../common/enums");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
let AuthService = AuthService_1 = class AuthService {
    dbService;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    demoAccounts = [
        {
            id: '00000000-0000-0000-0000-000000000001',
            referenceId: 'EMP-ADM001',
            email: 'superadmin@qclocker.io',
            passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi',
            firstName: 'Alexander',
            lastName: 'Vance',
            roleCode: enums_1.UserRole.SUPER_ADMIN,
            jobTitle: 'Chief Information Officer',
            departmentId: '10000000-0000-0000-0000-000000000001',
            isActive: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000002',
            referenceId: 'EMP-MGR001',
            email: 'itmanager@qclocker.io',
            passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi',
            firstName: 'Marcus',
            lastName: 'Chen',
            roleCode: enums_1.UserRole.ADMIN,
            jobTitle: 'IT Infrastructure & Operations Manager',
            departmentId: '10000000-0000-0000-0000-000000000001',
            isActive: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000003',
            referenceId: 'EMP-TL0001',
            email: 'teamlead@qclocker.io',
            passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            roleCode: enums_1.UserRole.TEAM_LEAD,
            jobTitle: 'Senior Engineering Lead',
            departmentId: '10000000-0000-0000-0000-000000000002',
            isActive: true,
        },
        {
            id: '00000000-0000-0000-0000-000000000004',
            referenceId: 'EMP-EMP001',
            email: 'employee@qclocker.io',
            passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi',
            firstName: 'David',
            lastName: 'Ross',
            roleCode: enums_1.UserRole.EMPLOYEE,
            jobTitle: 'Full-Stack Software Engineer',
            departmentId: '10000000-0000-0000-0000-000000000002',
            isActive: true,
        },
    ];
    demoSessions = [];
    constructor(dbService, jwtService) {
        this.dbService = dbService;
        this.jwtService = jwtService;
    }
    async login(loginDto, meta) {
        const { email, password } = loginDto;
        if (this.dbService.getConnectionStatus()) {
            try {
                const [user] = await this.dbService.db
                    .select()
                    .from(schema.users)
                    .where((0, drizzle_orm_1.eq)(schema.users.email, email.toLowerCase().trim()))
                    .limit(1);
                if (user) {
                    if (!user.isActive) {
                        throw new common_1.UnauthorizedException('Account is deactivated. Contact your administrator.');
                    }
                    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
                    if (!isPasswordValid) {
                        throw new common_1.UnauthorizedException('Invalid email or password credentials');
                    }
                    await this.dbService.db
                        .update(schema.users)
                        .set({ lastLoginAt: new Date() })
                        .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
                    return await this.generateAuthResponse({
                        id: user.id,
                        referenceId: user.referenceId,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.roleCode,
                        departmentId: user.departmentId,
                        teamId: user.teamId,
                        jobTitle: user.jobTitle,
                        avatarUrl: user.avatarUrl,
                    }, meta?.ipAddress, meta?.userAgent);
                }
            }
            catch (err) {
                if (err instanceof common_1.UnauthorizedException) {
                    throw err;
                }
                this.logger.warn(`Database login check had issue: ${err.message}. Trying fallback.`);
            }
        }
        const demo = this.demoAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim());
        if (demo) {
            const validDemoPasswords = [
                'SuperAdmin@2026!',
                'Manager@2026!',
                'TeamLead@2026!',
                'Employee@2026!',
                'password123',
            ];
            if (!validDemoPasswords.includes(password) && !(await bcrypt.compare(password, demo.passwordHash))) {
                throw new common_1.UnauthorizedException('Invalid email or password credentials');
            }
            return await this.generateAuthResponse({
                id: demo.id,
                referenceId: demo.referenceId,
                email: demo.email,
                firstName: demo.firstName,
                lastName: demo.lastName,
                role: demo.roleCode,
                departmentId: demo.departmentId,
                teamId: null,
                jobTitle: demo.jobTitle,
                avatarUrl: null,
            }, meta?.ipAddress, meta?.userAgent);
        }
        throw new common_1.UnauthorizedException('Invalid email or password credentials');
    }
    async register(registerDto, meta) {
        const { email, password, firstName, lastName, roleCode, departmentId, teamId, jobTitle, phone } = registerDto;
        const normalizedEmail = email.toLowerCase().trim();
        if (this.dbService.getConnectionStatus()) {
            const existing = await this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.email, normalizedEmail))
                .limit(1);
            if (existing.length > 0) {
                throw new common_1.ConflictException('An employee account with this email already exists');
            }
            const targetRoleCode = roleCode || enums_1.UserRole.EMPLOYEE;
            let [role] = await this.dbService.db
                .select()
                .from(schema.roles)
                .where((0, drizzle_orm_1.eq)(schema.roles.code, targetRoleCode))
                .limit(1);
            if (!role) {
                [role] = await this.dbService.db
                    .insert(schema.roles)
                    .values({
                    code: targetRoleCode,
                    name: targetRoleCode.replace('_', ' '),
                    description: 'Application Role',
                    isSystem: true,
                })
                    .returning();
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const referenceId = (0, reference_id_util_1.generateReferenceId)('EMP');
            const [newUser] = await this.dbService.db
                .insert(schema.users)
                .values({
                referenceId,
                email: normalizedEmail,
                passwordHash,
                firstName,
                lastName,
                phone,
                roleId: role.id,
                roleCode: targetRoleCode,
                departmentId: departmentId || null,
                teamId: teamId || null,
                jobTitle: jobTitle || 'Team Member',
                isActive: true,
            })
                .returning();
            return await this.generateAuthResponse({
                id: newUser.id,
                referenceId: newUser.referenceId,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.roleCode,
                departmentId: newUser.departmentId,
                teamId: newUser.teamId,
                jobTitle: newUser.jobTitle,
                avatarUrl: null,
            }, meta?.ipAddress, meta?.userAgent);
        }
        const existingDemo = this.demoAccounts.find((a) => a.email === normalizedEmail);
        if (existingDemo) {
            throw new common_1.ConflictException('An employee account with this email already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newDemoUser = {
            id: crypto.randomUUID(),
            referenceId: (0, reference_id_util_1.generateReferenceId)('EMP'),
            email: normalizedEmail,
            passwordHash,
            firstName,
            lastName,
            roleCode: roleCode || enums_1.UserRole.EMPLOYEE,
            jobTitle: jobTitle || 'Team Member',
            departmentId: departmentId || null,
            isActive: true,
        };
        this.demoAccounts.push(newDemoUser);
        return await this.generateAuthResponse({
            id: newDemoUser.id,
            referenceId: newDemoUser.referenceId,
            email: newDemoUser.email,
            firstName: newDemoUser.firstName,
            lastName: newDemoUser.lastName,
            role: newDemoUser.roleCode,
            departmentId: newDemoUser.departmentId,
            teamId: null,
            jobTitle: newDemoUser.jobTitle,
            avatarUrl: null,
        }, meta?.ipAddress, meta?.userAgent);
    }
    async refreshToken(dto, meta) {
        const rawToken = dto.refreshToken.trim();
        if (!rawToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        if (this.dbService.getConnectionStatus()) {
            const [session] = await this.dbService.db
                .select()
                .from(schema.userSessions)
                .where((0, drizzle_orm_1.eq)(schema.userSessions.refreshTokenHash, tokenHash))
                .limit(1);
            if (!session) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (session.isRevoked) {
                this.logger.error(`Security Alert: Refresh token reuse detected for user ${session.userId}. Revoking all sessions.`);
                await this.dbService.db
                    .update(schema.userSessions)
                    .set({ isRevoked: true, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema.userSessions.userId, session.userId));
                throw new common_1.UnauthorizedException('Security alert: Token reuse detected. All sessions revoked.');
            }
            if (new Date(session.expiresAt) < new Date()) {
                await this.dbService.db
                    .update(schema.userSessions)
                    .set({ isRevoked: true, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema.userSessions.id, session.id));
                throw new common_1.UnauthorizedException('Refresh token has expired. Please log in again.');
            }
            await this.dbService.db
                .update(schema.userSessions)
                .set({ isRevoked: true, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.userSessions.id, session.id));
            const [user] = await this.dbService.db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.id, session.userId))
                .limit(1);
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User account is inactive or deleted');
            }
            return await this.generateAuthResponse({
                id: user.id,
                referenceId: user.referenceId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.roleCode,
                departmentId: user.departmentId,
                teamId: user.teamId,
                jobTitle: user.jobTitle,
                avatarUrl: user.avatarUrl,
            }, meta?.ipAddress, meta?.userAgent);
        }
        const session = this.demoSessions.find((s) => s.refreshTokenHash === tokenHash);
        if (!session) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (session.isRevoked) {
            this.demoSessions
                .filter((s) => s.userId === session.userId)
                .forEach((s) => (s.isRevoked = true));
            throw new common_1.UnauthorizedException('Security alert: Token reuse detected. All sessions revoked.');
        }
        if (session.expiresAt < new Date()) {
            session.isRevoked = true;
            throw new common_1.UnauthorizedException('Refresh token has expired. Please log in again.');
        }
        session.isRevoked = true;
        const demo = this.demoAccounts.find((a) => a.id === session.userId);
        if (!demo || !demo.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive or not found');
        }
        return await this.generateAuthResponse({
            id: demo.id,
            referenceId: demo.referenceId,
            email: demo.email,
            firstName: demo.firstName,
            lastName: demo.lastName,
            role: demo.roleCode,
            departmentId: demo.departmentId,
            teamId: null,
            jobTitle: demo.jobTitle,
            avatarUrl: null,
        }, meta?.ipAddress, meta?.userAgent);
    }
    async logout(userId, refreshToken) {
        if (this.dbService.getConnectionStatus()) {
            if (refreshToken) {
                const tokenHash = crypto.createHash('sha256').update(refreshToken.trim()).digest('hex');
                await this.dbService.db
                    .update(schema.userSessions)
                    .set({ isRevoked: true, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema.userSessions.refreshTokenHash, tokenHash));
            }
            else {
                await this.dbService.db
                    .update(schema.userSessions)
                    .set({ isRevoked: true, updatedAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema.userSessions.userId, userId));
            }
            return { success: true, message: 'Logged out successfully' };
        }
        if (refreshToken) {
            const tokenHash = crypto.createHash('sha256').update(refreshToken.trim()).digest('hex');
            const s = this.demoSessions.find((x) => x.refreshTokenHash === tokenHash);
            if (s)
                s.isRevoked = true;
        }
        else {
            this.demoSessions.filter((x) => x.userId === userId).forEach((x) => (x.isRevoked = true));
        }
        return { success: true, message: 'Logged out successfully' };
    }
    async logoutAll(userId) {
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.userSessions)
                .set({ isRevoked: true, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.userSessions.userId, userId));
        }
        else {
            this.demoSessions.filter((x) => x.userId === userId).forEach((x) => (x.isRevoked = true));
        }
        return { success: true, message: 'All active sessions revoked successfully' };
    }
    async getActiveSessions(userId) {
        if (this.dbService.getConnectionStatus()) {
            const sessions = await this.dbService.db
                .select({
                id: schema.userSessions.id,
                userAgent: schema.userSessions.userAgent,
                ipAddress: schema.userSessions.ipAddress,
                expiresAt: schema.userSessions.expiresAt,
                createdAt: schema.userSessions.createdAt,
            })
                .from(schema.userSessions)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.userSessions.userId, userId), (0, drizzle_orm_1.eq)(schema.userSessions.isRevoked, false), (0, drizzle_orm_1.gt)(schema.userSessions.expiresAt, new Date())))
                .orderBy((0, drizzle_orm_1.desc)(schema.userSessions.createdAt));
            return sessions;
        }
        return this.demoSessions
            .filter((s) => s.userId === userId && !s.isRevoked && s.expiresAt > new Date())
            .map((s) => ({
            id: s.id,
            userAgent: s.userAgent,
            ipAddress: s.ipAddress,
            expiresAt: s.expiresAt,
            createdAt: s.createdAt,
        }));
    }
    async getProfile(userId) {
        if (this.dbService.getConnectionStatus()) {
            const [user] = await this.dbService.db
                .select({
                id: schema.users.id,
                referenceId: schema.users.referenceId,
                email: schema.users.email,
                firstName: schema.users.firstName,
                lastName: schema.users.lastName,
                phone: schema.users.phone,
                avatarUrl: schema.users.avatarUrl,
                role: schema.users.roleCode,
                departmentId: schema.users.departmentId,
                teamId: schema.users.teamId,
                jobTitle: schema.users.jobTitle,
                isActive: schema.users.isActive,
                createdAt: schema.users.createdAt,
            })
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.id, userId))
                .limit(1);
            if (user) {
                return user;
            }
        }
        const demo = this.demoAccounts.find((a) => a.id === userId);
        if (demo) {
            return {
                id: demo.id,
                referenceId: demo.referenceId,
                email: demo.email,
                firstName: demo.firstName,
                lastName: demo.lastName,
                phone: '+1-555-0100',
                avatarUrl: null,
                role: demo.roleCode,
                departmentId: demo.departmentId,
                teamId: null,
                jobTitle: demo.jobTitle,
                isActive: demo.isActive,
                createdAt: new Date().toISOString(),
            };
        }
        throw new common_1.NotFoundException('User profile not found');
    }
    async generateAuthResponse(user, ipAddress, userAgent) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const expiresIn = 86400;
        const accessToken = this.jwtService.sign(payload, { expiresIn });
        const rawRefreshToken = crypto.randomBytes(40).toString('hex');
        const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        if (this.dbService.getConnectionStatus()) {
            try {
                await this.dbService.db.insert(schema.userSessions).values({
                    referenceId: (0, reference_id_util_1.generateReferenceId)('SES'),
                    userId: user.id,
                    refreshTokenHash,
                    userAgent: userAgent || null,
                    ipAddress: ipAddress || null,
                    isRevoked: false,
                    expiresAt,
                });
            }
            catch (err) {
                this.logger.warn(`Failed to persist user session: ${err.message}`);
            }
        }
        else {
            this.demoSessions.push({
                id: crypto.randomUUID(),
                userId: user.id,
                refreshTokenHash,
                userAgent: userAgent || null,
                ipAddress: ipAddress || null,
                isRevoked: false,
                expiresAt,
                createdAt: new Date(),
            });
        }
        return {
            accessToken,
            refreshToken: rawRefreshToken,
            expiresIn,
            user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map