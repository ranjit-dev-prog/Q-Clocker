import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateTaskCommentDto } from './dto/task-comment.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto, user: any): Promise<any>;
    findAll(query: TaskQueryDto, user: any): Promise<any>;
    getKanban(user: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: any): Promise<any>;
    updateStatus(id: string, dto: UpdateTaskStatusDto, user: any): Promise<any>;
    addComment(id: string, dto: CreateTaskCommentDto, user: any): Promise<any>;
    getComments(id: string): Promise<any>;
}
