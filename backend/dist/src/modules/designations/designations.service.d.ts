import { PrismaService } from '../../prisma/prisma.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
export declare class DesignationsService {
    private readonly prisma;
    private demoDesignations;
    constructor(prisma: PrismaService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateDesignationDto): Promise<{
        id: string;
        code: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        isActive: boolean;
        departmentId: string | null;
    } | {
        id: `${string}-${string}-${string}-${string}-${string}`;
        referenceId: string;
        name: string;
        code: string;
        departmentId: string | null;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
}
