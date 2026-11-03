import { DatabaseService } from '../../database/database.service';
export declare class RolesService {
    private readonly dbService;
    constructor(dbService: DatabaseService);
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
