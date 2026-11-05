import { PrismaService } from '../../prisma/prisma.service';
export declare class PermissionsService {
    private readonly prisma;
    private readonly logger;
    private readonly staticPermissions;
    constructor(prisma: PrismaService);
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
