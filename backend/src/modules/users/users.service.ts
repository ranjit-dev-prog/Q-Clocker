import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, desc } from 'drizzle-orm';
import { UserRole } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    if (this.dbService.getConnectionStatus()) {
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
          jobTitle: schema.users.jobTitle,
          isActive: schema.users.isActive,
          createdAt: schema.users.createdAt,
        })
        .from(schema.users)
        .orderBy(desc(schema.users.createdAt));
    }

    // Default mock list if database offline
    return [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'superadmin@qclocker.io',
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
        firstName: 'David',
        lastName: 'Ross',
        roleCode: UserRole.EMPLOYEE,
        jobTitle: 'Full-Stack Software Engineer',
        departmentId: '10000000-0000-0000-0000-000000000002',
        isActive: true,
      },
    ];
  }

  async findOne(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [user] = await this.dbService.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, id))
        .limit(1);

      if (!user) throw new NotFoundException('Employee not found');
      const { passwordHash, ...cleanUser } = user;
      return cleanUser;
    }

    const all = await this.findAll();
    const found = all.find((u) => u.id === id);
    if (!found) throw new NotFoundException('Employee not found');
    return found;
  }
}
