import { UserRole } from '../../../common/enums';
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    roleCode?: UserRole;
    departmentId?: string;
    teamId?: string;
    managerId?: string;
    jobTitle?: string;
    isActive?: boolean;
}
