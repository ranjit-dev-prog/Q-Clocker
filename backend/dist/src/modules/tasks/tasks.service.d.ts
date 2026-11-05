import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateTaskCommentDto } from './dto/task-comment.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TasksService {
    private readonly prisma;
    private readonly notificationsService?;
    private readonly logger;
    private demoTasks;
    private demoComments;
    constructor(prisma: PrismaService, notificationsService?: NotificationsService | undefined);
    create(createTaskDto: CreateTaskDto, user: any): Promise<any>;
    findAll(query: TaskQueryDto, user: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: any): Promise<any>;
    updateStatus(id: string, dto: UpdateTaskStatusDto, user: any): Promise<any>;
    addComment(id: string, dto: CreateTaskCommentDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        comment: string;
        taskId: string;
    } | {
        id: `${string}-${string}-${string}-${string}-${string}`;
        taskId: any;
        userId: any;
        userName: string;
        comment: string;
        isInternal: boolean;
        createdAt: Date;
    }>;
    getComments(id: string): Promise<any[]>;
    getKanbanBoard(user: any): Promise<{
        backlog: any[];
        inProgress: any[];
        review: any[];
        completed: any[];
        stats: {
            total: number;
            backlogCount: number;
            inProgressCount: number;
            reviewCount: number;
            completedCount: number;
            overdueCount: number;
        };
    }>;
}
