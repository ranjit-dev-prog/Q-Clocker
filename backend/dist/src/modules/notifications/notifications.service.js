"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const crypto = require("crypto");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    dbService;
    logger = new common_1.Logger(NotificationsService_1.name);
    memoryNotifications = [
        {
            id: '90000000-0000-0000-0000-000000000001',
            userId: '00000000-0000-0000-0000-000000000001',
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
            id: '90000000-0000-0000-0000-000000000004',
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
            id: '90000000-0000-0000-0000-000000000006',
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
            id: '90000000-0000-0000-0000-000000000007',
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
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findAllForUser(userId, unreadOnly = false) {
        if (this.dbService.getConnectionStatus()) {
            try {
                let conditions = (0, drizzle_orm_1.eq)(schema.notifications.userId, userId);
                if (unreadOnly) {
                    conditions = (0, drizzle_orm_1.and)(conditions, (0, drizzle_orm_1.eq)(schema.notifications.isRead, false));
                }
                const rows = await this.dbService.db
                    .select()
                    .from(schema.notifications)
                    .where(conditions)
                    .orderBy((0, drizzle_orm_1.desc)(schema.notifications.createdAt));
                if (rows.length > 0) {
                    return rows.map((r) => ({
                        id: r.id,
                        userId: r.userId,
                        title: r.title,
                        message: r.message,
                        type: r.type,
                        entityType: r.entityType,
                        entityId: r.entityId,
                        isRead: r.isRead,
                        readAt: r.readAt,
                        createdAt: r.createdAt.toISOString(),
                    }));
                }
            }
            catch (err) {
                this.logger.warn(`Failed querying DB notifications: ${err.message}`);
            }
        }
        return this.memoryNotifications
            .filter((n) => n.userId === userId && (!unreadOnly || !n.isRead))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async getUnreadCount(userId) {
        const list = await this.findAllForUser(userId, true);
        return { count: list.length };
    }
    async markAsRead(id, userId) {
        if (this.dbService.getConnectionStatus()) {
            try {
                await this.dbService.db
                    .update(schema.notifications)
                    .set({ isRead: true, readAt: new Date() })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.id, id), (0, drizzle_orm_1.eq)(schema.notifications.userId, userId)));
                return { success: true, message: 'Notification marked as read' };
            }
            catch (err) {
                this.logger.warn(`Failed marking notification read in DB: ${err.message}`);
            }
        }
        const n = this.memoryNotifications.find((x) => x.id === id && x.userId === userId);
        if (n) {
            n.isRead = true;
            n.readAt = new Date().toISOString();
        }
        return { success: true, message: 'Notification marked as read' };
    }
    async markAllAsRead(userId) {
        if (this.dbService.getConnectionStatus()) {
            try {
                await this.dbService.db
                    .update(schema.notifications)
                    .set({ isRead: true, readAt: new Date() })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.notifications.userId, userId), (0, drizzle_orm_1.eq)(schema.notifications.isRead, false)));
                return { success: true, count: 0 };
            }
            catch (err) {
                this.logger.warn(`Failed marking all read in DB: ${err.message}`);
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
    async create(data) {
        const item = {
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
        if (this.dbService.getConnectionStatus()) {
            try {
                await this.dbService.db.insert(schema.notifications).values({
                    id: item.id,
                    userId: item.userId,
                    title: item.title,
                    message: item.message,
                    type: item.type,
                    entityType: item.entityType,
                    entityId: item.entityId,
                    isRead: false,
                    createdAt: new Date(),
                });
            }
            catch (err) {
                this.logger.warn(`Failed writing notification to DB: ${err.message}`);
            }
        }
        this.memoryNotifications.unshift(item);
        return item;
    }
    async createNotification(data) {
        return this.create({
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: (['INFO', 'SUCCESS', 'WARNING', 'URGENT', 'TICKET', 'TASK', 'SYSTEM'].includes(data.type) ? data.type : 'INFO'),
            entityType: data.entityType,
            entityId: data.entityId,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map