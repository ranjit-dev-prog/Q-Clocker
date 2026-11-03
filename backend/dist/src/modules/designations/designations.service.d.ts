import { DatabaseService } from '../../database/database.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
export declare class DesignationsService {
    private readonly dbService;
    private demoDesignations;
    constructor(dbService: DatabaseService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    create(dto: CreateDesignationDto): Promise<{
        id: string;
        name: string;
        code: string;
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
