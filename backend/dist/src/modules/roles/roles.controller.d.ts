import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    findAll(): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        isSystem: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[] | {
        id: string;
        code: string;
        name: string;
        description: string;
        isSystem: boolean;
    }[]>;
}
