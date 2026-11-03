import { UserRole } from '../../../common/enums';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roleCode: UserRole;
    departmentId?: string;
    teamId?: string;
    managerId?: string;
    jobTitle?: string;
}
