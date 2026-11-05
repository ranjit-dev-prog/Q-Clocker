export declare enum EmploymentStatus {
    ACTIVE = "ACTIVE",
    PROBATION = "PROBATION",
    ON_LEAVE = "ON_LEAVE",
    NOTICE_PERIOD = "NOTICE_PERIOD",
    RESIGNED = "RESIGNED",
    TERMINATED = "TERMINATED",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateHrmsEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    personalEmail?: string;
    phone?: string;
    departmentId: string;
    designationId?: string;
    managerId?: string;
    jobTitle?: string;
    employmentType?: string;
    joiningDate?: string;
    workLocation?: string;
    status?: EmploymentStatus;
    roleCode?: string;
    hasLoginAccount?: boolean;
    initialPassword?: string;
}
export declare class UpdateHrmsEmployeeDto {
    firstName?: string;
    lastName?: string;
    personalEmail?: string;
    phone?: string;
    departmentId?: string;
    designationId?: string;
    managerId?: string;
    jobTitle?: string;
    workLocation?: string;
    avatarUrl?: string;
    status?: EmploymentStatus;
    changeReason?: string;
}
export declare class UpdateEmployeeStatusDto {
    status: EmploymentStatus;
    reason: string;
    effectiveDate?: string;
}
export declare class HrmsEmployeeQueryDto {
    search?: string;
    departmentId?: string;
    designationId?: string;
    managerId?: string;
    status?: EmploymentStatus;
    location?: string;
    page?: number;
    limit?: number;
}
