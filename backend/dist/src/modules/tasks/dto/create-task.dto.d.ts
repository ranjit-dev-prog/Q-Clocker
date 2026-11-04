import { Priority, TaskStatus } from '../../../common/enums';
export declare class CreateTaskDto {
    title: string;
    description?: string;
    departmentId?: string;
    teamId?: string;
    projectId?: string;
    priority?: Priority;
    category?: string;
    assignedEmployeeId?: string;
    leadAssigneeId?: string;
    collaboratorIds?: string[];
    reviewerId?: string;
    startDate: string;
    dueDate: string;
    estimatedHours?: number;
    status?: TaskStatus;
    dependsOnTaskId?: string;
}
