import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, inArray } from 'drizzle-orm';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  // Standard permissions catalog
  private readonly staticPermissions = [
    { code: 'employees.create', name: 'Create Employee Records', module: 'Employees' },
    { code: 'employees.read', name: 'View Employee Directory and Profiles', module: 'Employees' },
    { code: 'employees.update', name: 'Update Employee Information', module: 'Employees' },
    { code: 'employees.delete', name: 'Delete Employee Accounts', module: 'Employees' },
    { code: 'employees.archive', name: 'Archive Employee Lifecycle', module: 'Employees' },
    { code: 'employees.import', name: 'Bulk Import Employees via CSV', module: 'Employees' },
    { code: 'employees.export', name: 'Export Employee Records', module: 'Employees' },
    { code: 'departments.create', name: 'Create Departments and Teams', module: 'Departments' },
    { code: 'departments.read', name: 'View Department Structure', module: 'Departments' },
    { code: 'departments.update', name: 'Update Department Details', module: 'Departments' },
    { code: 'departments.delete', name: 'Archive Departments', module: 'Departments' },
    { code: 'roles.create', name: 'Create System Roles', module: 'Roles' },
    { code: 'roles.read', name: 'View Role Permissions', module: 'Roles' },
    { code: 'roles.update', name: 'Modify Role Capabilities', module: 'Roles' },
    { code: 'roles.delete', name: 'Delete Custom Roles', module: 'Roles' },
    { code: 'roles.assign', name: 'Assign Roles to Users', module: 'Roles' },
    { code: 'permissions.read', name: 'Inspect Permission Matrix', module: 'Permissions' },
    { code: 'permissions.assign', name: 'Assign Granular Permissions', module: 'Permissions' },
    { code: 'attendance.read', name: 'View Attendance Records', module: 'Attendance' },
    { code: 'attendance.create', name: 'Clock In / Clock Out', module: 'Attendance' },
    { code: 'attendance.update', name: 'Correct Attendance Punches', module: 'Attendance' },
    { code: 'attendance.approve', name: 'Approve Attendance Corrections', module: 'Attendance' },
    { code: 'timesheets.read', name: 'View Timesheets', module: 'Timesheets' },
    { code: 'timesheets.create', name: 'Submit Weekly Timesheet', module: 'Timesheets' },
    { code: 'timesheets.update', name: 'Modify Timesheet Claims', module: 'Timesheets' },
    { code: 'timesheets.approve', name: 'Approve or Reject Timesheets', module: 'Timesheets' },
    { code: 'tickets.create', name: 'Create ITSM Service Tickets', module: 'Tickets' },
    { code: 'tickets.read', name: 'View Incident Tickets', module: 'Tickets' },
    { code: 'tickets.update', name: 'Update Ticket Status & Notes', module: 'Tickets' },
    { code: 'tickets.assign', name: 'Dispatch / Reassign Tickets', module: 'Tickets' },
    { code: 'tickets.close', name: 'Close & Resolve Incidents', module: 'Tickets' },
    { code: 'tasks.create', name: 'Create Tasks and Objectives', module: 'Tasks' },
    { code: 'tasks.read', name: 'View Tasks & Kanban Board', module: 'Tasks' },
    { code: 'tasks.update', name: 'Update Task Progress & Status', module: 'Tasks' },
    { code: 'tasks.assign', name: 'Assign Tasks to Team Members', module: 'Tasks' },
    { code: 'tasks.delete', name: 'Cancel or Delete Tasks', module: 'Tasks' },
    { code: 'reports.read', name: 'View Operational Reports', module: 'Reports' },
    { code: 'reports.export', name: 'Export PDF and Excel Analytics', module: 'Reports' },
    { code: 'audit_logs.read', name: 'Inspect System Audit Logs', module: 'Audit' },
    { code: 'settings.read', name: 'View Enterprise Configuration', module: 'Settings' },
    { code: 'settings.update', name: 'Modify System Settings', module: 'Settings' },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async findAll() {
    if (this.dbService.getConnectionStatus()) {
      const rows = await this.dbService.db.select().from(schema.permissions);
      if (rows.length > 0) return rows;
    }
    return this.staticPermissions.map((p, idx) => ({
      id: `00000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`,
      ...p,
      description: p.name,
      createdAt: new Date(),
    }));
  }

  async getMatrix() {
    const permissions = await this.findAll();
    const defaultMatrix = PermissionsGuard.DEFAULT_ROLE_PERMISSIONS;

    const matrix: Record<string, Record<string, boolean>> = {};

    for (const [roleCode, allowedList] of Object.entries(defaultMatrix)) {
      matrix[roleCode] = {};
      for (const p of permissions) {
        matrix[roleCode][p.code] =
          allowedList.includes('*') ||
          allowedList.includes(p.code) ||
          allowedList.includes(`${p.code.split('.')[0]}.*`);
      }
    }

    return {
      permissions,
      roles: Object.keys(defaultMatrix),
      matrix,
    };
  }
}

