import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';

@Injectable()
export class RolesService {
  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    if (this.dbService.getConnectionStatus()) {
      return this.dbService.db.select().from(schema.roles);
    }

    return [
      {
        id: '00000000-0000-0000-0000-000000000010',
        code: 'SUPER_ADMIN',
        name: 'Super Administrator',
        description: 'Complete organizational control across all departments and configuration',
        isSystem: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000020',
        code: 'ADMIN',
        name: 'IT Manager / Department Admin',
        description: 'Departmental management, ticket dispatch, task review and approvals',
        isSystem: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000030',
        code: 'TEAM_LEAD',
        name: 'Team Lead',
        description: 'Task assignment to squad members, sprint monitoring, and daily review',
        isSystem: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000040',
        code: 'EMPLOYEE',
        name: 'Employee',
        description: 'Task execution, timesheet logging, ticketing and performance review',
        isSystem: true,
      },
    ];
  }
}
