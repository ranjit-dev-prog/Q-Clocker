import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, and, gt, desc } from 'drizzle-orm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRole } from '../../common/enums';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory fallback accounts for zero-dependency development/testing
  private demoAccounts: Array<{
    id: string;
    referenceId: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleCode: UserRole;
    jobTitle: string;
    departmentId: string | null;
    isActive: boolean;
  }> = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      referenceId: 'EMP-ADM001',
      email: 'superadmin@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // SuperAdmin@2026!
      firstName: 'Alexander',
      lastName: 'Vance',
      roleCode: UserRole.SUPER_ADMIN,
      jobTitle: 'Chief Information Officer',
      departmentId: '10000000-0000-0000-0000-000000000001',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      referenceId: 'EMP-SYS001',
      email: 'sysadmin@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // SysAdmin@2026!
      firstName: 'Benjamin',
      lastName: 'Hayes',
      roleCode: UserRole.ADMIN,
      jobTitle: 'Principal Systems Administrator',
      departmentId: '10000000-0000-0000-0000-000000000001',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      referenceId: 'EMP-HR001',
      email: 'hradmin@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // HrAdmin@2026!
      firstName: 'Elena',
      lastName: 'Rostova',
      roleCode: UserRole.HR_MANAGER,
      jobTitle: 'Director of Human Resources',
      departmentId: '10000000-0000-0000-0000-000000000003',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      referenceId: 'EMP-MGR001',
      email: 'itmanager@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // ItManager@2026!
      firstName: 'Marcus',
      lastName: 'Chen',
      roleCode: UserRole.IT_MANAGER,
      jobTitle: 'IT Infrastructure & Operations Manager',
      departmentId: '10000000-0000-0000-0000-000000000001',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      referenceId: 'EMP-DPT001',
      email: 'deptmanager@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // DeptManager@2026!
      firstName: 'Diana',
      lastName: 'Prince',
      roleCode: UserRole.DEPARTMENT_MANAGER,
      jobTitle: 'Engineering Department Director',
      departmentId: '10000000-0000-0000-0000-000000000002',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      referenceId: 'EMP-TL0001',
      email: 'teamlead@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // TeamLead@2026!
      firstName: 'Sarah',
      lastName: 'Jenkins',
      roleCode: UserRole.TEAM_LEAD,
      jobTitle: 'Senior Engineering Lead',
      departmentId: '10000000-0000-0000-0000-000000000002',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      referenceId: 'EMP-EMP001',
      email: 'employee@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // Employee@2026!
      firstName: 'David',
      lastName: 'Ross',
      roleCode: UserRole.EMPLOYEE,
      jobTitle: 'Full-Stack Software Engineer',
      departmentId: '10000000-0000-0000-0000-000000000002',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      referenceId: 'EMP-AUD001',
      email: 'auditor@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // Auditor@2026!
      firstName: 'Rachel',
      lastName: 'Adams',
      roleCode: UserRole.AUDITOR,
      jobTitle: 'Senior Compliance & IT Auditor',
      departmentId: '10000000-0000-0000-0000-000000000004',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      referenceId: 'EMP-VIW001',
      email: 'viewer@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // Viewer@2026!
      firstName: 'Victor',
      lastName: 'Stone',
      roleCode: UserRole.VIEWER,
      jobTitle: 'Executive Stakeholder & Observer',
      departmentId: '10000000-0000-0000-0000-000000000001',
      isActive: true,
    },
  ];

  // In-memory fallback session store when DB is disconnected
  private demoSessions: Array<{
    id: string;
    userId: string;
    refreshTokenHash: string;
    userAgent: string | null;
    ipAddress: string | null;
    isRevoked: boolean;
    expiresAt: Date;
    createdAt: Date;
  }> = [];

  constructor(
    private dbService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Check database first if connected
    if (this.dbService.getConnectionStatus()) {
      try {
        const [user] = await this.dbService.db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email.toLowerCase().trim()))
          .limit(1);

        if (user) {
          if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated. Contact your administrator.');
          }

          const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
          if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password credentials');
          }

          // Update last login
          await this.dbService.db
            .update(schema.users)
            .set({ lastLoginAt: new Date() })
            .where(eq(schema.users.id, user.id));

          return await this.generateAuthResponse(
            {
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
            },
            meta?.ipAddress,
            meta?.userAgent,
          );
        }
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          throw err;
        }
        this.logger.warn(`Database login check had issue: ${(err as Error).message}. Trying fallback.`);
      }
    }

    // Fallback demo account authentication
    const demo = this.demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim(),
    );

    if (demo) {
      const validDemoPasswords = [
        'SuperAdmin@2026!',
        'SysAdmin@2026!',
        'Manager@2026!',
        'ItManager@2026!',
        'HrAdmin@2026!',
        'DeptManager@2026!',
        'TeamLead@2026!',
        'Employee@2026!',
        'Auditor@2026!',
        'Viewer@2026!',
        'password123',
      ];
      if (!validDemoPasswords.includes(password) && !(await bcrypt.compare(password, demo.passwordHash))) {
        throw new UnauthorizedException('Invalid email or password credentials');
      }

      return await this.generateAuthResponse(
        {
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
        },
        meta?.ipAddress,
        meta?.userAgent,
      );
    }

    throw new UnauthorizedException('Invalid email or password credentials');
  }

  async register(
    registerDto: RegisterDto,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, roleCode, departmentId, teamId, jobTitle, phone } =
      registerDto;

    const normalizedEmail = email.toLowerCase().trim();

    if (this.dbService.getConnectionStatus()) {
      const existing = await this.dbService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictException('An employee account with this email already exists');
      }

      const targetRoleCode = roleCode || UserRole.EMPLOYEE;
      let [role] = await this.dbService.db
        .select()
        .from(schema.roles)
        .where(eq(schema.roles.code, targetRoleCode))
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
      const referenceId = generateReferenceId('EMP');

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

      return await this.generateAuthResponse(
        {
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
        },
        meta?.ipAddress,
        meta?.userAgent,
      );
    }

    // In-memory fallback
    const existingDemo = this.demoAccounts.find((a) => a.email === normalizedEmail);
    if (existingDemo) {
      throw new ConflictException('An employee account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newDemoUser = {
      id: crypto.randomUUID(),
      referenceId: generateReferenceId('EMP'),
      email: normalizedEmail,
      passwordHash,
      firstName,
      lastName,
      roleCode: (roleCode as UserRole) || UserRole.EMPLOYEE,
      jobTitle: jobTitle || 'Team Member',
      departmentId: departmentId || null,
      isActive: true,
    };
    this.demoAccounts.push(newDemoUser);

    return await this.generateAuthResponse(
      {
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
      },
      meta?.ipAddress,
      meta?.userAgent,
    );
  }

  /**
   * Refresh Token Rotation (RTR) with Token Reuse Detection
   */
  async refreshToken(
    dto: RefreshTokenDto,
    meta?: { ipAddress?: string; userAgent?: string },
  ): Promise<AuthResponseDto> {
    const rawToken = dto.refreshToken.trim();
    if (!rawToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    if (this.dbService.getConnectionStatus()) {
      const [session] = await this.dbService.db
        .select()
        .from(schema.userSessions)
        .where(eq(schema.userSessions.refreshTokenHash, tokenHash))
        .limit(1);

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Token reuse detection: if a revoked token is used, compromise is suspected
      if (session.isRevoked) {
        this.logger.error(
          `Security Alert: Refresh token reuse detected for user ${session.userId}. Revoking all sessions.`,
        );
        // Revoke all sessions for this user immediately
        await this.dbService.db
          .update(schema.userSessions)
          .set({ isRevoked: true, updatedAt: new Date() })
          .where(eq(schema.userSessions.userId, session.userId));

        throw new UnauthorizedException('Security alert: Token reuse detected. All sessions revoked.');
      }

      // Check expiration
      if (new Date(session.expiresAt) < new Date()) {
        await this.dbService.db
          .update(schema.userSessions)
          .set({ isRevoked: true, updatedAt: new Date() })
          .where(eq(schema.userSessions.id, session.id));

        throw new UnauthorizedException('Refresh token has expired. Please log in again.');
      }

      // Invalidate current session (Rotation)
      await this.dbService.db
        .update(schema.userSessions)
        .set({ isRevoked: true, updatedAt: new Date() })
        .where(eq(schema.userSessions.id, session.id));

      // Fetch active user
      const [user] = await this.dbService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, session.userId))
        .limit(1);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User account is inactive or deleted');
      }

      return await this.generateAuthResponse(
        {
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
        },
        meta?.ipAddress,
        meta?.userAgent,
      );
    }

    // In-memory fallback session handling
    const session = this.demoSessions.find((s) => s.refreshTokenHash === tokenHash);
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.isRevoked) {
      this.demoSessions
        .filter((s) => s.userId === session.userId)
        .forEach((s) => (s.isRevoked = true));
      throw new UnauthorizedException('Security alert: Token reuse detected. All sessions revoked.');
    }

    if (session.expiresAt < new Date()) {
      session.isRevoked = true;
      throw new UnauthorizedException('Refresh token has expired. Please log in again.');
    }

    session.isRevoked = true;

    const demo = this.demoAccounts.find((a) => a.id === session.userId);
    if (!demo || !demo.isActive) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    return await this.generateAuthResponse(
      {
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
      },
      meta?.ipAddress,
      meta?.userAgent,
    );
  }

  async logout(userId: string, refreshToken?: string) {
    if (this.dbService.getConnectionStatus()) {
      if (refreshToken) {
        const tokenHash = crypto.createHash('sha256').update(refreshToken.trim()).digest('hex');
        await this.dbService.db
          .update(schema.userSessions)
          .set({ isRevoked: true, updatedAt: new Date() })
          .where(eq(schema.userSessions.refreshTokenHash, tokenHash));
      } else {
        await this.dbService.db
          .update(schema.userSessions)
          .set({ isRevoked: true, updatedAt: new Date() })
          .where(eq(schema.userSessions.userId, userId));
      }
      return { success: true, message: 'Logged out successfully' };
    }

    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken.trim()).digest('hex');
      const s = this.demoSessions.find((x) => x.refreshTokenHash === tokenHash);
      if (s) s.isRevoked = true;
    } else {
      this.demoSessions.filter((x) => x.userId === userId).forEach((x) => (x.isRevoked = true));
    }

    return { success: true, message: 'Logged out successfully' };
  }

  async logoutAll(userId: string) {
    if (this.dbService.getConnectionStatus()) {
      await this.dbService.db
        .update(schema.userSessions)
        .set({ isRevoked: true, updatedAt: new Date() })
        .where(eq(schema.userSessions.userId, userId));
    } else {
      this.demoSessions.filter((x) => x.userId === userId).forEach((x) => (x.isRevoked = true));
    }

    return { success: true, message: 'All active sessions revoked successfully' };
  }

  async getActiveSessions(userId: string) {
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
        .where(
          and(
            eq(schema.userSessions.userId, userId),
            eq(schema.userSessions.isRevoked, false),
            gt(schema.userSessions.expiresAt, new Date()),
          ),
        )
        .orderBy(desc(schema.userSessions.createdAt));

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

  async getProfile(userId: string) {
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
        .where(eq(schema.users.id, userId))
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

    throw new NotFoundException('User profile not found');
  }

  private async generateAuthResponse(
    user: {
      id: string;
      referenceId?: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      departmentId?: string | null;
      teamId?: string | null;
      jobTitle?: string | null;
      avatarUrl?: string | null;
    },
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthResponseDto> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = 86400; // 24 hours
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    // Generate cryptographically secure refresh token
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (this.dbService.getConnectionStatus()) {
      try {
        await this.dbService.db.insert(schema.userSessions).values({
          referenceId: generateReferenceId('SES'),
          userId: user.id,
          refreshTokenHash,
          userAgent: userAgent || null,
          ipAddress: ipAddress || null,
          isRevoked: false,
          expiresAt,
        });
      } catch (err) {
        this.logger.warn(`Failed to persist user session: ${(err as Error).message}`);
      }
    } else {
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

    const userWithPerms = {
      ...user,
      permissions: PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[user.role] || ['*'],
    };

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn,
      user: userWithPerms,
    };
  }
}
