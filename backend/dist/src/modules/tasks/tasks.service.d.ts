import { DatabaseService } from '../../database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class TasksService {
    private readonly dbService;
    private readonly notificationsService?;
    private readonly logger;
    private demoTasks;
    private demoComments;
    constructor(dbService: DatabaseService, notificationsService?: NotificationsService | undefined);
    create(createTaskDto: CreateTaskDto, user: any): Promise<any>;
}
