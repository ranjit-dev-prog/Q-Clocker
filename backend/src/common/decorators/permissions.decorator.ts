import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Enterprise Granular Permission Decorator
 *
 * Enforces database-backed permission codes (e.g., 'task.create', 'ticket.assign')
 * on controller handlers and classes.
 *
 * Example:
 *   @RequirePermissions('task.create', 'task.assign')
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
