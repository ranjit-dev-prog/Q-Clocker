import { PrismaService } from '../../prisma/prisma.service';
export declare class RolesService {
    private readonly prisma;
    private static readonly SYSTEM_ROLES;
    private customRoles;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: {
        name: string;
        code: string;
        description?: string;
        permissions?: string[];
    }): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | null;
        isSystem: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
