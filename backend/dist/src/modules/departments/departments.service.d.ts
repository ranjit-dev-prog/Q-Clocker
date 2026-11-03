import { DatabaseService } from '../../database/database.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class DepartmentsService {
    private readonly dbService;
    private readonly logger;
    private memoryDepts;
    private memoryTeams;
    constructor(dbService: DatabaseService);
    create(dto: CreateDepartmentDto): Promise<{
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        managerId: string | null;
        isActive: boolean;
    } | {
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: string | null;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    }>;
    findAll(): Promise<({
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: string;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    } | {
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: null;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    })[] | {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        managerId: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: string;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    } | {
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: null;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    } | {
        id: string;
        name: string;
        code: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        managerId: string | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateDepartmentDto): Promise<{
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: string;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    } | {
        id: string;
        name: string;
        code: string;
        description: string;
        managerId: null;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    } | {
        id: string;
        referenceId: string;
        name: string;
        code: string;
        description: string | null;
        managerId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    createTeam(departmentId: string, dto: CreateTeamDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        isActive: boolean;
        departmentId: string;
        leadId: string | null;
    } | {
        id: string;
        departmentId: string;
        name: string;
        description: string;
        leadId: string | null;
        leadName: string;
        isActive: boolean;
    }>;
    findTeams(departmentId: string): Promise<{
        id: string;
        departmentId: string;
        name: string;
        description: string;
        leadId: string | null;
        leadName: string;
        isActive: boolean;
    }[] | {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        referenceId: string;
        isActive: boolean;
        departmentId: string;
        leadId: string | null;
    }[]>;
}
