import { Priority, TaskStatus } from '../../../common/enums';
export declare class TaskQueryDto {
    status?: TaskStatus;
    priority?: Priority;
    departmentId?: string;
    teamId?: string;
    assignedEmployeeId?: string;
    category?: string;
    search?: string;
}
