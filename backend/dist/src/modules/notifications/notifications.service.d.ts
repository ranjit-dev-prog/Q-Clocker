import { PrismaService } from '../../prisma/prisma.service';
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
    private readonly prisma;
    private readonly logger;
    private memoryNotifications;
    constructor(prisma: PrismaService);
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
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: any;
        entityType?: any;
        entityId?: string | null;
        link?: string;
    }): Promise<NotificationItem>;
}
