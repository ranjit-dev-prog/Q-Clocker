import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import * as crypto from 'crypto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  // In-memory persistent demo store
  private memoryDepts: Array<{
    id: string;
    referenceId?: string;
    name: string;
    code: string;
    description: string;
    managerId: string | null;
    managerName: string;
    memberCount: number;
    teamCount: number;
    isActive: boolean;
    createdAt: string;
  }> = [
    {
      id: '10000000-0000-0000-0000-000000000001',
      name: 'Information Technology',
      code: 'IT',
      description: 'Enterprise IT infrastructure, helpdesk, network operations and cybersecurity',
      managerId: '00000000-0000-0000-0000-000000000002',
      managerName: 'Marcus Chen',
      memberCount: 12,
      teamCount: 2,
      isActive: true,
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: '10000000-0000-0000-0000-000000000002',
      name: 'Software Engineering',
      code: 'ENG',
      description: 'Core product engineering, platform development, API architecture and QA',
      managerId: '00000000-0000-0000-0000-000000000003',
      managerName: 'Sarah Jenkins',
      memberCount: 24,
      teamCount: 3,
      isActive: true,
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: '10000000-0000-0000-0000-000000000003',
      name: 'Operations & Facilities',
      code: 'OPS',
      description: 'Business continuity, facilities, vendor relationships and client delivery',
      managerId: '00000000-0000-0000-0000-000000000001',
      managerName: 'Alexander Vance',
      memberCount: 8,
      teamCount: 1,
      isActive: true,
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: '10000000-0000-0000-0000-000000000004',
      name: 'Human Resources',
      code: 'HR',
      description: 'Talent acquisition, employee satisfaction, compensation and organizational policy',
      managerId: null,
      managerName: 'Emma Watson',
      memberCount: 4,
      teamCount: 1,
      isActive: true,
      createdAt: new Date('2026-01-01').toISOString(),
    },
  ];

  private memoryTeams: Array<{
    id: string;
    departmentId: string;
    name: string;
    description: string;
    leadId: string | null;
    leadName: string;
    isActive: boolean;
  }> = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      departmentId: '10000000-0000-0000-0000-000000000002',
      name: 'Backend Core Squad',
      description: 'High-throughput microservices and relational data pipelines',
      leadId: '00000000-0000-0000-0000-000000000003',
      leadName: 'Sarah Jenkins',
      isActive: true,
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      departmentId: '10000000-0000-0000-0000-000000000002',
      name: 'Frontend Design Systems',
      description: 'Angular architecture, responsive dashboards, and microfrontends',
      leadId: null,
      leadName: 'Unassigned',
      isActive: true,
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      departmentId: '10000000-0000-0000-0000-000000000001',
      name: 'Helpdesk & Security Operations',
      description: 'Tier 1/2 IT Support, endpoint security, and access control',
      leadId: '00000000-0000-0000-0000-000000000002',
      leadName: 'Marcus Chen',
      isActive: true,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDepartmentDto) {
    const code = dto.code.toUpperCase().trim();

    if (this.prisma.isConnected) {
      const existing = await this.prisma.department.findUnique({
        where: { code },
      });

      if (existing) {
        throw new ConflictException(`Department code '${code}' already exists`);
      }

      const newDept = await this.prisma.department.create({
        data: {
          referenceId: generateReferenceId('DEP'),
          name: dto.name.trim(),
          code,
          description: dto.description,
          managerId: dto.managerId || null,
          isActive: true,
        },
      });

      return newDept;
    }

    const existing = this.memoryDepts.find((d) => d.code === code);
    if (existing) {
      throw new ConflictException(`Department code '${code}' already exists`);
    }

    const newDept = {
      id: crypto.randomUUID(),
      referenceId: generateReferenceId('DEP'),
      name: dto.name.trim(),
      code,
      description: dto.description || '',
      managerId: dto.managerId || null,
      managerName: 'Unassigned',
      memberCount: 0,
      teamCount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.memoryDepts.push(newDept);
    return newDept;
  }

  async findAll() {
    if (this.prisma.isConnected) {
      return this.prisma.department.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.memoryDepts;
  }

  async findOne(id: string) {
    if (this.prisma.isConnected) {
      const dept = await this.prisma.department.findFirst({
        where: {
          OR: [{ id }, { referenceId: id }, { code: id }],
        },
      });

      if (!dept) throw new NotFoundException('Department not found');
      return dept;
    }

    const found = this.memoryDepts.find((d) => d.id === id);
    if (!found) throw new NotFoundException('Department not found');
    return found;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    if (this.prisma.isConnected) {
      const existing = await this.prisma.department.findFirst({
        where: {
          OR: [{ id }, { referenceId: id }],
        },
      });

      if (!existing) throw new NotFoundException('Department not found');

      const updated = await this.prisma.department.update({
        where: { id: existing.id },
        data: {
          name: dto.name || existing.name,
          description: dto.description !== undefined ? dto.description : existing.description,
          managerId: dto.managerId !== undefined ? dto.managerId : existing.managerId,
          isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
          updatedAt: new Date(),
        },
      });

      return updated;
    }

    const index = this.memoryDepts.findIndex((d) => d.id === id);
    if (index === -1) throw new NotFoundException('Department not found');

    this.memoryDepts[index] = {
      ...this.memoryDepts[index],
      ...dto,
    };
    return this.memoryDepts[index];
  }

  async remove(id: string) {
    if (this.prisma.isConnected) {
      const existing = await this.prisma.department.findFirst({
        where: { OR: [{ id }, { referenceId: id }] },
      });

      if (!existing) throw new NotFoundException('Department not found');

      await this.prisma.department.update({
        where: { id: existing.id },
        data: { isActive: false, updatedAt: new Date() },
      });

      return { message: 'Department deactivated successfully' };
    }

    const index = this.memoryDepts.findIndex((d) => d.id === id);
    if (index === -1) throw new NotFoundException('Department not found');
    this.memoryDepts[index].isActive = false;
    return { message: 'Department deactivated successfully' };
  }

  // --- Team Management ---

  async createTeam(departmentId: string, dto: CreateTeamDto) {
    await this.findOne(departmentId);

    if (this.prisma.isConnected) {
      const newTeam = await this.prisma.team.create({
        data: {
          referenceId: generateReferenceId('TEM'),
          departmentId,
          name: dto.name,
          leadId: dto.leadId || null,
          description: dto.description || null,
          isActive: true,
        },
      });

      return newTeam;
    }

    const newTeam = {
      id: crypto.randomUUID(),
      referenceId: generateReferenceId('TEM'),
      departmentId,
      name: dto.name,
      description: dto.description || '',
      leadId: dto.leadId || null,
      leadName: 'Unassigned',
      isActive: true,
    };
    this.memoryTeams.push(newTeam);
    return newTeam;
  }

  async findTeams(departmentId: string) {
    if (this.prisma.isConnected) {
      return this.prisma.team.findMany({
        where: { departmentId },
      });
    }

    return this.memoryTeams.filter((t) => t.departmentId === departmentId);
  }

  async getOrgChart() {
    const depts = await this.findAll();
    const tree = await Promise.all(
      depts.map(async (dept) => {
        const teams = await this.findTeams(dept.id);
        return {
          id: dept.id,
          name: dept.name,
          code: dept.code,
          referenceId: dept.referenceId,
          head: (dept as any).managerName || 'Unassigned Head',
          teams: teams.map((t) => ({
            id: t.id,
            name: t.name,
            lead: (t as any).leadName || 'Team Lead',
          })),
        };
      }),
    );

    return {
      organizationName: 'Q Clocker Enterprise',
      ceo: 'Alexander Vance (Chief Information Officer)',
      departments: tree,
    };
  }
}
