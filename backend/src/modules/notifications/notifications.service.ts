import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as crypto from 'crypto';

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

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // In-memory notifications store for zero-latency fallback and evaluation
  private memoryNotifications: NotificationItem[] = [
    {
      id: '90000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000001', // Alexander Vance
      title: 'P1 Incident Escalated: Database Latency Spike',
      message: 'Critical incident TKT-INC001 requires executive approval for infrastructure failover.',
      type: 'URGENT',
      entityType: 'TICKET',
      entityId: '70000000-0000-0000-0000-000000000001',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: '90000000-0000-0000-0000-000000000002',
      userId: '00000000-0000-0000-0000-000000000001',
      title: 'System Backup Completed',
      message: 'Automated nightly snapshot of production PostgreSQL completed in 4m 12s.',
      type: 'SUCCESS',
      entityType: 'SYSTEM',
      entityId: null,
      isRead: true,
      readAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '90000000-0000-0000-0000-000000000004', // Marcus Chen (IT Manager)
      userId: '00000000-0000-0000-0000-000000000004',
      title: 'High Priority Ticket Assigned',
      message: 'Ticket TKT-CR001: Firewall Port Authorization has been assigned to IT Infrastructure.',
      type: 'TICKET',
      entityType: 'TICKET',
      entityId: '70000000-0000-0000-0000-000000000003',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      id: '90000000-0000-0000-0000-000000000006', // Sarah Jenkins (Team Lead)
      userId: '00000000-0000-0000-0000-000000000006',
      title: 'New Sprint Task Submitted for Review',
      message: 'David Ross completed TSK-DEV001 and submitted work log for review.',
      type: 'TASK',
      entityType: 'TASK',
      entityId: '50000000-0000-0000-0000-000000000001',
      isRead: false,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: '90000000-0000-0000-0000-000000000007', // David Ross (Employee)
      userId: '00000000-0000-0000-0000-000000000007',
      title: 'Task Assigned: Architecture Review',
      message: 'Sarah Jenkins assigned you to TSK-DEV001 with 4 estimated hours.',
      type: 'TASK',
      entityType: 'TASK',
      entityId: '50000000-0000-0000-0000-000000000001',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string, unreadOnly = false): Promise<NotificationItem[]> {
    if (this.prisma.isConnected) {
      try {
        const where: any = { userId };
        if (unreadOnly) {
          where.isRead = false;
        }

        const rows = await this.prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });

        if (rows.length > 0) {
          return rows.map((r: any) => ({
            id: r.id,
            userId: r.userId,
            title: r.title,
            message: r.message,
            type: r.type as any,
            entityType: r.entityType as any,
            entityId: r.entityId,
            isRead: r.isRead,
            readAt: r.readAt,
            createdAt: r.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Failed querying DB notifications: ${(err as Error).message}`);
      }
    }

    return this.memoryNotifications
      .filter((n) => n.userId === userId && (!unreadOnly || !n.isRead))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const list = await this.findAllForUser(userId, true);
    return { count: list.length };
  }

  async markAsRead(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    if (this.prisma.isConnected) {
      try {
        await this.prisma.notification.updateMany({
          where: { id, userId },
          data: { isRead: true, readAt: new Date() },
        });
        return { success: true, message: 'Notification marked as read' };
      } catch (err) {
        this.logger.warn(`Failed marking notification read in DB: ${(err as Error).message}`);
      }
    }

    const n = this.memoryNotifications.find((x) => x.id === id && x.userId === userId);
    if (n) {
      n.isRead = true;
      n.readAt = new Date().toISOString();
    }
    return { success: true, message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean; count: number }> {
    if (this.prisma.isConnected) {
      try {
        const res = await this.prisma.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true, readAt: new Date() },
        });
        return { success: true, count: res.count };
      } catch (err) {
        this.logger.warn(`Failed marking all read in DB: ${(err as Error).message}`);
      }
    }

    let count = 0;
    this.memoryNotifications
      .filter((n) => n.userId === userId && !n.isRead)
      .forEach((n) => {
        n.isRead = true;
        n.readAt = new Date().toISOString();
        count++;
      });

    return { success: true, count };
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
    entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
    entityId?: string | null;
  }): Promise<NotificationItem> {
    const item: NotificationItem = {
      id: crypto.randomUUID(),
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      entityType: data.entityType,
      entityId: data.entityId || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (this.prisma.isConnected) {
      try {
        await this.prisma.notification.create({
          data: {
            id: item.id,
            userId: item.userId,
            title: item.title,
            message: item.message,
            type: item.type,
            entityType: item.entityType,
            entityId: item.entityId,
            isRead: false,
            createdAt: new Date(),
          },
        });
      } catch (err) {
        this.logger.warn(`Failed writing notification to DB: ${(err as Error).message}`);
      }
    }

    this.memoryNotifications.unshift(item);
    return item;
  }

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type?: any;
    entityType?: any;
    entityId?: string | null;
    link?: string;
  }): Promise<NotificationItem> {
    return this.create({
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: (['INFO', 'SUCCESS', 'WARNING', 'URGENT', 'TICKET', 'TASK', 'SYSTEM'].includes(data.type) ? data.type : 'INFO') as any,
      entityType: data.entityType,
      entityId: data.entityId,
    });
  }
}
