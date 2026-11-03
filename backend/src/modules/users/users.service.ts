import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, and, isNull, desc, ilike, or } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserRole } from '../../common/enums';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // In-memory persistent demo store
  private memoryUsers: Array<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    roleCode: UserRole;
    departmentId: string | null;
    departmentName: string;
    teamId: string | null;
    managerId: string | null;
    jobTitle: string;
    isActive: boolean;
    createdAt: string;
  }> = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'superadmin@qclocker.io',
      firstName: 'Alexander',
      lastName: 'Vance',
      phone: '+1-555-0100',
      roleCode: UserRole.SUPER_ADMIN,
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
      roleCode: UserRole.ADMIN,
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
      roleCode: UserRole.TEAM_LEAD,
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
      roleCode: UserRole.EMPLOYEE,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      teamId: '20000000-0000-0000-0000-000000000001',
      managerId: '00000000-0000-0000-0000-000000000003',
      jobTitle: 'Full-Stack Software Engineer',
      isActive: true,
      createdAt: new Date('2026-02-01').toISOString(),
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateUserDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    if (this.dbService.getConnectionStatus()) {
      const existing = await this.dbService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictException('An employee with this email already exists');
      }

      // Find role
      let [role] = await this.dbService.db
        .select()
        .from(schema.roles)
        .where(eq(schema.roles.code, dto.roleCode))
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

    // Fallback in-memory
    const existing = this.memoryUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      throw new ConflictException('An employee with this email already exists');
    }

    const newUser = {
      id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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

  async findAll(query?: UserQueryDto) {
    if (this.dbService.getConnectionStatus()) {
      let conditions = [isNull(schema.users.deletedAt)];

      if (query?.role) {
        conditions.push(eq(schema.users.roleCode, query.role));
      }
      if (query?.departmentId) {
        conditions.push(eq(schema.users.departmentId, query.departmentId));
      }
      if (query?.isActive !== undefined) {
        conditions.push(eq(schema.users.isActive, query.isActive === 'true'));
      }
      if (query?.search) {
        const term = `%${query.search.trim()}%`;
        conditions.push(
          or(
            ilike(schema.users.firstName, term),
            ilike(schema.users.lastName, term),
            ilike(schema.users.email, term),
          ) as any,
        );
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
        .where(and(...conditions))
        .orderBy(desc(schema.users.createdAt));
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
      results = results.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    return results;
  }

  async findOne(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [user] = await this.dbService.db
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.id, id), isNull(schema.users.deletedAt)))
        .limit(1);

      if (!user) throw new NotFoundException('Employee not found');
      const { passwordHash, ...cleanUser } = user;
      return cleanUser;
    }

    const found = this.memoryUsers.find((u) => u.id === id);
    if (!found) throw new NotFoundException('Employee not found');
    return found;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (this.dbService.getConnectionStatus()) {
      const [existing] = await this.dbService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      if (!existing) throw new NotFoundException('Employee not found');

      const updatePayload: Record<string, any> = {
        updatedAt: new Date(),
      };
      if (dto.firstName) updatePayload.firstName = dto.firstName;
      if (dto.lastName) updatePayload.lastName = dto.lastName;
      if (dto.phone !== undefined) updatePayload.phone = dto.phone;
      if (dto.roleCode) updatePayload.roleCode = dto.roleCode;
      if (dto.departmentId !== undefined) updatePayload.departmentId = dto.departmentId;
      if (dto.teamId !== undefined) updatePayload.teamId = dto.teamId;
      if (dto.managerId !== undefined) updatePayload.managerId = dto.managerId;
      if (dto.jobTitle !== undefined) updatePayload.jobTitle = dto.jobTitle;
      if (dto.isActive !== undefined) updatePayload.isActive = dto.isActive;

      const [updated] = await this.dbService.db
        .update(schema.users)
        .set(updatePayload)
        .where(eq(schema.users.id, id))
        .returning();

      const { passwordHash, ...clean } = updated;
      return clean;
    }

    const index = this.memoryUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Employee not found');

    this.memoryUsers[index] = {
      ...this.memoryUsers[index],
      ...dto,
    };
    return this.memoryUsers[index];
  }

  async remove(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [user] = await this.dbService.db
        .update(schema.users)
        .set({ deletedAt: new Date(), isActive: false })
        .where(eq(schema.users.id, id))
        .returning();

      if (!user) throw new NotFoundException('Employee not found');
      return { message: 'Employee successfully deactivated and archived' };
    }

    const index = this.memoryUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Employee not found');
    this.memoryUsers[index].isActive = false;
    return { message: 'Employee successfully deactivated and archived' };
  }

  async findSubordinates(managerId: string) {
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
        .where(and(eq(schema.users.managerId, managerId), isNull(schema.users.deletedAt)));
    }

    return this.memoryUsers.filter((u) => u.managerId === managerId);
  }
}
