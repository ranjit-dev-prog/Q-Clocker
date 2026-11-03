import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq } from 'drizzle-orm';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { generateReferenceId } from '../../common/utils/reference-id.util';

@Injectable()
export class DesignationsService {
  private demoDesignations: any[] = [
    {
      id: '80000000-0000-0000-0000-000000000001',
      referenceId: 'DSG-SWE001',
      name: 'Full-Stack Software Engineer',
      code: 'SWE_FULLSTACK',
      departmentId: '10000000-0000-0000-0000-000000000001',
      description: 'End-to-end web architecture and microservices implementation',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000002',
      referenceId: 'DSG-DEVOPS',
      name: 'Lead Cloud Infrastructure Architect',
      code: 'CLOUD_ARCH',
      departmentId: '10000000-0000-0000-0000-000000000001',
      description: 'Kubernetes orchestration, CI/CD pipelines, and cloud reliability',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000003',
      referenceId: 'DSG-QAENG',
      name: 'Senior QA Automation Engineer',
      code: 'QA_AUTOMATION',
      departmentId: '10000000-0000-0000-0000-000000000001',
      description: 'Automated test suite maintenance and performance testing',
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: '80000000-0000-0000-0000-000000000004',
      referenceId: 'DSG-HRMGR',
      name: 'Human Resources Operations Manager',
      code: 'HR_OPERATIONS_MGR',
      departmentId: '10000000-0000-0000-0000-000000000002',
      description: 'People operations, organizational development, and compliance',
      isActive: true,
      createdAt: new Date(),
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db.select().from(schema.designations);
    }
    return this.demoDesignations;
  }

  async findOne(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [des] = await this.dbService.db
        .select()
        .from(schema.designations)
        .where(eq(schema.designations.id, id))
        .limit(1);

      if (!des) throw new NotFoundException(`Designation '${id}' not found`);
      return des;
    }

    const des = this.demoDesignations.find((d) => d.id === id || d.referenceId === id);
    if (!des) throw new NotFoundException(`Designation '${id}' not found`);
    return des;
  }

  async create(dto: CreateDesignationDto) {
    const code = dto.code.toUpperCase().trim();
    const referenceId = generateReferenceId('DSG');

    if (this.dbService.getConnectionStatus()) {
      const existing = await this.dbService.db
        .select()
        .from(schema.designations)
        .where(eq(schema.designations.code, code))
        .limit(1);

      if (existing.length > 0) {
        throw new ConflictException(`Designation with code '${code}' already exists`);
      }

      const [newDes] = await this.dbService.db
        .insert(schema.designations)
        .values({
          referenceId,
          name: dto.name.trim(),
          code,
          departmentId: dto.departmentId || null,
          description: dto.description?.trim() || null,
          isActive: dto.isActive !== false,
        })
        .returning();

      return newDes;
    }

    const existing = this.demoDesignations.find((d) => d.code === code);
    if (existing) {
      throw new ConflictException(`Designation with code '${code}' already exists`);
    }

    const newDes = {
      id: crypto.randomUUID(),
      referenceId,
      name: dto.name.trim(),
      code,
      departmentId: dto.departmentId || null,
      description: dto.description?.trim() || null,
      isActive: dto.isActive !== false,
      createdAt: new Date(),
    };
    this.demoDesignations.unshift(newDes);
    return newDes;
  }
}

