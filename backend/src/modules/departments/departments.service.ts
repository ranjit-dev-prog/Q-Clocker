import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, desc } from 'drizzle-orm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateTeamDto } from './dto/create-team.dto';

@Injectable()
export class DepartmentsService {
  private readonly logger = new Logger(DepartmentsService.name);

  // In-memory persistent demo store
  private memoryDepts = [
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
      departmentId: '10000000-0000-0000-0000-000000000001',
      name: 'Helpdesk & Security Operations',
      description: 'Tier 1/2 IT Support, endpoint security, and access control',
      leadId: '00000000-0000-0000-0000-000000000002',
      leadName: 'Marcus Chen',
      isActive: true,
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async create(dto: CreateDepartmentDto) {
    const code = dto.code.toUpperCase().trim();

    if (this.dbService.getConnectionStatus()) {
      const existing = await this.dbService.db
        .select()
        .from(schema.departments)
        .where(eq(schema.departments.code, code))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictException(`Department code '${code}' already exists`);
      }

      const [newDept] = await this.dbService.db
        .insert(schema.departments)
        .values({
          name: dto.name.trim(),
          code,
          description: dto.description,
          managerId: dto.managerId || null,
          isActive: true,
        })
        .returning();

      return newDept;
    }

    const existing = this.memoryDepts.find((d) => d.code === code);
    if (existing) {
      throw new ConflictException(`Department code '${code}' already exists`);
    }

    const newDept = {
      id: `10000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db
        .select()
        .from(schema.departments)
        .orderBy(desc(schema.departments.createdAt));
    }
    return this.memoryDepts;
  }

  async findOne(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [dept] = await this.dbService.db
        .select()
        .from(schema.departments)
        .where(eq(schema.departments.id, id))
        .limit(1);

      if (!dept) throw new NotFoundException('Department not found');
      return dept;
    }

    const found = this.memoryDepts.find((d) => d.id === id);
    if (!found) throw new NotFoundException('Department not found');
    return found;
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    if (this.dbService.getConnectionStatus()) {
      const [existing] = await this.dbService.db
        .select()
        .from(schema.departments)
        .where(eq(schema.departments.id, id))
        .limit(1);

      if (!existing) throw new NotFoundException('Department not found');

      const [updated] = await this.dbService.db
        .update(schema.departments)
        .set({
          name: dto.name || existing.name,
          description: dto.description !== undefined ? dto.description : existing.description,
          managerId: dto.managerId !== undefined ? dto.managerId : existing.managerId,
          isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
          updatedAt: new Date(),
        })
        .where(eq(schema.departments.id, id))
        .returning();

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
    if (this.dbService.getConnectionStatus()) {
      const [dept] = await this.dbService.db
        .update(schema.departments)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(schema.departments.id, id))
        .returning();

      if (!dept) throw new NotFoundException('Department not found');
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

    if (this.dbService.getConnectionStatus()) {
      const [newTeam] = await this.dbService.db
        .insert(schema.teams)
        .values({
          departmentId,
          name: dto.name,
          leadId: dto.leadId || null,
          description: dto.description || null,
          isActive: true,
        })
        .returning();

      return newTeam;
    }

    const newTeam = {
      id: `20000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
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
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db
        .select()
        .from(schema.teams)
        .where(eq(schema.teams.departmentId, departmentId));
    }

    return this.memoryTeams.filter((t) => t.departmentId === departmentId);
  }
}
