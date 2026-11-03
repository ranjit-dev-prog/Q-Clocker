import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, and, isNull, desc, ilike, or } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ImportEmployeeRow } from './dto/import-employee.dto';
import { UserRole, AccountStatus, EmploymentType } from '../../common/enums';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  // In-memory persistent demo store
  private memoryUsers: Array<any> = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      referenceId: 'EMP-ADM001',
      employeeCode: 'EMP001',
      email: 'superadmin@qclocker.io',
      personalEmail: 'alex.vance@gmail.com',
      firstName: 'Alexander',
      lastName: 'Vance',
      phone: '+1-555-0100',
      roleCode: UserRole.SUPER_ADMIN,
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '80000000-0000-0000-0000-000000000002',
      designationName: 'Lead Cloud Infrastructure Architect',
      teamId: null,
      managerId: null,
      managerName: null,
      jobTitle: 'Chief Information Officer',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-01',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      referenceId: 'EMP-MGR001',
      employeeCode: 'EMP002',
      email: 'itmanager@qclocker.io',
      personalEmail: 'marcus.chen@gmail.com',
      firstName: 'Marcus',
      lastName: 'Chen',
      phone: '+1-555-0101',
      roleCode: UserRole.ADMIN,
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '80000000-0000-0000-0000-000000000002',
      designationName: 'Lead Cloud Infrastructure Architect',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'IT Infrastructure & Operations Manager',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-10',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date('2026-01-10').toISOString(),
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      referenceId: 'EMP-TL0001',
      employeeCode: 'EMP003',
      email: 'teamlead@qclocker.io',
      personalEmail: 'sarah.jenkins@gmail.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      phone: '+1-555-0102',
      roleCode: UserRole.TEAM_LEAD,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      designationId: '80000000-0000-0000-0000-000000000001',
      designationName: 'Full-Stack Software Engineer',
      teamId: '20000000-0000-0000-0000-000000000001',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Senior Engineering Lead',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-15',
      workLocation: 'Hybrid',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date('2026-01-15').toISOString(),
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      referenceId: 'EMP-EMP001',
      employeeCode: 'EMP004',
      email: 'employee@qclocker.io',
      personalEmail: 'david.ross@gmail.com',
      firstName: 'David',
      lastName: 'Ross',
      phone: '+1-555-0103',
      roleCode: UserRole.EMPLOYEE,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      designationId: '80000000-0000-0000-0000-000000000001',
      designationName: 'Full-Stack Software Engineer',
      teamId: '20000000-0000-0000-0000-000000000001',
      managerId: '00000000-0000-0000-0000-000000000003',
      managerName: 'Sarah Jenkins',
      jobTitle: 'Full-Stack Software Engineer',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-02-01',
      workLocation: 'Remote',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date('2026-02-01').toISOString(),
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateUserDto, creatorUser?: any) {
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

      // Check duplicate employeeCode if provided
      if (dto.employeeCode) {
        const existingCode = await this.dbService.db
          .select()
          .from(schema.users)
          .where(eq(schema.users.employeeCode, dto.employeeCode.trim()))
          .limit(1);
        if (existingCode.length > 0) {
          throw new ConflictException(`Employee badge code '${dto.employeeCode}' is already taken`);
        }
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
            description: 'Application Role',
            isSystem: true,
          })
          .returning();
      }

      const rawPassword = dto.password || crypto.randomBytes(16).toString('hex') + '!2026';
      const passwordHash = await bcrypt.hash(rawPassword, 10);
      const referenceId = generateReferenceId('EMP');

      let invitationToken: string | null = null;
      let invitationExpires: Date | null = null;
      let accountStatus = AccountStatus.ACTIVE;

      if (dto.sendInvitation) {
        const rawToken = crypto.randomBytes(32).toString('hex');
        invitationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        invitationExpires = new Date(Date.now() + 48 * 3600 * 1000);
        accountStatus = AccountStatus.INVITATION_PENDING;
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
          employmentType: dto.employmentType || EmploymentType.FULL_TIME,
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

    // In-memory fallback
    const existing = this.memoryUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      throw new ConflictException('An employee with this email already exists');
    }

    if (dto.employeeCode && this.memoryUsers.some((u) => u.employeeCode === dto.employeeCode)) {
      throw new ConflictException(`Employee badge code '${dto.employeeCode}' is already taken`);
    }

    const referenceId = generateReferenceId('EMP');
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
      employmentType: dto.employmentType || EmploymentType.FULL_TIME,
      joiningDate: dto.joiningDate || new Date().toISOString().substring(0, 10),
      workLocation: dto.workLocation?.trim() || 'Headquarters',
      hasLoginAccount: dto.hasLoginAccount !== false,
      accountStatus: dto.sendInvitation ? AccountStatus.INVITATION_PENDING : AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.memoryUsers.push(newUser);
    return newUser;
  }

  async findAll(query: UserQueryDto) {
    if (this.dbService.getConnectionStatus()) {
      const conditions: any[] = [];

      if (query.roleCode) {
        conditions.push(eq(schema.users.roleCode, query.roleCode));
      }
      if (query.departmentId) {
        conditions.push(eq(schema.users.departmentId, query.departmentId));
      }
      if (query.isActive !== undefined) {
        conditions.push(eq(schema.users.isActive, query.isActive));
      }
      if (query.search) {
        const pattern = `%${query.search.trim()}%`;
        conditions.push(
          or(
            ilike(schema.users.firstName, pattern),
            ilike(schema.users.lastName, pattern),
            ilike(schema.users.email, pattern),
            ilike(schema.users.referenceId, pattern),
            ilike(schema.users.jobTitle, pattern),
          ),
        );
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
        .leftJoin(schema.departments, eq(schema.users.departmentId, schema.departments.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(schema.users.createdAt));

      return rows;
    }

    return this.memoryUsers.filter((u) => {
      if (query.roleCode && u.roleCode !== query.roleCode) return false;
      if (query.departmentId && u.departmentId !== query.departmentId) return false;
      if (query.isActive !== undefined && u.isActive !== query.isActive) return false;
      if (query.search) {
        const s = query.search.toLowerCase();
        return (
          u.firstName.toLowerCase().includes(s) ||
          u.lastName.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.referenceId && u.referenceId.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }

  async findOne(id: string) {
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
        .leftJoin(schema.departments, eq(schema.users.departmentId, schema.departments.id))
        .where(or(eq(schema.users.id, id), eq(schema.users.referenceId, id)))
        .limit(1);

      if (!user) throw new NotFoundException(`Employee '${id}' not found`);
      return user;
    }

    const user = this.memoryUsers.find((u) => u.id === id || u.referenceId === id);
    if (!user) throw new NotFoundException(`Employee '${id}' not found`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.findOne(id);

    // Prevent circular reporting or employee reporting to self
    if (dto.managerId && dto.managerId === existing.id) {
      throw new BadRequestException('An employee cannot report to themselves');
    }

    if (this.dbService.getConnectionStatus()) {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (dto.firstName) updateData.firstName = dto.firstName.trim();
      if (dto.lastName) updateData.lastName = dto.lastName.trim();
      if (dto.employeeCode) updateData.employeeCode = dto.employeeCode.trim();
      if (dto.personalEmail !== undefined) updateData.personalEmail = dto.personalEmail;
      if (dto.phone !== undefined) updateData.phone = dto.phone;
      if (dto.roleCode) updateData.roleCode = dto.roleCode;
      if (dto.departmentId !== undefined) updateData.departmentId = dto.departmentId;
      if (dto.teamId !== undefined) updateData.teamId = dto.teamId;
      if (dto.designationId !== undefined) updateData.designationId = dto.designationId;
      if (dto.managerId !== undefined) updateData.managerId = dto.managerId;
      if (dto.jobTitle) updateData.jobTitle = dto.jobTitle.trim();
      if (dto.employmentType) updateData.employmentType = dto.employmentType;
      if (dto.joiningDate) updateData.joiningDate = dto.joiningDate;
      if (dto.workLocation) updateData.workLocation = dto.workLocation.trim();
      if (dto.hasLoginAccount !== undefined) updateData.hasLoginAccount = dto.hasLoginAccount;
      if (dto.accountStatus) updateData.accountStatus = dto.accountStatus;
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

      await this.dbService.db
        .update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, existing.id));

      return this.findOne(existing.id);
    }

    const user = this.memoryUsers.find((u) => u.id === existing.id);
    Object.assign(user, dto, { updatedAt: new Date().toISOString() });
    return user;
  }

  async archive(id: string, actorUser?: any) {
    const existing = await this.findOne(id);

    if (this.dbService.getConnectionStatus()) {
      await this.dbService.db
        .update(schema.users)
        .set({
          isActive: false,
          accountStatus: AccountStatus.ARCHIVED,
          archivedAt: new Date(),
          archivedById: actorUser?.id || null,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, existing.id));

      // Revoke all active sessions
      await this.dbService.db
        .update(schema.userSessions)
        .set({ isRevoked: true, updatedAt: new Date() })
        .where(eq(schema.userSessions.userId, existing.id));

      return { success: true, message: `Employee ${existing.referenceId} safely archived` };
    }

    const user = this.memoryUsers.find((u) => u.id === existing.id);
    user.isActive = false;
    user.accountStatus = AccountStatus.ARCHIVED;
    return { success: true, message: `Employee ${existing.referenceId} safely archived` };
  }

  async reactivate(id: string) {
    const existing = await this.findOne(id);
    if (this.dbService.getConnectionStatus()) {
      await this.dbService.db
        .update(schema.users)
        .set({
          isActive: true,
          accountStatus: AccountStatus.ACTIVE,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, existing.id));

      return { success: true, message: `Employee ${existing.referenceId} reactivated` };
    }

    const user = this.memoryUsers.find((u) => u.id === existing.id);
    user.isActive = true;
    user.accountStatus = AccountStatus.ACTIVE;
    return { success: true, message: `Employee ${existing.referenceId} reactivated` };
  }

  async remove(id: string) {
    return this.archive(id);
  }

  async findSubordinates(managerId: string) {
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db
        .select()
        .from(schema.users)
        .where(and(eq(schema.users.managerId, managerId), eq(schema.users.isActive, true)));
    }

    return this.memoryUsers.filter((u) => u.managerId === managerId && u.isActive);
  }

  /**
   * Bulk Employee Import Engine
   */
  getImportTemplate(): string {
    return `employee_code,first_name,last_name,email,department,designation,manager_email,role,joining_date,employment_type,work_location
EMP005,Rahul,Sharma,rahul.sharma@qclocker.io,Information Technology,Senior DevOps Architect,itmanager@qclocker.io,EMPLOYEE,2026-11-01,FULL_TIME,Headquarters
EMP006,Priya,Nair,priya.nair@qclocker.io,Software Engineering,Full-Stack Software Engineer,teamlead@qclocker.io,EMPLOYEE,2026-11-01,FULL_TIME,Hybrid`;
  }

  previewImport(csvContent: string, actorUser?: any) {
    const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
      throw new BadRequestException('CSV file must contain a header row and at least one data row');
    }

    const rawHeaders = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows: ImportEmployeeRow[] = [];
    const errors: Array<{ rowNumber: number; field: string; error: string }> = [];

    const existingEmails = new Set(this.memoryUsers.map((u) => u.email.toLowerCase()));
    const seenCsvEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Formula injection sanitization: strip dangerous leading characters
      const values = line.split(',').map((val) => {
        let clean = val.trim();
        if (clean.startsWith('=') || clean.startsWith('+') || clean.startsWith('-') || clean.startsWith('@')) {
          clean = clean.replace(/^[=+\-@]+/, '');
        }
        return clean;
      });

      const rowObj: any = {};
      rawHeaders.forEach((header, idx) => {
        rowObj[header] = values[idx] || '';
      });

      const email = (rowObj.email || '').toLowerCase().trim();
      const firstName = rowObj.first_name || '';
      const lastName = rowObj.last_name || '';
      const role = (rowObj.role || 'EMPLOYEE').toUpperCase().trim();

      // Row Validation
      if (!email) {
        errors.push({ rowNumber: i + 1, field: 'email', error: 'Email address is required' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ rowNumber: i + 1, field: 'email', error: 'Invalid email address format' });
      } else if (seenCsvEmails.has(email)) {
        errors.push({ rowNumber: i + 1, field: 'email', error: 'Duplicate email detected in CSV' });
      } else if (existingEmails.has(email)) {
        errors.push({ rowNumber: i + 1, field: 'email', error: 'Employee with this email already exists in system' });
      } else {
        seenCsvEmails.add(email);
      }

      if (!firstName) {
        errors.push({ rowNumber: i + 1, field: 'first_name', error: 'First name is required' });
      }
      if (!lastName) {
        errors.push({ rowNumber: i + 1, field: 'last_name', error: 'Last name is required' });
      }

      // Privilege escalation protection
      if ((role === 'SUPER_ADMIN' || role === 'ADMIN') && actorUser?.role !== UserRole.SUPER_ADMIN) {
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

  async confirmImport(rows: ImportEmployeeRow[], actorUser?: any) {
    let imported = 0;
    const failures: any[] = [];

    for (const r of rows) {
      try {
        await this.create(
          {
            employeeCode: r.employee_code,
            firstName: r.first_name,
            lastName: r.last_name,
            email: r.email,
            roleCode: (r.role as UserRole) || UserRole.EMPLOYEE,
            jobTitle: r.designation,
            employmentType: (r.employment_type as EmploymentType) || EmploymentType.FULL_TIME,
            joiningDate: r.joining_date,
            workLocation: r.work_location,
            hasLoginAccount: true,
            sendInvitation: true,
          },
          actorUser,
        );
        imported++;
      } catch (err) {
        failures.push({ email: r.email, error: (err as Error).message });
      }
    }

    return {
      importedCount: imported,
      failureCount: failures.length,
      failures,
      summary: `Successfully imported ${imported} employee(s). ${failures.length} failed.`,
    };
  }

  /**
   * Enterprise Admin Dashboard Metrics Aggregator
   */
  async getAdminDashboardMetrics() {
    const all = await this.findAll({});

    const activeEmployees = all.filter((u) => u.isActive && u.accountStatus === AccountStatus.ACTIVE).length;
    const inactiveEmployees = all.filter((u) => !u.isActive || u.accountStatus === AccountStatus.DEACTIVATED).length;
    const pendingInvitations = all.filter((u) => u.accountStatus === AccountStatus.INVITATION_PENDING).length;
    const archivedEmployees = all.filter((u) => u.accountStatus === AccountStatus.ARCHIVED).length;

    // Role Distribution
    const roleDist: Record<string, number> = {};
    all.forEach((u) => {
      roleDist[u.roleCode] = (roleDist[u.roleCode] || 0) + 1;
    });

    // Department Distribution
    const deptDist: Record<string, number> = {};
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
}
