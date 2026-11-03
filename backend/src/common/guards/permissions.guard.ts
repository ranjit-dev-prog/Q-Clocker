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
  // Built-in standard ERP permissions map by role code for high-throughput lookup & zero-latency fallback
  private static readonly DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
    SUPER_ADMIN: ['*'], // Global bypass
    ADMIN: [
      'task.create',
      'task.assign',
      'task.update',
      'task.approve',
      'ticket.create',
      'ticket.assign',
      'ticket.escalate',
      'ticket.resolve',
      'attendance.record',
      'attendance.correct',
      'timesheet.submit',
      'timesheet.approve',
      'employee.manage',
      'department.manage',
      'report.export',
      'audit.view',
    ],
    TEAM_LEAD: [
      'task.create',
      'task.assign',
      'task.update',
      'task.approve',
      'ticket.create',
      'ticket.assign',
      'ticket.resolve',
      'attendance.record',
      'timesheet.submit',
      'timesheet.approve',
      'report.export',
    ],
    EMPLOYEE: [
      'task.update',
      'ticket.create',
      'attendance.record',
      'timesheet.submit',
    ],
    AUDITOR: [
      'audit.view',
      'report.export',
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
      userPermissions.includes(perm) || userPermissions.includes('*'),
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient privileges: Missing required permission(s) [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }

  private async getUserPermissions(
    roleId?: string,
    roleCode?: string,
  ): Promise<string[]> {
    // 1. Check database if connected and roleId provided
    if (this.dbService.getConnectionStatus() && roleId) {
      try {
        const rows = await this.dbService.db
          .select({ code: schema.permissions.code })
          .from(schema.rolePermissions)
          .innerJoin(
            schema.permissions,
            eq(schema.rolePermissions.permissionId, schema.permissions.id),
          )
          .where(eq(schema.rolePermissions.roleId, roleId));

        if (rows.length > 0) {
          return rows.map((r) => r.code);
        }
      } catch {
        // Fallback to static matrix on query error
      }
    }

    // 2. Fallback to predefined enterprise role matrix
    if (roleCode && PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[roleCode]) {
      return PermissionsGuard.DEFAULT_ROLE_PERMISSIONS[roleCode];
    }

    return [];
  }
}
