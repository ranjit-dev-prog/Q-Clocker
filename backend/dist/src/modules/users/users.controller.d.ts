import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ImportEmployeeRow } from './dto/import-employee.dto';
import { UserRole } from '../../common/enums';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAdminDashboardMetrics(): Promise<{
        totalEmployees: number;
        activeEmployees: number;
        inactiveEmployees: number;
        pendingInvitations: number;
        archivedEmployees: number;
        totalDepartments: number;
        roleDistribution: Record<string, number>;
        departmentDistribution: Record<string, number>;
        recentRegistrations: any[];
    }>;
    getImportTemplate(): string;
    previewImport(body: {
        csvContent: string;
    }, actor: any): {
        totalRows: number;
        validRows: number;
        invalidRows: number;
        preview: ImportEmployeeRow[];
        errors: {
            rowNumber: number;
            field: string;
            error: string;
        }[];
    };
    confirmImport(body: {
        rows: ImportEmployeeRow[];
    }, actor: any): Promise<{
        importedCount: number;
        failureCount: number;
        failures: any[];
        summary: string;
    }>;
    create(createUserDto: CreateUserDto, actor: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        roleId: string;
        referenceId: string;
        managerId: string | null;
        isActive: boolean;
        departmentId: string | null;
        employeeCode: string | null;
        email: string;
        personalEmail: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatarUrl: string | null;
        roleCode: string;
        teamId: string | null;
        designationId: string | null;
        jobTitle: string | null;
        employmentType: string;
        joiningDate: string | null;
        workLocation: string;
        hasLoginAccount: boolean;
        accountStatus: string;
        invitationToken: string | null;
        invitationTokenExpiresAt: Date | null;
        lastLoginAt: Date | null;
        deletedAt: Date | null;
        archivedAt: Date | null;
        archivedById: string | null;
    } | {
        id: `${string}-${string}-${string}-${string}-${string}`;
        referenceId: string;
        employeeCode: string;
        email: string;
        personalEmail: string | null;
        firstName: string;
        lastName: string;
        phone: string | null;
        roleCode: UserRole;
        departmentId: string | null;
        departmentName: string;
        teamId: string | null;
        designationId: string | null;
        designationName: string;
        managerId: string | null;
        managerName: null;
        jobTitle: string;
        employmentType: import("../../common/enums").EmploymentType;
        joiningDate: string;
        workLocation: string;
        hasLoginAccount: boolean;
        accountStatus: import("../../common/enums").AccountStatus;
        isActive: boolean;
        createdAt: string;
    }>;
    findAll(query: UserQueryDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    archive(id: string, actor: any): Promise<{
        success: boolean;
        message: string;
    }>;
    reactivate(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    findSubordinates(id: string): Promise<any[]>;
}
