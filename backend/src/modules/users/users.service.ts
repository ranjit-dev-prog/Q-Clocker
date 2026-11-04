import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ImportEmployeeRow } from './dto/import-employee.dto';
import { UserRole, AccountStatus, EmploymentType } from '../../common/enums';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import * as crypto from 'crypto';
import * as ExcelJS from 'exceljs';

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
      referenceId: 'EMP-SYS001',
      employeeCode: 'EMP002',
      email: 'sysadmin@qclocker.io',
      personalEmail: 'ben.hayes@gmail.com',
      firstName: 'Benjamin',
      lastName: 'Hayes',
      phone: '+1-555-0101',
      roleCode: UserRole.ADMIN,
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '80000000-0000-0000-0000-000000000002',
      designationName: 'Principal Systems Administrator',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Principal Systems Administrator',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-05',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
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
      roleCode: UserRole.HR_MANAGER,
      departmentId: '10000000-0000-0000-0000-000000000003',
      departmentName: 'Human Resources',
      designationId: '80000000-0000-0000-0000-000000000003',
      designationName: 'HR Director',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Director of Human Resources',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-08',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
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
      roleCode: UserRole.IT_MANAGER,
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '80000000-0000-0000-0000-000000000002',
      designationName: 'IT Operations Lead',
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
      id: '00000000-0000-0000-0000-000000000005',
      referenceId: 'EMP-DPT001',
      employeeCode: 'EMP005',
      email: 'deptmanager@qclocker.io',
      personalEmail: 'diana.prince@gmail.com',
      firstName: 'Diana',
      lastName: 'Prince',
      phone: '+1-555-0104',
      roleCode: UserRole.DEPARTMENT_MANAGER,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      designationId: '80000000-0000-0000-0000-000000000001',
      designationName: 'Director of Engineering',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Engineering Department Director',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-01-12',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
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
      roleCode: UserRole.TEAM_LEAD,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      designationId: '80000000-0000-0000-0000-000000000001',
      designationName: 'Full-Stack Software Engineer',
      teamId: '20000000-0000-0000-0000-000000000001',
      managerId: '00000000-0000-0000-0000-000000000005',
      managerName: 'Diana Prince',
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
      id: '00000000-0000-0000-0000-000000000007',
      referenceId: 'EMP-EMP001',
      employeeCode: 'EMP007',
      email: 'employee@qclocker.io',
      personalEmail: 'david.ross@gmail.com',
      firstName: 'David',
      lastName: 'Ross',
      phone: '+1-555-0106',
      roleCode: UserRole.EMPLOYEE,
      departmentId: '10000000-0000-0000-0000-000000000002',
      departmentName: 'Software Engineering',
      designationId: '80000000-0000-0000-0000-000000000001',
      designationName: 'Full-Stack Software Engineer',
      teamId: '20000000-0000-0000-0000-000000000001',
      managerId: '00000000-0000-0000-0000-000000000006',
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
    {
      id: '00000000-0000-0000-0000-000000000008',
      referenceId: 'EMP-AUD001',
      employeeCode: 'EMP008',
      email: 'auditor@qclocker.io',
      personalEmail: 'rachel.adams@gmail.com',
      firstName: 'Rachel',
      lastName: 'Adams',
      phone: '+1-555-0107',
      roleCode: UserRole.AUDITOR,
      departmentId: '10000000-0000-0000-0000-000000000004',
      departmentName: 'Quality Assurance & Audit',
      designationId: '80000000-0000-0000-0000-000000000004',
      designationName: 'Compliance Auditor',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Senior Compliance & IT Auditor',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-02-10',
      workLocation: 'Headquarters',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
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
      roleCode: UserRole.VIEWER,
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      designationId: '80000000-0000-0000-0000-000000000002',
      designationName: 'Board Observer',
      teamId: null,
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      jobTitle: 'Executive Stakeholder & Observer',
      employmentType: EmploymentType.FULL_TIME,
      joiningDate: '2026-02-15',
      workLocation: 'Remote',
      hasLoginAccount: true,
      accountStatus: AccountStatus.ACTIVE,
      isActive: true,
      createdAt: new Date('2026-02-15').toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, creatorUser?: any) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    if (this.prisma.isConnected) {
      const existing = await this.prisma.user.findFirst({
        where: { email: normalizedEmail },
      });

      if (existing) {
        throw new ConflictException('An employee with this email already exists');
      }

      // Check duplicate employeeCode if provided
      if (dto.employeeCode) {
        const existingCode = await this.prisma.user.findFirst({
          where: { employeeCode: dto.employeeCode.trim() },
        });
        if (existingCode) {
          throw new ConflictException(`Employee badge code '${dto.employeeCode}' is already taken`);
        }
      }

      // Find role
      let role = await this.prisma.role.findUnique({
        where: { code: dto.roleCode },
      });

      if (!role) {
        role = await this.prisma.role.create({
          data: {
            code: dto.roleCode,
            name: dto.roleCode.replace('_', ' '),
            description: 'Application Role',
            isSystem: true,
          },
        });
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

      const newUser = await this.prisma.user.create({
        data: {
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
          joiningDate: dto.joiningDate ? new Date(dto.joiningDate) : new Date(),
          workLocation: dto.workLocation?.trim() || 'Headquarters',
          hasLoginAccount: dto.hasLoginAccount !== false,
          accountStatus,
          invitationToken,
          invitationTokenExpiresAt: invitationExpires,
          isActive: true,
        },
      });

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
    const roleFilter = query.roleCode || query.role;
    const activeFilter =
      query.isActive !== undefined
        ? typeof query.isActive === 'string'
          ? query.isActive === 'true'
          : Boolean(query.isActive)
        : undefined;

    if (this.prisma.isConnected) {
      const where: any = {};

      if (roleFilter) {
        where.roleCode = roleFilter;
      }
      if (query.departmentId) {
        where.departmentId = query.departmentId;
      }
      if (activeFilter !== undefined) {
        where.isActive = activeFilter;
      }
      if (query.search) {
        const pattern = query.search.trim();
        where.OR = [
          { firstName: { contains: pattern, mode: 'insensitive' } },
          { lastName: { contains: pattern, mode: 'insensitive' } },
          { email: { contains: pattern, mode: 'insensitive' } },
          { referenceId: { contains: pattern, mode: 'insensitive' } },
          { jobTitle: { contains: pattern, mode: 'insensitive' } },
        ];
      }

      const rows = await this.prisma.user.findMany({
        where,
        include: {
          department: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return rows.map((u) => ({
        ...u,
        departmentName: u.department?.name,
      }));
    }

    return this.memoryUsers.filter((u) => {
      if (roleFilter && u.roleCode !== roleFilter) return false;
      if (query.departmentId && u.departmentId !== query.departmentId) return false;
      if (activeFilter !== undefined && u.isActive !== activeFilter) return false;
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
    if (this.prisma.isConnected) {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ id }, { referenceId: id }],
        },
        include: {
          department: true,
        },
      });

      if (!user) throw new NotFoundException(`Employee '${id}' not found`);
      return {
        ...user,
        departmentName: user.department?.name,
      };
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

    if (this.prisma.isConnected) {
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
      if (dto.joiningDate) updateData.joiningDate = new Date(dto.joiningDate);
      if (dto.workLocation) updateData.workLocation = dto.workLocation.trim();
      if (dto.hasLoginAccount !== undefined) updateData.hasLoginAccount = dto.hasLoginAccount;
      if (dto.accountStatus) updateData.accountStatus = dto.accountStatus;
      if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

      await this.prisma.user.update({
        where: { id: existing.id },
        data: updateData,
      });

      return this.findOne(existing.id);
    }

    const user = this.memoryUsers.find((u) => u.id === existing.id);
    Object.assign(user, dto, { updatedAt: new Date().toISOString() });
    return user;
  }

  async archive(id: string, actorUser?: any) {
    const existing = await this.findOne(id);

    if (this.prisma.isConnected) {
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          isActive: false,
          accountStatus: AccountStatus.ARCHIVED,
          archivedAt: new Date(),
          archivedById: actorUser?.id || null,
          updatedAt: new Date(),
        },
      });

      // Revoke all active sessions
      await this.prisma.userSession.updateMany({
        where: { userId: existing.id },
        data: { isRevoked: true, updatedAt: new Date() },
      });

      return { success: true, message: `Employee ${existing.referenceId} safely archived` };
    }

    const user = this.memoryUsers.find((u) => u.id === existing.id);
    user.isActive = false;
    user.accountStatus = AccountStatus.ARCHIVED;
    return { success: true, message: `Employee ${existing.referenceId} safely archived` };
  }

  async reactivate(id: string) {
    const existing = await this.findOne(id);
    if (this.prisma.isConnected) {
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          accountStatus: AccountStatus.ACTIVE,
          updatedAt: new Date(),
        },
      });

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
    if (this.prisma.isConnected) {
      return this.prisma.user.findMany({
        where: { managerId, isActive: true },
      });
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

  /**
   * Generates a structured .xlsx template with corporate validation instructions
   */
  async generateBulkTemplate(): Promise<Buffer> {
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

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4338CA' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 26;

    // Add sample rows
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

  /**
   * Bulk Onboard Employees from .xlsx or .csv
   */
  async bulkUpload(file: Express.Multer.File, actorUser?: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file buffer provided for bulk onboarding');
    }

    const rowsData: any[] = [];
    const isCsv = file.mimetype === 'text/csv' || (file.originalname && file.originalname.endsWith('.csv'));

    if (isCsv) {
      const content = file.buffer.toString('utf-8');
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        throw new BadRequestException('CSV file must contain a header row and at least one data row');
      }
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });
        rowsData.push({ rowNumber: i + 1, data: row });
      }
    } else {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer as any);
      const sheet = workbook.getWorksheet(1) || workbook.worksheets[0];
      if (!sheet || sheet.rowCount < 2) {
        throw new BadRequestException('Workbook must contain at least one data row');
      }

      const headers: string[] = [];
      const headerRow = sheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber] = String(cell.value || '').trim();
      });

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData: Record<string, any> = {};
        row.eachCell((cell, colNumber) => {
          const header = headers[colNumber];
          if (header) {
            let val = cell.value;
            if (val && typeof val === 'object' && 'text' in val) {
              val = (val as any).text;
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
      errors: [] as Array<{ rowNumber: number; email?: string; error: string }>,
      insertedUsers: [] as Array<{ id: string; email: string; employeeCode: string; temporaryPassword?: string }>,
    };

    for (const item of rowsData) {
      const d = item.data;
      const rowNum = item.rowNumber;

      const getVal = (...keys: string[]) => {
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
      const roleCode = getVal('roleCode', 'role_code', 'role') || UserRole.EMPLOYEE;
      const jobTitle = getVal('jobTitle', 'job_title', 'designation') || 'Employee';
      const phone = getVal('phone', 'phone_number');
      const employmentType = getVal('employmentType', 'employment_type') || EmploymentType.FULL_TIME;
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
        const created = await this.create(
          {
            firstName,
            lastName,
            email,
            employeeCode,
            roleCode: roleCode as UserRole,
            jobTitle,
            phone,
            employmentType: employmentType as EmploymentType,
            workLocation,
            hasLoginAccount: true,
            sendInvitation: true,
          },
          actorUser,
        );

        const memUser = this.memoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (memUser) {
          memUser.isPasswordChangeRequired = true;
          memUser.temporaryPassword = tempPass;
        }

        report.validRows++;
        report.insertedUsers.push({
          id: created.id,
          email: created.email,
          employeeCode: created.employeeCode || employeeCode,
          temporaryPassword: tempPass,
        });
      } catch (err: any) {
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
}
