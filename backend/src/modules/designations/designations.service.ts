import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import * as crypto from 'crypto';

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

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.isConnected) {
      return this.prisma.designation.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.demoDesignations;
  }

  async findOne(id: string) {
    if (this.prisma.isConnected) {
      const des = await this.prisma.designation.findFirst({
        where: {
          OR: [{ id }, { referenceId: id }, { code: id }],
        },
      });

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

    if (this.prisma.isConnected) {
      const existing = await this.prisma.designation.findUnique({
        where: { code },
      });

      if (existing) {
        throw new ConflictException(`Designation with code '${code}' already exists`);
      }

      const newDes = await this.prisma.designation.create({
        data: {
          referenceId,
          name: dto.name.trim(),
          code,
          departmentId: dto.departmentId || null,
          description: dto.description?.trim() || null,
          isActive: dto.isActive !== false,
        },
      });

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
