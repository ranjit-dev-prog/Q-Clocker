import {
  Injectable,
  NotFoundException,
  Logger,
  Optional,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateLifecycleEventDto, ExtendProbationDto } from './dto/lifecycle.dto';

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

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);

  // In-memory persistent demo store
  private memoryEvents: Array<LifecycleItem> = [
    {
      id: '70000000-0000-0000-0000-000000000001',
      employeeId: '00000000-0000-0000-0000-000000000003', // Sarah Jenkins
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
      employeeId: '00000000-0000-0000-0000-000000000004', // Marcus Chen
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
      employeeId: '00000000-0000-0000-0000-000000000007', // David Ross
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
      employeeId: '00000000-0000-0000-0000-000000000008', // Rachel Adams
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
      employeeId: '00000000-0000-0000-0000-000000000005', // Diana Prince
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

  constructor(
    private readonly dbService: DatabaseService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {}

  /**
   * Retrieves celebrations & milestone feed (Anniversaries, Birthdays)
   */
  async getCelebrationsFeed() {
    return this.memoryEvents.filter((e) => ['BIRTHDAY', 'WORK_ANNIVERSARY'].includes(e.eventType));
  }

  /**
   * 1-Click Peer Congratulations / Reactions
   */
  async congratulate(eventId: string, user: any) {
    const ev = this.memoryEvents.find((e) => e.id === eventId);
    if (!ev) throw new NotFoundException('Event not found');

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

  /**
   * Dedicated HR Reminders & Compliance Console
   */
  async getReminders(urgency?: string) {
    let list = this.memoryEvents.filter((e) =>
      ['PROBATION_END', 'CONTRACT_EXPIRY', 'DOCUMENT_EXPIRY'].includes(e.eventType),
    );

    if (urgency) {
      list = list.filter((e) => e.urgency === urgency);
    }

    return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  /**
   * Dispatch manual alert reminder to manager/employee
   */
  async sendReminderNotification(reminderId: string, actorUser: any) {
    const item = this.memoryEvents.find((e) => e.id === reminderId);
    if (!item) throw new NotFoundException('Reminder item not found');

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

  /**
   * Extend employee probation period
   */
  async extendProbation(reminderId: string, dto: ExtendProbationDto, actorUser: any) {
    const item = this.memoryEvents.find((e) => e.id === reminderId);
    if (!item) throw new NotFoundException('Reminder not found');

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

  /**
   * Mark compliance reminder action resolved
   */
  async resolveReminder(reminderId: string) {
    const item = this.memoryEvents.find((e) => e.id === reminderId);
    if (!item) throw new NotFoundException('Reminder not found');

    item.actionTaken = true;
    return {
      success: true,
      message: 'Reminder marked as completed/resolved.',
      item,
    };
  }
}

