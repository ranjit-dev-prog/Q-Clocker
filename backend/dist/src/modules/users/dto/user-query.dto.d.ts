import { UserRole } from '../../../common/enums';
export declare class UserQueryDto {
    search?: string;
    role?: UserRole;
    departmentId?: string;
    isActive?: string;
}
