import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from '../../database/database.service';
export declare class PermissionsGuard implements CanActivate {
    private readonly reflector;
    private readonly dbService;
    static readonly DEFAULT_ROLE_PERMISSIONS: Record<string, string[]>;
    constructor(reflector: Reflector, dbService: DatabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getUserPermissions;
}
