import { DatabaseService } from '../../database/database.service';
export declare class RolesService {
    private readonly dbService;
    private static readonly SYSTEM_ROLES;
    private customRoles;
    constructor(dbService: DatabaseService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: {
        name: string;
        code: string;
        description?: string;
        permissions?: string[];
    }): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        isSystem: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
