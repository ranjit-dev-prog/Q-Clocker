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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LifecycleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifecycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let LifecycleService = LifecycleService_1 = class LifecycleService {
    prisma;
    notificationsService;
    logger = new common_1.Logger(LifecycleService_1.name);
    memoryEvents = [
        {
            id: '70000000-0000-0000-0000-000000000001',
            employeeId: '00000000-0000-0000-0000-000000000003',
            employeeName: 'Sarah Jenkins',
            employeeCode: 'EMP003',
            departmentName: 'Software Engineering',
            eventType: 'WORK_ANNIVERSARY',
            eventDate: new Date(Date.now() + 2 * 86400 * 1000).toISOString().substring(0, 10),
            title: 'Celebrating 3 Years at Q Clocker!',
            description: 'Sarah has led the core backend architecture and mentored 6 engineers across high-velocity squads.',
            urgency: 'INFO',
            daysRemaining: 2,
            actionTaken: false,
            congratulationsCount: 14,
            congratulatedByUserIds: ['00000000-0000-0000-0000-000000000001'],
            createdAt: new Date().toISOString(),
        },
        {
            id: '70000000-0000-0000-0000-000000000002',
            employeeId: '00000000-0000-0000-0000-000000000004',
            employeeName: 'Marcus Chen',
            employeeCode: 'EMP004',
            departmentName: 'Information Technology',
            eventType: 'BIRTHDAY',
            eventDate: new Date(Date.now() + 5 * 86400 * 1000).toISOString().substring(0, 10),
            title: 'Birthday Celebration Coming Up',
            description: 'Wishing Marcus Chen a wonderful year ahead from the executive and IT operations teams!',
            urgency: 'INFO',
            daysRemaining: 5,
            actionTaken: false,
            congratulationsCount: 9,
            congratulatedByUserIds: [],
            createdAt: new Date().toISOString(),
        },
        {
            id: '70000000-0000-0000-0000-000000000003',
            employeeId: '00000000-0000-0000-0000-000000000007',
            employeeName: 'David Ross',
            employeeCode: 'EMP007',
            departmentName: 'Software Engineering',
            eventType: 'PROBATION_END',
            eventDate: new Date(Date.now() + 4 * 86400 * 1000).toISOString().substring(0, 10),
            title: '90-Day Probation Period Evaluation Due',
            description: 'Manager evaluation must be signed off by Sarah Jenkins before automatic confirmation.',
            urgency: 'CRITICAL',
            daysRemaining: 4,
            actionTaken: false,
            congratulationsCount: 0,
            congratulatedByUserIds: [],
            createdAt: new Date().toISOString(),
        },
        {
            id: '70000000-0000-0000-0000-000000000004',
            employeeId: '00000000-0000-0000-0000-000000000008',
            employeeName: 'Rachel Adams',
            employeeCode: 'EMP008',
            departmentName: 'Compliance & Audit',
            eventType: 'DOCUMENT_EXPIRY',
            eventDate: new Date(Date.now() + 18 * 86400 * 1000).toISOString().substring(0, 10),
            title: 'ISO 27001 Lead Auditor Certificate Renewal',
            description: 'Annual statutory verification renewal required for enterprise compliance filing.',
            urgency: 'UPCOMING',
            daysRemaining: 18,
            actionTaken: false,
            congratulationsCount: 0,
            congratulatedByUserIds: [],
            createdAt: new Date().toISOString(),
        },
        {
            id: '70000000-0000-0000-0000-000000000005',
            employeeId: '00000000-0000-0000-0000-000000000005',
            employeeName: 'Diana Prince',
            employeeCode: 'EMP005',
            departmentName: 'Software Engineering',
            eventType: 'CONTRACT_EXPIRY',
            eventDate: new Date(Date.now() + 6 * 86400 * 1000).toISOString().substring(0, 10),
            title: 'Senior Contract Renewal Agreement',
            description: 'Consultant master service agreement renewal pending HR leadership review.',
            urgency: 'CRITICAL',
            daysRemaining: 6,
            actionTaken: false,
            congratulationsCount: 0,
            congratulatedByUserIds: [],
            createdAt: new Date().toISOString(),
        },
    ];
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async getCelebrationsFeed() {
        return this.memoryEvents.filter((e) => ['BIRTHDAY', 'WORK_ANNIVERSARY'].includes(e.eventType));
    }
    async congratulate(eventId, user) {
        const ev = this.memoryEvents.find((e) => e.id === eventId);
        if (!ev)
            throw new common_1.NotFoundException('Event not found');
        if (!ev.congratulatedByUserIds.includes(user.id)) {
            ev.congratulatedByUserIds.push(user.id);
            ev.congratulationsCount++;
            if (this.notificationsService) {
                this.notificationsService.createNotification({
                    userId: ev.employeeId,
                    title: 'Peer Congratulations Received!',
                    message: `${user.firstName || 'A teammate'} sent congratulations on your ${ev.title}.`,
                    type: 'INFO',
                    entityType: 'SYSTEM',
                });
            }
        }
        return {
            success: true,
            congratulationsCount: ev.congratulationsCount,
            hasCongratulated: true,
        };
    }
    async getReminders(urgency) {
        let list = this.memoryEvents.filter((e) => ['PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY'].includes(e.eventType));
        if (urgency) {
            list = list.filter((e) => e.urgency === urgency);
        }
        return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
    }
    async sendReminderNotification(reminderId, actorUser) {
        const item = this.memoryEvents.find((e) => e.id === reminderId);
        if (!item)
            throw new common_1.NotFoundException('Reminder item not found');
        if (this.notificationsService) {
            this.notificationsService.createNotification({
                userId: item.employeeId,
                title: `URGENT: ${item.title}`,
                message: `${item.description} (Action required within ${item.daysRemaining} days by ${actorUser.firstName || 'HR'}).`,
                type: 'URGENT',
                entityType: 'SYSTEM',
                link: '/hr/reminders',
            });
        }
        return {
            success: true,
            message: `Urgent notification dispatched to ${item.employeeName}.`,
        };
    }
    async extendProbation(reminderId, dto, actorUser) {
        const item = this.memoryEvents.find((e) => e.id === reminderId);
        if (!item)
            throw new common_1.NotFoundException('Reminder not found');
        item.eventDate = dto.newEndDate;
        item.description = `${item.description} [Extended to ${dto.newEndDate} by ${actorUser.firstName || 'HR'}: ${dto.reason}]`;
        item.urgency = 'UPCOMING';
        item.daysRemaining = Math.max(1, Math.round((new Date(dto.newEndDate).getTime() - Date.now()) / 86400000));
        if (this.notificationsService) {
            this.notificationsService.createNotification({
                userId: item.employeeId,
                title: 'Probation Period Extended',
                message: `Your probation end date has been updated to ${dto.newEndDate}. Reason: ${dto.reason}`,
                type: 'WARNING',
                entityType: 'SYSTEM',
            });
        }
        return {
            success: true,
            message: `Probation successfully extended for ${item.employeeName}.`,
            item,
        };
    }
    async resolveReminder(reminderId) {
        const item = this.memoryEvents.find((e) => e.id === reminderId);
        if (!item)
            throw new common_1.NotFoundException('Reminder not found');
        item.actionTaken = true;
        return {
            success: true,
            message: 'Reminder marked as completed/resolved.',
            item,
        };
    }
};
exports.LifecycleService = LifecycleService;
exports.LifecycleService = LifecycleService = LifecycleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], LifecycleService);
//# sourceMappingURL=lifecycle.service.js.map