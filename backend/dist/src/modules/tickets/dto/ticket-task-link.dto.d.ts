import { Priority } from '../../../common/enums';
export declare class LinkExistingTaskDto {
    taskId: string;
}
export declare class CreateTaskFromTicketDto {
    title: string;
    description?: string;
    priority?: Priority;
    assignedEmployeeId?: string;
    startDate: string;
    dueDate: string;
    estimatedHours?: number;
}
