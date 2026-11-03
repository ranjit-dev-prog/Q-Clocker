import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import * as schema from '../../database/schema';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto, ResolveTicketDto } from './dto/update-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';
import { CreateTicketCommentDto } from './dto/ticket-comment.dto';
import { generateReferenceId } from '../../common/utils/reference-id.util';
import { Priority, TicketCategory, TicketStatus, UserRole } from '../../common/enums';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  // In-memory fallback tickets store
  private demoTickets: Array<any> = [
    {
      id: '40000000-0000-0000-0000-000000000001',
      referenceId: 'TKT-7K9X2M',
      ticketNumber: 'TKT-7K9X2M',
      title: 'VPN Certificate Renewal for Development Cluster',
      description: 'The OpenVPN client certificates expire in 48 hours for the core engineering VPC.',
      requesterId: '00000000-0000-0000-0000-000000000004',
      requesterName: 'David Ross',
      assignedTechnicianId: '00000000-0000-0000-0000-000000000002',
      technicianName: 'Marcus Chen',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      priority: Priority.HIGH,
      category: TicketCategory.NETWORK,
      subcategory: 'OpenVPN Client',
      status: TicketStatus.IN_PROGRESS,
      dueDate: new Date(Date.now() + 18 * 3600 * 1000),
      slaHours: 24,
      slaBreached: false,
      firstResponseAt: new Date(Date.now() - 2 * 3600 * 1000),
      createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      referenceId: 'TKT-8P4N6Q',
      ticketNumber: 'TKT-8P4N6Q',
      title: 'Active Directory User Access Permission for Staging Database',
      description: 'Grant read-write access to QA automation test harness on staging schema.',
      requesterId: '00000000-0000-0000-0000-000000000003',
      requesterName: 'Sarah Jenkins',
      assignedTechnicianId: '00000000-0000-0000-0000-000000000002',
      technicianName: 'Marcus Chen',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      priority: Priority.MEDIUM,
      category: TicketCategory.ACCESS_MANAGEMENT,
      subcategory: 'RBAC Grants',
      status: TicketStatus.RESOLVED,
      dueDate: new Date(Date.now() + 20 * 3600 * 1000),
      slaHours: 24,
      slaBreached: false,
      firstResponseAt: new Date(Date.now() - 4 * 3600 * 1000),
      resolutionNotes: 'Role membership added in Active Directory security group.',
      resolvedAt: new Date(Date.now() - 1 * 3600 * 1000),
      createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      updatedAt: new Date(Date.now() - 1 * 3600 * 1000),
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      referenceId: 'TKT-5R9W2A',
      ticketNumber: 'TKT-5R9W2A',
      title: 'Primary Database Replica Latency Alert in US-East',
      description: 'Replication delay spiked past 180 seconds during the nightly analytical batch.',
      requesterId: '00000000-0000-0000-0000-000000000002',
      requesterName: 'Marcus Chen',
      assignedTechnicianId: '00000000-0000-0000-0000-000000000001',
      technicianName: 'Alexander Vance',
      departmentId: '10000000-0000-0000-0000-000000000001',
      departmentName: 'Information Technology',
      priority: Priority.CRITICAL,
      category: TicketCategory.INFRASTRUCTURE,
      subcategory: 'Database Replication',
      status: TicketStatus.NEW,
      dueDate: new Date(Date.now() + 4 * 3600 * 1000),
      slaHours: 4,
      slaBreached: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
  ];

  private demoComments: Array<any> = [
    {
      id: '50000000-0000-0000-0000-000000000001',
      ticketId: '40000000-0000-0000-0000-000000000001',
      userId: '00000000-0000-0000-0000-000000000002',
      userName: 'Marcus Chen',
      comment: 'Certificate bundle generated. Validating CRL distribution point.',
      isInternalNote: false,
      createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    },
  ];

  constructor(private readonly dbService: DatabaseService) {}

  private calculateSlaHours(priority: Priority): number {
    switch (priority) {
      case Priority.CRITICAL:
        return 4; // 4 hour resolution
      case Priority.HIGH:
      case Priority.URGENT:
        return 8; // 8 hour resolution
      case Priority.MEDIUM:
        return 24; // 24 hour resolution
      case Priority.LOW:
      default:
        return 72; // 72 hour resolution
    }
  }

  async create(createTicketDto: CreateTicketDto, user: any) {
    const referenceId = generateReferenceId('TKT');
    const ticketNumber = referenceId;
    const priority = createTicketDto.priority || Priority.MEDIUM;
    const slaHours = this.calculateSlaHours(priority);
    const dueDate = new Date(Date.now() + slaHours * 3600 * 1000);

    if (this.dbService.getConnectionStatus()) {
      const [newTicket] = await this.dbService.db
        .insert(schema.tickets)
        .values({
          referenceId,
          ticketNumber,
          title: createTicketDto.title.trim(),
          description: createTicketDto.description.trim(),
          requesterId: user.id,
          assignedTechnicianId: createTicketDto.assignedTechnicianId || null,
          departmentId: createTicketDto.departmentId || user.departmentId || null,
          priority,
          category: createTicketDto.category || TicketCategory.IT_SUPPORT,
          subcategory: createTicketDto.subcategory?.trim() || null,
          status: createTicketDto.assignedTechnicianId ? TicketStatus.ASSIGNED : TicketStatus.NEW,
          slaPolicyId: createTicketDto.slaPolicyId || null,
          dueDate,
          slaHours,
          slaBreached: false,
          relatedTaskId: createTicketDto.relatedTaskId || null,
          relatedAssetId: createTicketDto.relatedAssetId || null,
        })
        .returning();

      // Record initial audit history
      await this.dbService.db.insert(schema.ticketHistory).values({
        ticketId: newTicket.id,
        changedById: user.id,
        fieldChanged: 'STATUS',
        oldValue: 'NONE',
        newValue: newTicket.status,
      });

      return this.findById(newTicket.id);
    }

    // In-memory fallback
    const newTicket = {
      id: crypto.randomUUID(),
      referenceId,
      ticketNumber,
      title: createTicketDto.title.trim(),
      description: createTicketDto.description.trim(),
      requesterId: user.id,
      requesterName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
      assignedTechnicianId: createTicketDto.assignedTechnicianId || null,
      technicianName: createTicketDto.assignedTechnicianId ? 'Assigned Technician' : 'Unassigned',
      departmentId: createTicketDto.departmentId || user.departmentId || null,
      departmentName: 'IT Operations',
      priority,
      category: createTicketDto.category || TicketCategory.IT_SUPPORT,
      subcategory: createTicketDto.subcategory?.trim() || null,
      status: createTicketDto.assignedTechnicianId ? TicketStatus.ASSIGNED : TicketStatus.NEW,
      dueDate,
      slaHours,
      slaBreached: false,
      firstResponseAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.demoTickets.unshift(newTicket);
    return newTicket;
  }

  async findAll(query: TicketQueryDto, user: any) {
    if (this.dbService.getConnectionStatus()) {
      const conditions: any[] = [];

      if (query.status) {
        conditions.push(eq(schema.tickets.status, query.status));
      }
      if (query.priority) {
        conditions.push(eq(schema.tickets.priority, query.priority));
      }
      if (query.category) {
        conditions.push(eq(schema.tickets.category, query.category));
      }
      if (query.departmentId) {
        conditions.push(eq(schema.tickets.departmentId, query.departmentId));
      }
      if (query.assignedTechnicianId) {
        conditions.push(eq(schema.tickets.assignedTechnicianId, query.assignedTechnicianId));
      }
      if (query.requesterId) {
        conditions.push(eq(schema.tickets.requesterId, query.requesterId));
      }
      if (query.search) {
        const pattern = `%${query.search.trim()}%`;
        conditions.push(
          or(
            ilike(schema.tickets.title, pattern),
            ilike(schema.tickets.referenceId, pattern),
            ilike(schema.tickets.description, pattern),
          ),
        );
      }

      const rows = await this.dbService.db
        .select({
          id: schema.tickets.id,
          referenceId: schema.tickets.referenceId,
          ticketNumber: schema.tickets.ticketNumber,
          title: schema.tickets.title,
          description: schema.tickets.description,
          priority: schema.tickets.priority,
          category: schema.tickets.category,
          subcategory: schema.tickets.subcategory,
          status: schema.tickets.status,
          dueDate: schema.tickets.dueDate,
          slaHours: schema.tickets.slaHours,
          firstResponseAt: schema.tickets.firstResponseAt,
          resolvedAt: schema.tickets.resolvedAt,
          closedAt: schema.tickets.closedAt,
          resolutionNotes: schema.tickets.resolutionNotes,
          requesterId: schema.tickets.requesterId,
          assignedTechnicianId: schema.tickets.assignedTechnicianId,
          departmentId: schema.tickets.departmentId,
          createdAt: schema.tickets.createdAt,
          updatedAt: schema.tickets.updatedAt,
        })
        .from(schema.tickets)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(schema.tickets.createdAt));

      const now = new Date();
      return rows.map((t) => {
        const isSlaBreached =
          t.status !== TicketStatus.RESOLVED &&
          t.status !== TicketStatus.CLOSED &&
          t.dueDate !== null &&
          new Date(t.dueDate) < now;

        return {
          ...t,
          slaBreached: isSlaBreached,
        };
      });
    }

    const now = new Date();
    return this.demoTickets
      .filter((t) => {
        if (query.status && t.status !== query.status) return false;
        if (query.priority && t.priority !== query.priority) return false;
        if (query.category && t.category !== query.category) return false;
        if (query.search) {
          const q = query.search.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.referenceId.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .map((t) => ({
        ...t,
        slaBreached:
          t.status !== TicketStatus.RESOLVED &&
          t.status !== TicketStatus.CLOSED &&
          new Date(t.dueDate) < now,
      }));
  }

  async findById(id: string) {
    if (this.dbService.getConnectionStatus()) {
      const [ticket] = await this.dbService.db
        .select()
        .from(schema.tickets)
        .where(or(eq(schema.tickets.id, id), eq(schema.tickets.referenceId, id)))
        .limit(1);

      if (!ticket) {
        throw new NotFoundException(`Ticket with ID or Reference '${id}' not found`);
      }

      // Fetch comments
      const comments = await this.dbService.db
        .select({
          id: schema.ticketComments.id,
          comment: schema.ticketComments.comment,
          isInternalNote: schema.ticketComments.isInternalNote,
          createdAt: schema.ticketComments.createdAt,
          authorFirstName: schema.users.firstName,
          authorLastName: schema.users.lastName,
          authorRole: schema.users.roleCode,
        })
        .from(schema.ticketComments)
        .leftJoin(schema.users, eq(schema.ticketComments.userId, schema.users.id))
        .where(eq(schema.ticketComments.ticketId, ticket.id))
        .orderBy(desc(schema.ticketComments.createdAt));

      // Fetch history audit trail
      const history = await this.dbService.db
        .select({
          id: schema.ticketHistory.id,
          fieldChanged: schema.ticketHistory.fieldChanged,
          oldValue: schema.ticketHistory.oldValue,
          newValue: schema.ticketHistory.newValue,
          changedAt: schema.ticketHistory.changedAt,
          changedByFirstName: schema.users.firstName,
          changedByLastName: schema.users.lastName,
        })
        .from(schema.ticketHistory)
        .leftJoin(schema.users, eq(schema.ticketHistory.changedById, schema.users.id))
        .where(eq(schema.ticketHistory.ticketId, ticket.id))
        .orderBy(desc(schema.ticketHistory.changedAt));

      const now = new Date();
      return {
        ...ticket,
        slaBreached:
          ticket.status !== TicketStatus.RESOLVED &&
          ticket.status !== TicketStatus.CLOSED &&
          ticket.dueDate !== null &&
          new Date(ticket.dueDate) < now,
        comments,
        history,
      };
    }

    const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID or Reference '${id}' not found`);
    }

    const comments = this.demoComments.filter((c) => c.ticketId === ticket.id);
    return {
      ...ticket,
      comments,
      history: [
        {
          id: '60000000-0000-0000-0000-000000000001',
          fieldChanged: 'STATUS',
          oldValue: 'NEW',
          newValue: ticket.status,
          changedAt: ticket.createdAt,
          changedByFirstName: 'System',
          changedByLastName: 'Automation',
        },
      ],
    };
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, user: any) {
    if (this.dbService.getConnectionStatus()) {
      const [existing] = await this.dbService.db
        .select()
        .from(schema.tickets)
        .where(or(eq(schema.tickets.id, id), eq(schema.tickets.referenceId, id)))
        .limit(1);

      if (!existing) {
        throw new NotFoundException(`Ticket with ID '${id}' not found`);
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (updateTicketDto.title) updateData.title = updateTicketDto.title.trim();
      if (updateTicketDto.description) updateData.description = updateTicketDto.description.trim();
      if (updateTicketDto.priority) updateData.priority = updateTicketDto.priority;
      if (updateTicketDto.category) updateData.category = updateTicketDto.category;
      if (updateTicketDto.subcategory) updateData.subcategory = updateTicketDto.subcategory;
      if (updateTicketDto.departmentId) updateData.departmentId = updateTicketDto.departmentId;
      if (updateTicketDto.assignedTechnicianId) {
        updateData.assignedTechnicianId = updateTicketDto.assignedTechnicianId;
        if (existing.status === TicketStatus.NEW) {
          updateData.status = TicketStatus.ASSIGNED;
        }
      }
      if (updateTicketDto.status) updateData.status = updateTicketDto.status;
      if (updateTicketDto.resolutionNotes) updateData.resolutionNotes = updateTicketDto.resolutionNotes;

      await this.dbService.db
        .update(schema.tickets)
        .set(updateData)
        .where(eq(schema.tickets.id, existing.id));

      // Record audit history if status or technician changed
      if (updateTicketDto.status && updateTicketDto.status !== existing.status) {
        await this.dbService.db.insert(schema.ticketHistory).values({
          ticketId: existing.id,
          changedById: user.id,
          fieldChanged: 'STATUS',
          oldValue: existing.status,
          newValue: updateTicketDto.status,
        });
      }

      return this.findById(existing.id);
    }

    const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID '${id}' not found`);
    }

    Object.assign(ticket, {
      ...updateTicketDto,
      updatedAt: new Date(),
    });

    return ticket;
  }

  async resolve(id: string, dto: ResolveTicketDto, user: any) {
    if (this.dbService.getConnectionStatus()) {
      const [existing] = await this.dbService.db
        .select()
        .from(schema.tickets)
        .where(or(eq(schema.tickets.id, id), eq(schema.tickets.referenceId, id)))
        .limit(1);

      if (!existing) {
        throw new NotFoundException(`Ticket '${id}' not found`);
      }

      await this.dbService.db
        .update(schema.tickets)
        .set({
          status: TicketStatus.RESOLVED,
          resolvedAt: new Date(),
          resolutionNotes: dto.resolutionNotes.trim(),
          updatedAt: new Date(),
        })
        .where(eq(schema.tickets.id, existing.id));

      await this.dbService.db.insert(schema.ticketHistory).values({
        ticketId: existing.id,
        changedById: user.id,
        fieldChanged: 'STATUS',
        oldValue: existing.status,
        newValue: TicketStatus.RESOLVED,
      });

      return this.findById(existing.id);
    }

    const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
    if (!ticket) throw new NotFoundException(`Ticket '${id}' not found`);

    ticket.status = TicketStatus.RESOLVED;
    ticket.resolvedAt = new Date();
    ticket.resolutionNotes = dto.resolutionNotes.trim();
    ticket.updatedAt = new Date();
    return ticket;
  }

  async addComment(id: string, dto: CreateTicketCommentDto, user: any) {
    const ticket = await this.findById(id);

    if (this.dbService.getConnectionStatus()) {
      const [newComment] = await this.dbService.db
        .insert(schema.ticketComments)
        .values({
          ticketId: ticket.id,
          userId: user.id,
          comment: dto.comment.trim(),
          isInternalNote: dto.isInternalNote || false,
        })
        .returning();

      // If this is first response and user is not requester, mark firstResponseAt
      if (!ticket.firstResponseAt && user.id !== ticket.requesterId) {
        await this.dbService.db
          .update(schema.tickets)
          .set({ firstResponseAt: new Date() })
          .where(eq(schema.tickets.id, ticket.id));
      }

      return newComment;
    }

    const comment = {
      id: crypto.randomUUID(),
      ticketId: ticket.id,
      userId: user.id,
      userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
      comment: dto.comment.trim(),
      isInternalNote: dto.isInternalNote || false,
      createdAt: new Date(),
    };
    this.demoComments.unshift(comment);
    return comment;
  }

  async getMetrics() {
    const all = await this.findAll({}, { role: UserRole.SUPER_ADMIN });
    const now = new Date();

    const openTickets = all.filter(
      (t) => t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED,
    );

    const breachedCount = openTickets.filter((t) => t.slaBreached).length;
    const resolvedCount = all.filter((t) => t.status === TicketStatus.RESOLVED).length;

    return {
      totalTickets: all.length,
      openTickets: openTickets.length,
      resolvedTickets: resolvedCount,
      slaBreachedCount: breachedCount,
      slaComplianceRate:
        all.length > 0
          ? (((all.length - breachedCount) / all.length) * 100).toFixed(1) + '%'
          : '100%',
    };
  }
}
