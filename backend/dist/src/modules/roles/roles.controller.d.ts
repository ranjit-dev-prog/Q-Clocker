import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
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
