import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../../../common/enums';
declare const UpdateTaskDto_base: import("@nestjs/common").Type<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
    status?: TaskStatus;
    completionPercentage?: number;
    actualHours?: number;
    reviewFeedback?: string;
}
export declare class UpdateTaskStatusDto {
    status: TaskStatus;
    completionPercentage?: number;
    actualHours?: number;
    feedback?: string;
}
export {};
