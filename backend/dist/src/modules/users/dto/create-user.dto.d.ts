import { UserRole, EmploymentType } from '../../../common/enums';
export declare class CreateUserDto {
    employeeCode?: string;
    email: string;
    personalEmail?: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleCode: UserRole;
    departmentId?: string;
    teamId?: string;
    designationId?: string;
    managerId?: string;
    jobTitle?: string;
    employmentType?: EmploymentType;
    joiningDate?: string;
    workLocation?: string;
    hasLoginAccount?: boolean;
    sendInvitation?: boolean;
}
