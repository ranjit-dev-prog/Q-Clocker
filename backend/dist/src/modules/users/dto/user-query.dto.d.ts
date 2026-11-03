import { UserRole } from '../../../common/enums';
export declare class UserQueryDto {
    search?: string;
    role?: UserRole;
    roleCode?: UserRole;
    departmentId?: string;
    isActive?: string;
}
