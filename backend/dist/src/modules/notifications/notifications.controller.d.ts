import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(userId: string, unreadOnly?: string): Promise<import("./notifications.service").NotificationItem[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markRead(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllRead(userId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    createNotification(dto: {
        userId: string;
        title: string;
        message: string;
        type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
        entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
        entityId?: string;
    }): Promise<import("./notifications.service").NotificationItem>;
}
