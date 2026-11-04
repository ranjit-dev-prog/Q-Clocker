import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import * as crypto from 'crypto';

@Injectable()
export class RolesService {
  private static readonly SYSTEM_ROLES = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      code: 'SUPER_ADMIN',
      name: 'Super Administrator',
      description: 'Complete organizational control across all departments and configuration',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      code: 'ADMIN',
      name: 'Administrator',
      description: 'Organizational administration, user management, and operational workflows',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      code: 'HR_MANAGER',
      name: 'HR Manager',
      description: 'Human resources administration, employee lifecycle, and attendance oversight',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000004',
      code: 'HR_EXECUTIVE',
      name: 'HR Executive',
      description: 'Employee onboarding, records management, and document verification',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      code: 'IT_MANAGER',
      name: 'IT Manager',
      description: 'IT operations, infrastructure, ticket dispatch, and security response',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000006',
      code: 'IT_EXECUTIVE',
      name: 'IT Executive',
      description: 'Technical support, incident resolution, and hardware/software assets',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000007',
      code: 'TEAM_LEAD',
      name: 'Team Lead',
      description: 'Sprint planning, task assignment, progress review, and timesheet approvals',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      code: 'EMPLOYEE',
      name: 'Employee',
      description: 'Task execution, timesheet logging, ticketing, and performance review',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000009',
      code: 'AUDITOR',
      name: 'Compliance Auditor',
      description: 'Read-only audit and compliance inspection access across all operational logs',
      isSystem: true,
    },
    {
      id: '00000000-0000-0000-0000-000000000010',
      code: 'READ_ONLY',
      name: 'Read Only Viewer',
      description: 'Restricted read-only access for external guests or stakeholders',
      isSystem: true,
    },
  ];

  // In-memory custom roles storage
  private customRoles: any[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.isConnected) {
      const dbRoles = await this.prisma.role.findMany();
      if (dbRoles.length > 0) {
        return dbRoles.map((r) => ({
          ...r,
          permissionCount: PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.length || 0,
        }));
      }
    }

    const all = [...RolesService.SYSTEM_ROLES, ...this.customRoles];
    return all.map((r) => ({
      ...r,
      permissionCount:
        PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.length ||
        (PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[r.code]?.includes('*') ? 40 : 0),
    }));
  }

  async findOne(id: string) {
    if (this.prisma.isConnected) {
      const role = await this.prisma.role.findFirst({
        where: {
          OR: [{ id }, { code: id }],
        },
      });

      if (role) {
        return {
          ...role,
          permissions: PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[role.code] || [],
        };
      }
    }

    const role =
      RolesService.SYSTEM_ROLES.find((r) => r.id === id || r.code === id) ||
      this.customRoles.find((r) => r.id === id || r.code === id);

    if (!role) {
      throw new NotFoundException(`Role '${id}' not found`);
    }

    return {
      ...role,
      permissions: PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[role.code] || [],
    };
  }

  async create(dto: { name: string; code: string; description?: string; permissions?: string[] }) {
    const code = dto.code.toUpperCase().replace(/\s+/g, '_');

    if (this.prisma.isConnected) {
      const existing = await this.prisma.role.findUnique({
        where: { code },
      });

      if (existing) {
        throw new ConflictException(`Role with code '${code}' already exists`);
      }

      const newRole = await this.prisma.role.create({
        data: {
          name: dto.name.trim(),
          code,
          description: dto.description?.trim() || null,
          isSystem: false,
        },
      });

      return newRole;
    }

    const existing = [...RolesService.SYSTEM_ROLES, ...this.customRoles].find(
      (r) => r.code === code,
    );
    if (existing) {
      throw new ConflictException(`Role with code '${code}' already exists`);
    }

    const newRole = {
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      code,
      description: dto.description?.trim() || null,
      isSystem: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customRoles.push(newRole);
    return newRole;
  }
}
