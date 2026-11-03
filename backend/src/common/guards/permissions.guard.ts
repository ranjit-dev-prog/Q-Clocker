import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, inArray } from 'drizzle-orm';
import { UserRole } from '../enums';

@Injectable()
export class PermissionsGuard implements CanActivate {
  // Built-in standard ERP permissions matrix by role code for high-throughput lookup & zero-latency fallback
  public static readonly DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
    SUPER_ADMIN: ['*'], // Global bypass
    ADMIN: [
      'employees.create',
      'employees.read',
      'employees.update',
      'employees.delete',
      'employees.archive',
      'employees.import',
      'employees.export',
      'departments.create',
      'departments.read',
      'departments.update',
      'departments.delete',
      'roles.read',
      'roles.create',
      'roles.update',
      'roles.assign',
      'permissions.read',
      'tasks.create',
      'tasks.read',
      'tasks.update',
      'tasks.assign',
      'tasks.delete',
      'tickets.create',
      'tickets.read',
      'tickets.update',
      'tickets.assign',
      'tickets.close',
      'attendance.read',
      'attendance.create',
      'attendance.update',
      'attendance.approve',
      'timesheets.read',
      'timesheets.create',
      'timesheets.update',
      'timesheets.approve',
      'reports.read',
      'reports.export',
      'audit_logs.read',
      'settings.read',
      'settings.update',
    ],
    HR_MANAGER: [
      'employees.create',
      'employees.read',
      'employees.update',
      'employees.archive',
      'employees.import',
      'employees.export',
      'departments.read',
      'attendance.read',
      'attendance.create',
      'attendance.update',
      'attendance.approve',
      'timesheets.read',
      'timesheets.approve',
      'reports.read',
      'reports.export',
    ],
    HR_EXECUTIVE: [
      'employees.create',
      'employees.read',
      'employees.update',
      'departments.read',
      'attendance.read',
      'attendance.create',
      'reports.read',
    ],
    IT_MANAGER: [
      'tickets.create',
      'tickets.read',
      'tickets.update',
      'tickets.assign',
      'tickets.close',
      'tasks.create',
      'tasks.read',
      'tasks.update',
      'tasks.assign',
      'employees.read',
      'departments.read',
      'reports.read',
      'reports.export',
    ],
    IT_EXECUTIVE: [
      'tickets.read',
      'tickets.update',
      'tasks.read',
      'tasks.update',
      'employees.read',
    ],
    TEAM_LEAD: [
      'tasks.create',
      'tasks.read',
      'tasks.update',
      'tasks.assign',
      'tickets.create',
      'tickets.read',
      'attendance.read',
      'timesheets.read',
      'timesheets.approve',
      'employees.read',
      'reports.read',
    ],
    EMPLOYEE: [
      'tasks.read',
      'tasks.update',
      'tickets.create',
      'tickets.read',
      'attendance.read',
      'attendance.create',
      'timesheets.read',
      'timesheets.create',
    ],
    AUDITOR: [
      'audit_logs.read',
      'reports.read',
      'reports.export',
      'employees.read',
      'departments.read',
      'roles.read',
      'permissions.read',
    ],
    READ_ONLY: [
      'employees.read',
      'departments.read',
      'tasks.read',
      'tickets.read',
      'reports.read',
    ],
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly dbService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    const userRoleCode = user.role || user.roleCode;

    // Super Admin global bypass
    if (userRoleCode === UserRole.SUPER_ADMIN || userRoleCode === 'SUPER_ADMIN') {
      return true;
    }

    const userPermissions = await this.getUserPermissions(user.roleId, userRoleCode);

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm) ||
      userPermissions.includes('*') ||
      userPermissions.includes(`${perm.split('.')[0]}.*`),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient privileges: Missing required permission(s) [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }

  private async getUserPermissions(roleId?: string, roleCode?: string): Promise<string[]> {
    if (this.dbService.getConnectionStatus() && roleId) {
      try {
        const rows = await this.dbService.db
          .select({
            code: schema.permissions.code,
          })
          .from(schema.rolePermissions)
          .innerJoin(
            schema.permissions,
            eq(schema.rolePermissions.permissionId, schema.permissions.id),
          )
          .where(eq(schema.rolePermissions.roleId, roleId));

        if (rows.length > 0) {
          return rows.map((r) => r.code);
        }
      } catch (err) {
        // Fall back to built-in map
      }
    }

    return PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[roleCode || 'EMPLOYEE'] || [];
  }
}
