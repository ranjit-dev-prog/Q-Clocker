import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DepartmentsService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db.select().from(schema.departments);
    }

    return [
      { id: '10000000-0000-0000-0000-000000000001', name: 'Information Technology', code: 'IT', description: 'Enterprise IT infrastructure, helpdesk and security', isActive: true },
      { id: '10000000-0000-0000-0000-000000000002', name: 'Software Engineering', code: 'ENG', description: 'Core product development and software architecture', isActive: true },
      { id: '10000000-0000-0000-0000-000000000003', name: 'Operations', code: 'OPS', description: 'Business operations and facilities', isActive: true },
      { id: '10000000-0000-0000-0000-000000000004', name: 'Human Resources', code: 'HR', description: 'Talent management and compliance', isActive: true },
    ];
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

    const all = await this.findAll();
    const found = all.find((d) => d.id === id);
    if (!found) throw new NotFoundException('Department not found');
    return found;
  }
}

