import { DatabaseService } from '../../database/database.service';
export declare class PermissionsService {
    private readonly dbService;
    private readonly logger;
    private readonly staticPermissions;
    constructor(dbService: DatabaseService);
    findAll(): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        module: string;
    }[]>;
    getMatrix(): Promise<{
        permissions: {
            id: string;
            name: string;
            code: string;
            description: string | null;
            createdAt: Date;
            module: string;
        }[];
        roles: string[];
        matrix: Record<string, Record<string, boolean>>;
    }>;
}
