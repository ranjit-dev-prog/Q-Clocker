import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ExtendProbationDto } from './dto/lifecycle.dto';
export interface LifecycleItem {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    departmentName: string;
    avatarUrl?: string;
    eventType: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROBATION_END' | 'CONTRACT_EXPIRY' | 'DOCUMENT_EXPIRY';
    eventDate: string;
    title: string;
    description: string;
    urgency: 'INFO' | 'UPCOMING' | 'CRITICAL';
    daysRemaining: number;
    actionTaken: boolean;
    congratulationsCount: number;
    congratulatedByUserIds: string[];
    createdAt: string;
}
export declare class LifecycleService {
    private readonly prisma;
    private readonly notificationsService?;
    private readonly logger;
    private memoryEvents;
    constructor(prisma: PrismaService, notificationsService?: NotificationsService | undefined);
    getCelebrationsFeed(): Promise<LifecycleItem[]>;
    congratulate(eventId: string, user: any): Promise<{
        success: boolean;
        congratulationsCount: number;
        hasCongratulated: boolean;
    }>;
    getReminders(urgency?: string): Promise<LifecycleItem[]>;
    sendReminderNotification(reminderId: string, actorUser: any): Promise<{
        success: boolean;
        message: string;
    }>;
    extendProbation(reminderId: string, dto: ExtendProbationDto, actorUser: any): Promise<{
        success: boolean;
        message: string;
        item: LifecycleItem;
    }>;
    resolveReminder(reminderId: string): Promise<{
        success: boolean;
        message: string;
        item: LifecycleItem;
    }>;
}
