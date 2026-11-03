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
var TicketsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
let TicketsService = TicketsService_1 = class TicketsService {
    dbService;
    logger = new common_1.Logger(TicketsService_1.name);
    demoTickets = [
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
            priority: enums_1.Priority.HIGH,
            category: enums_1.TicketCategory.NETWORK,
            subcategory: 'OpenVPN Client',
            status: enums_1.TicketStatus.IN_PROGRESS,
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
            priority: enums_1.Priority.MEDIUM,
            category: enums_1.TicketCategory.ACCESS_MANAGEMENT,
            subcategory: 'RBAC Grants',
            status: enums_1.TicketStatus.RESOLVED,
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
            priority: enums_1.Priority.CRITICAL,
            category: enums_1.TicketCategory.INFRASTRUCTURE,
            subcategory: 'Database Replication',
            status: enums_1.TicketStatus.NEW,
            dueDate: new Date(Date.now() + 4 * 3600 * 1000),
            slaHours: 4,
            slaBreached: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            updatedAt: new Date(Date.now() - 30 * 60 * 1000),
        },
    ];
    demoComments = [
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
    constructor(dbService) {
        this.dbService = dbService;
    }
    calculateSlaHours(priority) {
        switch (priority) {
            case enums_1.Priority.CRITICAL:
                return 4;
            case enums_1.Priority.HIGH:
            case enums_1.Priority.URGENT:
                return 8;
            case enums_1.Priority.MEDIUM:
                return 24;
            case enums_1.Priority.LOW:
            default:
                return 72;
        }
    }
    async create(createTicketDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('TKT');
        const ticketNumber = referenceId;
        const priority = createTicketDto.priority || enums_1.Priority.MEDIUM;
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
                category: createTicketDto.category || enums_1.TicketCategory.IT_SUPPORT,
                subcategory: createTicketDto.subcategory?.trim() || null,
                status: createTicketDto.assignedTechnicianId ? enums_1.TicketStatus.ASSIGNED : enums_1.TicketStatus.NEW,
                slaPolicyId: createTicketDto.slaPolicyId || null,
                dueDate,
                slaHours,
                slaBreached: false,
                relatedTaskId: createTicketDto.relatedTaskId || null,
                relatedAssetId: createTicketDto.relatedAssetId || null,
            })
                .returning();
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: newTicket.id,
                changedById: user.id,
                fieldChanged: 'STATUS',
                oldValue: 'NONE',
                newValue: newTicket.status,
            });
            return this.findById(newTicket.id);
        }
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
            category: createTicketDto.category || enums_1.TicketCategory.IT_SUPPORT,
            subcategory: createTicketDto.subcategory?.trim() || null,
            status: createTicketDto.assignedTechnicianId ? enums_1.TicketStatus.ASSIGNED : enums_1.TicketStatus.NEW,
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
    async findAll(query, user) {
        if (this.dbService.getConnectionStatus()) {
            const conditions = [];
            if (query.status) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.status, query.status));
            }
            if (query.priority) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.priority, query.priority));
            }
            if (query.category) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.category, query.category));
            }
            if (query.departmentId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.departmentId, query.departmentId));
            }
            if (query.assignedTechnicianId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.assignedTechnicianId, query.assignedTechnicianId));
            }
            if (query.requesterId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.requesterId, query.requesterId));
            }
            if (query.search) {
                const pattern = `%${query.search.trim()}%`;
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.tickets.title, pattern), (0, drizzle_orm_1.ilike)(schema.tickets.referenceId, pattern), (0, drizzle_orm_1.ilike)(schema.tickets.description, pattern)));
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
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(schema.tickets.createdAt));
            const now = new Date();
            return rows.map((t) => {
                const isSlaBreached = t.status !== enums_1.TicketStatus.RESOLVED &&
                    t.status !== enums_1.TicketStatus.CLOSED &&
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
            if (query.status && t.status !== query.status)
                return false;
            if (query.priority && t.priority !== query.priority)
                return false;
            if (query.category && t.category !== query.category)
                return false;
            if (query.search) {
                const q = query.search.toLowerCase();
                return (t.title.toLowerCase().includes(q) ||
                    t.referenceId.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q));
            }
            return true;
        })
            .map((t) => ({
            ...t,
            slaBreached: t.status !== enums_1.TicketStatus.RESOLVED &&
                t.status !== enums_1.TicketStatus.CLOSED &&
                new Date(t.dueDate) < now,
        }));
    }
    async findById(id) {
        if (this.dbService.getConnectionStatus()) {
            const [ticket] = await this.dbService.db
                .select()
                .from(schema.tickets)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tickets.id, id), (0, drizzle_orm_1.eq)(schema.tickets.referenceId, id)))
                .limit(1);
            if (!ticket) {
                throw new common_1.NotFoundException(`Ticket with ID or Reference '${id}' not found`);
            }
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
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.ticketComments.userId, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.ticketComments.ticketId, ticket.id))
                .orderBy((0, drizzle_orm_1.desc)(schema.ticketComments.createdAt));
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
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.ticketHistory.changedById, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.ticketHistory.ticketId, ticket.id))
                .orderBy((0, drizzle_orm_1.desc)(schema.ticketHistory.changedAt));
            const now = new Date();
            return {
                ...ticket,
                slaBreached: ticket.status !== enums_1.TicketStatus.RESOLVED &&
                    ticket.status !== enums_1.TicketStatus.CLOSED &&
                    ticket.dueDate !== null &&
                    new Date(ticket.dueDate) < now,
                comments,
                history,
            };
        }
        const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID or Reference '${id}' not found`);
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
    async update(id, updateTicketDto, user) {
        if (this.dbService.getConnectionStatus()) {
            const [existing] = await this.dbService.db
                .select()
                .from(schema.tickets)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tickets.id, id), (0, drizzle_orm_1.eq)(schema.tickets.referenceId, id)))
                .limit(1);
            if (!existing) {
                throw new common_1.NotFoundException(`Ticket with ID '${id}' not found`);
            }
            const updateData = {
                updatedAt: new Date(),
            };
            if (updateTicketDto.title)
                updateData.title = updateTicketDto.title.trim();
            if (updateTicketDto.description)
                updateData.description = updateTicketDto.description.trim();
            if (updateTicketDto.priority)
                updateData.priority = updateTicketDto.priority;
            if (updateTicketDto.category)
                updateData.category = updateTicketDto.category;
            if (updateTicketDto.subcategory)
                updateData.subcategory = updateTicketDto.subcategory;
            if (updateTicketDto.departmentId)
                updateData.departmentId = updateTicketDto.departmentId;
            if (updateTicketDto.assignedTechnicianId) {
                updateData.assignedTechnicianId = updateTicketDto.assignedTechnicianId;
                if (existing.status === enums_1.TicketStatus.NEW) {
                    updateData.status = enums_1.TicketStatus.ASSIGNED;
                }
            }
            if (updateTicketDto.status)
                updateData.status = updateTicketDto.status;
            if (updateTicketDto.resolutionNotes)
                updateData.resolutionNotes = updateTicketDto.resolutionNotes;
            await this.dbService.db
                .update(schema.tickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, existing.id));
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
            throw new common_1.NotFoundException(`Ticket with ID '${id}' not found`);
        }
        Object.assign(ticket, {
            ...updateTicketDto,
            updatedAt: new Date(),
        });
        return ticket;
    }
    async resolve(id, dto, user) {
        if (this.dbService.getConnectionStatus()) {
            const [existing] = await this.dbService.db
                .select()
                .from(schema.tickets)
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tickets.id, id), (0, drizzle_orm_1.eq)(schema.tickets.referenceId, id)))
                .limit(1);
            if (!existing) {
                throw new common_1.NotFoundException(`Ticket '${id}' not found`);
            }
            await this.dbService.db
                .update(schema.tickets)
                .set({
                status: enums_1.TicketStatus.RESOLVED,
                resolvedAt: new Date(),
                resolutionNotes: dto.resolutionNotes.trim(),
                updatedAt: new Date(),
            })
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, existing.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: existing.id,
                changedById: user.id,
                fieldChanged: 'STATUS',
                oldValue: existing.status,
                newValue: enums_1.TicketStatus.RESOLVED,
            });
            return this.findById(existing.id);
        }
        const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
        if (!ticket)
            throw new common_1.NotFoundException(`Ticket '${id}' not found`);
        ticket.status = enums_1.TicketStatus.RESOLVED;
        ticket.resolvedAt = new Date();
        ticket.resolutionNotes = dto.resolutionNotes.trim();
        ticket.updatedAt = new Date();
        return ticket;
    }
    async addComment(id, dto, user) {
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
            if (!ticket.firstResponseAt && user.id !== ticket.requesterId) {
                await this.dbService.db
                    .update(schema.tickets)
                    .set({ firstResponseAt: new Date() })
                    .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
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
        const all = await this.findAll({}, { role: enums_1.UserRole.SUPER_ADMIN });
        const now = new Date();
        const openTickets = all.filter((t) => t.status !== enums_1.TicketStatus.RESOLVED && t.status !== enums_1.TicketStatus.CLOSED);
        const breachedCount = openTickets.filter((t) => t.slaBreached).length;
        const resolvedCount = all.filter((t) => t.status === enums_1.TicketStatus.RESOLVED).length;
        return {
            totalTickets: all.length,
            openTickets: openTickets.length,
            resolvedTickets: resolvedCount,
            slaBreachedCount: breachedCount,
            slaComplianceRate: all.length > 0
                ? (((all.length - breachedCount) / all.length) * 100).toFixed(1) + '%'
                : '100%',
        };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = TicketsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map