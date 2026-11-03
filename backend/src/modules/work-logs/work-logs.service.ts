import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { WorkLogQueryDto } from './dto/work-log-query.dto';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import { UserRole } from '../../common/enums';

@Injectable()
export class WorkLogsService {
  private readonly logger = new Logger(WorkLogsService.name);

  // In-memory fallback work logs store
  private demoWorkLogs: Array<any> = [
    {
      id: '70000000-0000-0000-0000-000000000001',
      referenceId: 'WLG-8K9N2M',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      taskId: '20000000-0000-0000-0000-000000000001',
      taskTitle: 'Implement Drizzle ORM Schema & Relational Models',
      taskReference: 'TSK-9X4K21',
      ticketId: null,
      ticketTitle: null,
      ticketReference: null,
      logDate: '2026-11-03',
      startTime: '09:00',
      endTime: '13:00',
      totalHours: '4.00',
      workDescription: 'Engineered normalized database schemas with proper foreign keys, constraints, and DDL migrations.',
      investigationPerformed: 'Benchmarked PostgreSQL connection pool limits under synthetic concurrent query stress.',
      actionsTaken: 'Authored 26 table definitions and verified backward-compatible rollback migrations.',
      challengesFaced: 'Resolving circular relation between departments and manager users.',
      status: 'SUBMITTED',
      createdAt: new Date('2026-11-03T13:00:00Z'),
    },
    {
      id: '70000000-0000-0000-0000-000000000002',
      referenceId: 'WLG-3R7P4X',
      employeeId: '00000000-0000-0000-0000-000000000004',
      employeeName: 'David Ross',
      taskId: '20000000-0000-0000-0000-000000000002',
      taskTitle: 'Angular Standalone Shell & Tailwind Layout',
      taskReference: 'TSK-3M8N7Q',
      ticketId: null,
      ticketTitle: null,
      ticketReference: null,
      logDate: '2026-11-03',
      startTime: '14:00',
      endTime: '17:30',
      totalHours: '3.50',
      workDescription: 'Crafted responsive enterprise layout with theme toggling and live role switching.',
      investigationPerformed: 'Audited Tailwind CSS build sizes and bundle splitting.',
      actionsTaken: 'Created standalone components, sidebar navigation, and header profile widget.',
      challengesFaced: null,
      status: 'APPROVED',
      createdAt: new Date('2026-11-03T17:30:00Z'),
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  async create(createWorkLogDto: CreateWorkLogDto, user: any) {
    const referenceId = generateReferenceId('WLG');
    const totalHoursStr = createWorkLogDto.totalHours.toFixed(2);

    if (this.dbService.getConnectionStatus()) {
      const [newLog] = await this.dbService.db
        .insert(schema.workLogs)
        .values({
          referenceId,
          employeeId: user.id,
          taskId: createWorkLogDto.taskId || null,
          ticketId: createWorkLogDto.ticketId || null,
          logDate: createWorkLogDto.logDate,
          startTime: createWorkLogDto.startTime,
          endTime: createWorkLogDto.endTime,
          totalHours: totalHoursStr,
          workDescription: createWorkLogDto.workDescription.trim(),
          investigationPerformed: createWorkLogDto.investigationPerformed?.trim() || null,
          actionsTaken: createWorkLogDto.actionsTaken?.trim() || null,
          challengesFaced: createWorkLogDto.challengesFaced?.trim() || null,
          status: 'SUBMITTED',
        })
        .returning();

      // If linked to a task, update task actual hours
      if (createWorkLogDto.taskId) {
        try {
          await this.dbService.db
            .update(schema.tasks)
            .set({
              actualHours: sql`${schema.tasks.actualHours} + ${createWorkLogDto.totalHours}`,
              updatedAt: new Date(),
            })
            .where(eq(schema.tasks.id, createWorkLogDto.taskId));
        } catch (err) {
          this.logger.warn(`Failed to increment task hours: ${(err as Error).message}`);
        }
      }

      return this.findById(newLog.id);
    }

    // In-memory fallback
    const newLog = {
      id: crypto.randomUUID(),
      referenceId,
      employeeId: user.id,
      employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
      taskId: createWorkLogDto.taskId || null,
      taskTitle: createWorkLogDto.taskId ? 'Linked Task' : null,
      taskReference: createWorkLogDto.taskId ? 'TSK-LINKED' : null,
      ticketId: createWorkLogDto.ticketId || null,
      ticketTitle: createWorkLogDto.ticketId ? 'Linked Ticket' : null,
      ticketReference: createWorkLogDto.ticketId ? 'TKT-LINKED' : null,
      logDate: createWorkLogDto.logDate,
      startTime: createWorkLogDto.startTime,
      endTime: createWorkLogDto.endTime,
      totalHours: totalHoursStr,
      workDescription: createWorkLogDto.workDescription.trim(),
      investigationPerformed: createWorkLogDto.investigationPerformed?.trim() || null,
      actionsTaken: createWorkLogDto.actionsTaken?.trim() || null,
      challengesFaced: createWorkLogDto.challengesFaced?.trim() || null,
      status: 'SUBMITTED',
      createdAt: new Date(),
    };
    this.demoWorkLogs.unshift(newLog);
    return newLog;
  }

  async findAll(query: WorkLogQueryDto, user: any) {
    if (this.dbService.getConnectionStatus()) {
      const conditions: any[] = [];

      // If standard employee, restrict to their logs
      if (user.role === UserRole.EMPLOYEE) {
        conditions.push(eq(schema.workLogs.employeeId, user.id));
      } else if (query.employeeId) {
        conditions.push(eq(schema.workLogs.employeeId, query.employeeId));
      }

      if (query.logDate) {
        conditions.push(eq(schema.workLogs.logDate, query.logDate));
      }
      if (query.taskId) {
        conditions.push(eq(schema.workLogs.taskId, query.taskId));
      }
      if (query.ticketId) {
        conditions.push(eq(schema.workLogs.ticketId, query.ticketId));
      }

      const rows = await this.dbService.db
        .select({
          id: schema.workLogs.id,
          referenceId: schema.workLogs.referenceId,
          employeeId: schema.workLogs.employeeId,
          employeeFirstName: schema.users.firstName,
          employeeLastName: schema.users.lastName,
          employeeEmail: schema.users.email,
          taskId: schema.workLogs.taskId,
          taskTitle: schema.tasks.title,
          taskReference: schema.tasks.referenceId,
          ticketId: schema.workLogs.ticketId,
          ticketTitle: schema.tickets.title,
          ticketReference: schema.tickets.referenceId,
          logDate: schema.workLogs.logDate,
          startTime: schema.workLogs.startTime,
          endTime: schema.workLogs.endTime,
          totalHours: schema.workLogs.totalHours,
          workDescription: schema.workLogs.workDescription,
          investigationPerformed: schema.workLogs.investigationPerformed,
          actionsTaken: schema.workLogs.actionsTaken,
          challengesFaced: schema.workLogs.challengesFaced,
          status: schema.workLogs.status,
          createdAt: schema.workLogs.createdAt,
        })
        .from(schema.workLogs)
        .leftJoin(schema.users, eq(schema.workLogs.employeeId, schema.users.id))
        .leftJoin(schema.tasks, eq(schema.workLogs.taskId, schema.tasks.id))
        .leftJoin(schema.tickets, eq(schema.workLogs.ticketId, schema.tickets.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(schema.workLogs.logDate), desc(schema.workLogs.createdAt));

      return rows.map((r) => ({
        ...r,
        employeeName: `${r.employeeFirstName || ''} ${r.employeeLastName || ''}`.trim() || 'Employee',
      }));
    }

    return this.demoWorkLogs.filter((l) => {
      if (user.role === UserRole.EMPLOYEE && l.employeeId !== user.id) return false;
      if (query.employeeId && l.employeeId !== query.employeeId) return false;
      if (query.logDate && l.logDate !== query.logDate) return false;
      return true;
    });
  }

  async findById(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [log] = await this.dbService.db
        .select()
        .from(schema.workLogs)
        .where(eq(schema.workLogs.id, id))
        .limit(1);

      if (!log) throw new NotFoundException(`Work log '${id}' not found`);
      return log;
    }

    const log = this.demoWorkLogs.find((l) => l.id === id || l.referenceId === id);
    if (!log) throw new NotFoundException(`Work log '${id}' not found`);
    return log;
  }

  async getDailySummary(date: string, user: any) {
    const logs = await this.findAll({ logDate: date }, user);
    const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.totalHours || 0), 0);
    const uniqueEmployees = new Set(logs.map((l) => l.employeeId)).size;

    return {
      date,
      totalHours: totalHours.toFixed(2),
      activeEmployees: uniqueEmployees,
      totalEntries: logs.length,
      logs,
    };
  }
}
