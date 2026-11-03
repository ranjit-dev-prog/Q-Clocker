import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateTeamDto } from './dto/create-team.dto';
export declare class DepartmentsController {
    private readonly departmentsService;
    constructor(departmentsService: DepartmentsService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
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
        id: `${string}-${string}-${string}-${string}-${string}`;
        referenceId: string;
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
    findAll(): Promise<{
        id: string;
        referenceId?: string;
        name: string;
        code: string;
        description: string;
        managerId: string | null;
        managerName: string;
        memberCount: number;
        teamCount: number;
        isActive: boolean;
        createdAt: string;
    }[] | {
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
        referenceId?: string;
        name: string;
        code: string;
        description: string;
        managerId: string | null;
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
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        id: string;
        referenceId?: string;
        name: string;
        code: string;
        description: string;
        managerId: string | null;
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
    createTeam(departmentId: string, createTeamDto: CreateTeamDto): Promise<{
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
        id: `${string}-${string}-${string}-${string}-${string}`;
        referenceId: string;
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
