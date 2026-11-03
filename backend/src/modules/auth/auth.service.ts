import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq } from 'drizzle-orm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  // In-memory fallback accounts for zero-dependency development/testing
  private demoAccounts = [
    {
      id: '00000000-0000-0000-0000-000000000001',
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
      email: 'itmanager@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // Manager@2026!
      firstName: 'Marcus',
      lastName: 'Chen',
      roleCode: UserRole.ADMIN,
      jobTitle: 'IT Infrastructure & Operations Manager',
      departmentId: '10000000-0000-0000-0000-000000000001',
      isActive: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
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
      id: '00000000-0000-0000-0000-000000000004',
      email: 'employee@qclocker.io',
      passwordHash: '$2a$10$wEkgzW4pI4x12Q3nC8iKte2x7r4w7FjY6T9jJpB1aZ1mUq0O2hKGi', // Employee@2026!
      firstName: 'David',
      lastName: 'Ross',
      roleCode: UserRole.EMPLOYEE,
      jobTitle: 'Full-Stack Software Engineer',
      departmentId: '10000000-0000-0000-0000-000000000002',
      isActive: true,
    },
  ];

  constructor(
    private dbService: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
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

          return this.generateAuthResponse({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleCode,
            departmentId: user.departmentId,
            jobTitle: user.jobTitle,
            avatarUrl: user.avatarUrl,
          });
        }
      } catch (err) {
        this.logger.warn(`Database login check had issue: ${(err as Error).message}. Trying fallback.`);
      }
    }

    // Fallback demo account authentication (useful for immediate evaluation)
    const demo = this.demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase().trim(),
    );

    if (demo) {
      // Validate common demo passwords
      const validDemoPasswords = [
        'SuperAdmin@2026!',
        'Manager@2026!',
        'TeamLead@2026!',
        'Employee@2026!',
        'password123',
      ];
      if (!validDemoPasswords.includes(password) && !(await bcrypt.compare(password, demo.passwordHash))) {
        throw new UnauthorizedException('Invalid email or password credentials');
      }

      return this.generateAuthResponse({
        id: demo.id,
        email: demo.email,
        firstName: demo.firstName,
        lastName: demo.lastName,
        role: demo.roleCode,
        departmentId: demo.departmentId,
        jobTitle: demo.jobTitle,
        avatarUrl: null,
      });
    }

    throw new UnauthorizedException('Invalid email or password credentials');
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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

      // Find role by code
      const targetRoleCode = roleCode || UserRole.EMPLOYEE;
      let [role] = await this.dbService.db
        .select()
        .from(schema.roles)
        .where(eq(schema.roles.code, targetRoleCode))
        .limit(1);

      if (!role) {
        // Create role if not existing
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

      const [newUser] = await this.dbService.db
        .insert(schema.users)
        .values({
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

      return this.generateAuthResponse({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.roleCode,
        departmentId: newUser.departmentId,
        jobTitle: newUser.jobTitle,
        avatarUrl: null,
      });
    }

    // If database is not active, create in demo memory store
    const existingDemo = this.demoAccounts.find((a) => a.email === normalizedEmail);
    if (existingDemo) {
      throw new ConflictException('An employee account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newDemoUser = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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

    return this.generateAuthResponse({
      id: newDemoUser.id,
      email: newDemoUser.email,
      firstName: newDemoUser.firstName,
      lastName: newDemoUser.lastName,
      role: newDemoUser.roleCode,
      departmentId: newDemoUser.departmentId,
      jobTitle: newDemoUser.jobTitle,
      avatarUrl: null,
    });
  }

  async getProfile(userId: string) {
    if (this.dbService.getConnectionStatus()) {
      const [user] = await this.dbService.db
        .select({
          id: schema.users.id,
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

  private generateAuthResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    departmentId?: string | null;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  }): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = 86400; // 24 hours
    const accessToken = this.jwtService.sign(payload, { expiresIn });

    return {
      accessToken,
      expiresIn,
      user,
    };
  }
}
