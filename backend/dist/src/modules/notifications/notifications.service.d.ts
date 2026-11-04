import { DatabaseService } from '../../database/database.service';
export interface NotificationItem {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
    entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
    entityId?: string | null;
    isRead: boolean;
    readAt?: Date | string | null;
    createdAt: string;
}
export declare class NotificationsService {
    private readonly dbService;
    private readonly logger;
    private memoryNotifications;
    constructor(dbService: DatabaseService);
    findAllForUser(userId: string, unreadOnly?: boolean): Promise<NotificationItem[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    create(data: {
        userId: string;
        title: string;
        message: string;
        type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
        entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
        entityId?: string | null;
    }): Promise<NotificationItem>;
}
