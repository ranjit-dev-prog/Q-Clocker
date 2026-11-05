import { PermissionsService } from './permissions.service';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    findAll(): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | null;
        createdAt: Date;
        module: string;
    }[]>;
    getMatrix(): Promise<{
        permissions: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            createdAt: Date;
            module: string;
        }[];
        roles: string[];
        matrix: Record<string, Record<string, boolean>>;
    }>;
}
