import { UserRole, EmploymentType, AccountStatus } from '../../../common/enums';
export declare class UpdateUserDto {
    employeeCode?: string;
    firstName?: string;
    lastName?: string;
    personalEmail?: string;
    phone?: string;
    roleCode?: UserRole;
    departmentId?: string;
    teamId?: string;
    designationId?: string;
    managerId?: string;
    jobTitle?: string;
    employmentType?: EmploymentType;
    joiningDate?: string;
    workLocation?: string;
    hasLoginAccount?: boolean;
    accountStatus?: AccountStatus;
    isActive?: boolean;
}
