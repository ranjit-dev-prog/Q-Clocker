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
var TicketsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../../database/database.service");
const schema = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const ticket_state_machine_service_1 = require("./services/ticket-state-machine.service");
const ticket_sla_service_1 = require("./services/ticket-sla.service");
const notifications_service_1 = require("../notifications/notifications.service");
const reference_id_util_1 = require("../../common/utils/reference-id.util");
const enums_1 = require("../../common/enums");
const crypto = require("crypto");
let TicketsService = TicketsService_1 = class TicketsService {
    dbService;
    stateMachine;
    slaService;
    notificationsService;
    logger = new common_1.Logger(TicketsService_1.name);
    defaultCategories = [
        {
            code: 'IT_SUPPORT',
            name: 'IT Support & Workplace Services',
            description: 'Desktop, peripherals, workstation and employee productivity support',
            subcategories: [
                { code: 'LAPTOP_DESKTOP', name: 'Laptop / Desktop Hardware', defaultSlaHours: 8 },
                { code: 'MONITOR_PRINTER', name: 'Monitor & Peripherals', defaultSlaHours: 12 },
                { code: 'SOFTWARE_INSTALL', name: 'Software Installation & Licensing', defaultSlaHours: 4 },
                { code: 'M365_EMAIL', name: 'Microsoft 365 & Corporate Email', defaultSlaHours: 4 },
                { code: 'MOBILE_DEVICE', name: 'Corporate Mobile & MDM', defaultSlaHours: 8 },
            ],
        },
        {
            code: 'INFRASTRUCTURE',
            name: 'Cloud & Infrastructure Operations',
            description: 'Servers, Kubernetes clusters, storage, databases and VPC networking',
            subcategories: [
                { code: 'CLOUD_VM', name: 'Compute Instance & Virtual Machine', defaultSlaHours: 4 },
                { code: 'DB_REPLICATION', name: 'Database Latency & Replication', defaultSlaHours: 4 },
                { code: 'STORAGE_BUCKET', name: 'Cloud Storage & Object Store', defaultSlaHours: 8 },
                { code: 'K8S_CLUSTER', name: 'Kubernetes Container Orchestration', defaultSlaHours: 4 },
            ],
        },
        {
            code: 'CYBERSECURITY',
            name: 'Cybersecurity & Compliance',
            description: 'Security incident response, IAM privileges, certificates and vulnerability triage',
            subcategories: [
                { code: 'ACCESS_REVOKE', name: 'Emergency Access Revocation', defaultSlaHours: 1 },
                { code: 'CERT_RENEWAL', name: 'SSL / TLS Certificate Renewal', defaultSlaHours: 4 },
                { code: 'PHISHING_INCIDENT', name: 'Phishing & Malicious Email Report', defaultSlaHours: 2 },
                { code: 'VULN_PATCH', name: 'Vulnerability Remediation', defaultSlaHours: 24 },
            ],
        },
        {
            code: 'NETWORK',
            name: 'Enterprise Networking & Connectivity',
            description: 'VPN gateways, office Wi-Fi, SD-WAN and firewall route rules',
            subcategories: [
                { code: 'VPN_GATEWAY', name: 'Corporate OpenVPN / WireGuard Access', defaultSlaHours: 2 },
                { code: 'OFFICE_WIFI', name: 'HQ / Branch Office Wi-Fi', defaultSlaHours: 4 },
                { code: 'FIREWALL_RULE', name: 'Firewall Port & Routing Rule', defaultSlaHours: 8 },
            ],
        },
        {
            code: 'HR_SUPPORT',
            name: 'People Operations & HR Services',
            description: 'Employee lifecycle, onboarding equipment, timesheet inquiries and benefits',
            subcategories: [
                { code: 'ONBOARDING_PROVISION', name: 'New Hire Asset Provisioning', defaultSlaHours: 24 },
                { code: 'OFFBOARDING_ASSET', name: 'Employee Offboarding Collection', defaultSlaHours: 8 },
                { code: 'PAYROLL_QUERY', name: 'Payroll & Compensation Inquiries', defaultSlaHours: 48 },
            ],
        },
        {
            code: 'FACILITY_ADMIN',
            name: 'Facility & Workplace Administration',
            description: 'Office access, ID badges, workstation seating, maintenance and event logistics',
            subcategories: [
                { code: 'ACCESS_BADGE', name: 'Keycard / RFID Access Badge Issue', defaultSlaHours: 8 },
                { code: 'DESK_ERGONOMICS', name: 'Workstation Chair / Standing Desk Repair', defaultSlaHours: 24 },
                { code: 'OFFICE_MAINTENANCE', name: 'HVAC / Electrical / Facility Repair', defaultSlaHours: 12 },
                { code: 'VISITOR_PASS', name: 'Client & Visitor Security Clearance', defaultSlaHours: 4 },
            ],
        },
    ];
    demoTickets = [
        {
            id: '40000000-0000-0000-0000-000000000001',
            referenceId: 'TKT-7K9X2M',
            ticketNumber: 'TKT-7K9X2M',
            title: 'VPN Certificate Renewal for Development Cluster',
            description: 'The OpenVPN client certificates expire in 48 hours for the core engineering VPC.',
            requesterId: '00000000-0000-0000-0000-000000000004',
            requesterName: 'David Ross',
            requesterEmail: 'david.ross@qclocker.io',
            assignedTechnicianId: '00000000-0000-0000-0000-000000000002',
            technicianName: 'Marcus Chen',
            assignedTeamId: '20000000-0000-0000-0000-000000000002',
            teamName: 'Helpdesk & Security Operations',
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            ticketType: enums_1.TicketType.INCIDENT,
            impact: enums_1.TicketImpact.HIGH,
            urgency: enums_1.TicketUrgency.HIGH,
            priority: enums_1.Priority.HIGH,
            priorityCode: enums_1.TicketPriorityCode.P2,
            category: 'Network',
            subcategory: 'VPN_GATEWAY',
            status: enums_1.TicketStatus.IN_PROGRESS,
            source: enums_1.TicketSource.PORTAL,
            firstResponseDueAt: new Date(Date.now() - 4 * 3600 * 1000),
            resolutionDueAt: new Date(Date.now() + 4 * 3600 * 1000),
            dueDate: new Date(Date.now() + 4 * 3600 * 1000),
            slaHours: 8,
            slaStatus: enums_1.SlaStatus.WITHIN_SLA,
            slaBreached: false,
            slaPauseDurationSeconds: 0,
            firstResponseAt: new Date(Date.now() - 2 * 3600 * 1000),
            reopenCount: 0,
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
            requesterEmail: 'sarah.jenkins@qclocker.io',
            assignedTechnicianId: '00000000-0000-0000-0000-000000000002',
            technicianName: 'Marcus Chen',
            assignedTeamId: '20000000-0000-0000-0000-000000000002',
            teamName: 'Helpdesk & Security Operations',
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            ticketType: enums_1.TicketType.ACCESS_REQUEST,
            impact: enums_1.TicketImpact.MEDIUM,
            urgency: enums_1.TicketUrgency.MEDIUM,
            priority: enums_1.Priority.MEDIUM,
            priorityCode: enums_1.TicketPriorityCode.P3,
            category: 'Cybersecurity',
            subcategory: 'ACCESS_REVOKE',
            status: enums_1.TicketStatus.RESOLVED,
            source: enums_1.TicketSource.PORTAL,
            firstResponseDueAt: new Date(Date.now() - 8 * 3600 * 1000),
            resolutionDueAt: new Date(Date.now() + 16 * 3600 * 1000),
            dueDate: new Date(Date.now() + 16 * 3600 * 1000),
            slaHours: 24,
            slaStatus: enums_1.SlaStatus.COMPLETED,
            slaBreached: false,
            slaPauseDurationSeconds: 0,
            firstResponseAt: new Date(Date.now() - 4 * 3600 * 1000),
            resolutionSummary: 'Granted read-write role to test suite in staging IAM.',
            resolutionNotes: 'Role membership added in Active Directory security group.',
            rootCause: 'Standard onboarding grant was pending team-lead signoff.',
            resolutionCategory: 'Config Change',
            resolvedAt: new Date(Date.now() - 1 * 3600 * 1000),
            reopenCount: 0,
            createdAt: new Date(Date.now() - 5 * 3600 * 1000),
            updatedAt: new Date(Date.now() - 1 * 3600 * 1000),
        },
        {
            id: '40000000-0000-0000-0000-000000000003',
            referenceId: 'TKT-5R9W2A',
            ticketNumber: 'TKT-5R9W2A',
            title: 'Primary Database Replica Latency Spike in Production VPC',
            description: 'Replication delay spiked past 180 seconds during the nightly analytical batch.',
            requesterId: '00000000-0000-0000-0000-000000000002',
            requesterName: 'Marcus Chen',
            requesterEmail: 'marcus.chen@qclocker.io',
            assignedTechnicianId: '00000000-0000-0000-0000-000000000001',
            technicianName: 'Alexander Vance',
            assignedTeamId: '20000000-0000-0000-0000-000000000001',
            teamName: 'Backend Core Squad',
            departmentId: '10000000-0000-0000-0000-000000000001',
            departmentName: 'Information Technology',
            ticketType: enums_1.TicketType.INCIDENT,
            impact: enums_1.TicketImpact.CRITICAL,
            urgency: enums_1.TicketUrgency.CRITICAL,
            priority: enums_1.Priority.CRITICAL,
            priorityCode: enums_1.TicketPriorityCode.P1,
            category: 'Infrastructure',
            subcategory: 'DB_REPLICATION',
            status: enums_1.TicketStatus.NEW,
            source: enums_1.TicketSource.SYSTEM,
            firstResponseDueAt: new Date(Date.now() + 30 * 60 * 1000),
            resolutionDueAt: new Date(Date.now() + 3.5 * 3600 * 1000),
            dueDate: new Date(Date.now() + 3.5 * 3600 * 1000),
            slaHours: 4,
            slaStatus: enums_1.SlaStatus.WITHIN_SLA,
            slaBreached: false,
            slaPauseDurationSeconds: 0,
            firstResponseAt: null,
            reopenCount: 0,
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
            userRole: 'ADMIN',
            comment: 'Certificate bundle generated. Validating CRL distribution point.',
            isInternalNote: false,
            createdAt: new Date(Date.now() - 2 * 3600 * 1000),
        },
        {
            id: '50000000-0000-0000-0000-000000000002',
            ticketId: '40000000-0000-0000-0000-000000000001',
            userId: '00000000-0000-0000-0000-000000000002',
            userName: 'Marcus Chen',
            userRole: 'ADMIN',
            comment: 'Internal Note: DNS provider rate limit reached. Using alternate LetEncrypt challenge.',
            isInternalNote: true,
            createdAt: new Date(Date.now() - 1.5 * 3600 * 1000),
        },
    ];
    demoHistory = [
        {
            id: '60000000-0000-0000-0000-000000000001',
            ticketId: '40000000-0000-0000-0000-000000000001',
            fieldChanged: 'STATUS',
            oldValue: 'NEW',
            newValue: 'IN_PROGRESS',
            changedAt: new Date(Date.now() - 2 * 3600 * 1000),
            changedByName: 'Marcus Chen',
        },
    ];
    demoTimeEntries = [
        {
            id: '70000000-0000-0000-0000-000000000001',
            ticketId: '40000000-0000-0000-0000-000000000001',
            employeeId: '00000000-0000-0000-0000-000000000002',
            employeeName: 'Marcus Chen',
            startedAt: new Date(Date.now() - 2 * 3600 * 1000),
            endedAt: new Date(Date.now() - 1.5 * 3600 * 1000),
            durationSeconds: 1800,
            durationMinutes: 30,
            isRunning: false,
            notes: 'Generated CSR and verified DNS-01 challenge propagation.',
            createdAt: new Date(Date.now() - 1.5 * 3600 * 1000),
        },
    ];
    demoTaskLinks = [];
    constructor(dbService, stateMachine, slaService, notificationsService) {
        this.dbService = dbService;
        this.stateMachine = stateMachine;
        this.slaService = slaService;
        this.notificationsService = notificationsService;
    }
    getCategories() {
        return this.defaultCategories;
    }
    async create(createTicketDto, user) {
        const referenceId = (0, reference_id_util_1.generateReferenceId)('TKT');
        const ticketNumber = referenceId;
        const { priority, priorityCode } = this.slaService.calculatePriority(createTicketDto.impact, createTicketDto.urgency);
        const sla = this.slaService.computeInitialSla(createTicketDto.impact, createTicketDto.urgency, new Date());
        const initialStatus = createTicketDto.assignedTechnicianId
            ? enums_1.TicketStatus.ASSIGNED
            : enums_1.TicketStatus.NEW;
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
                assignedTeamId: createTicketDto.assignedTeamId || null,
                departmentId: createTicketDto.departmentId || user.departmentId || null,
                ticketType: createTicketDto.ticketType || enums_1.TicketType.INCIDENT,
                impact: createTicketDto.impact || enums_1.TicketImpact.MEDIUM,
                urgency: createTicketDto.urgency || enums_1.TicketUrgency.MEDIUM,
                priority: createTicketDto.priority || priority,
                priorityCode: priorityCode,
                category: createTicketDto.category || 'IT Support',
                subcategory: createTicketDto.subcategory || null,
                status: initialStatus,
                source: createTicketDto.source || enums_1.TicketSource.PORTAL,
                slaPolicyId: createTicketDto.slaPolicyId || null,
                firstResponseDueAt: sla.firstResponseDueAt,
                resolutionDueAt: sla.resolutionDueAt,
                dueDate: sla.resolutionDueAt,
                slaHours: sla.resolutionHours,
                slaStatus: enums_1.SlaStatus.WITHIN_SLA,
                slaBreached: false,
                relatedTaskId: createTicketDto.relatedTaskId || null,
                relatedAssetId: createTicketDto.relatedAssetId || null,
            })
                .returning();
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: newTicket.id,
                changedById: user.id,
                fieldChanged: 'CREATION',
                oldValue: null,
                newValue: `Created ticket ${newTicket.referenceId} with Priority ${priorityCode}`,
            });
            if (createTicketDto.assignedTechnicianId && this.notificationsService) {
                this.notificationsService.createNotification({
                    userId: createTicketDto.assignedTechnicianId,
                    title: 'Ticket Assigned',
                    message: `You were assigned to ticket ${newTicket.referenceId}: "${newTicket.title}"`,
                    type: 'TICKET_ASSIGNED',
                    link: '/tickets',
                });
            }
            return this.findById(newTicket.id, user);
        }
        const memoryTicket = {
            id: crypto.randomUUID(),
            referenceId,
            ticketNumber,
            title: createTicketDto.title.trim(),
            description: createTicketDto.description.trim(),
            requesterId: user.id,
            requesterName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Employee User',
            requesterEmail: user.email || 'user@qclocker.io',
            assignedTechnicianId: createTicketDto.assignedTechnicianId || null,
            technicianName: createTicketDto.assignedTechnicianId ? 'Assigned Staff' : 'Unassigned',
            assignedTeamId: createTicketDto.assignedTeamId || null,
            teamName: null,
            departmentId: createTicketDto.departmentId || user.departmentId || null,
            departmentName: 'Information Technology',
            ticketType: createTicketDto.ticketType || enums_1.TicketType.INCIDENT,
            impact: createTicketDto.impact || enums_1.TicketImpact.MEDIUM,
            urgency: createTicketDto.urgency || enums_1.TicketUrgency.MEDIUM,
            priority: createTicketDto.priority || priority,
            priorityCode: priorityCode,
            category: createTicketDto.category || 'IT Support',
            subcategory: createTicketDto.subcategory || null,
            status: initialStatus,
            source: createTicketDto.source || enums_1.TicketSource.PORTAL,
            firstResponseDueAt: sla.firstResponseDueAt,
            resolutionDueAt: sla.resolutionDueAt,
            dueDate: sla.resolutionDueAt,
            slaHours: sla.resolutionHours,
            slaStatus: enums_1.SlaStatus.WITHIN_SLA,
            slaBreached: false,
            slaPauseDurationSeconds: 0,
            firstResponseAt: null,
            resolutionSummary: null,
            resolutionNotes: null,
            rootCause: null,
            resolutionCategory: null,
            resolvedAt: null,
            reopenCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.demoTickets.unshift(memoryTicket);
        this.demoHistory.unshift({
            id: crypto.randomUUID(),
            ticketId: memoryTicket.id,
            fieldChanged: 'CREATION',
            oldValue: null,
            newValue: `Created ticket ${memoryTicket.referenceId} with Priority ${priorityCode}`,
            changedAt: new Date(),
            changedByName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        });
        if (createTicketDto.assignedTechnicianId && this.notificationsService) {
            this.notificationsService.createNotification({
                userId: createTicketDto.assignedTechnicianId,
                title: 'Ticket Assigned',
                message: `You were assigned to ticket ${memoryTicket.referenceId}: "${memoryTicket.title}"`,
                type: 'TICKET_ASSIGNED',
                link: '/tickets',
            });
        }
        return memoryTicket;
    }
    async findAll(query, user) {
        const isEmployeeOnly = user?.role === enums_1.UserRole.EMPLOYEE;
        if (this.dbService.getConnectionStatus()) {
            const conditions = [];
            if (isEmployeeOnly) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.requesterId, user.id));
            }
            if (query.status) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.status, query.status));
            }
            if (query.priority) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.priority, query.priority));
            }
            if (query.priorityCode) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.priorityCode, query.priorityCode));
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
            if (query.assignedTeamId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.assignedTeamId, query.assignedTeamId));
            }
            if (query.requesterId) {
                conditions.push((0, drizzle_orm_1.eq)(schema.tickets.requesterId, query.requesterId));
            }
            if (query.search) {
                const pattern = `%${query.search.trim()}%`;
                conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema.tickets.title, pattern), (0, drizzle_orm_1.ilike)(schema.tickets.description, pattern), (0, drizzle_orm_1.ilike)(schema.tickets.referenceId, pattern), (0, drizzle_orm_1.ilike)(schema.tickets.ticketNumber, pattern)));
            }
            const rows = await this.dbService.db
                .select({
                id: schema.tickets.id,
                referenceId: schema.tickets.referenceId,
                ticketNumber: schema.tickets.ticketNumber,
                title: schema.tickets.title,
                description: schema.tickets.description,
                requesterId: schema.tickets.requesterId,
                requesterFirstName: schema.users.firstName,
                requesterLastName: schema.users.lastName,
                requesterEmail: schema.users.email,
                assignedTechnicianId: schema.tickets.assignedTechnicianId,
                departmentId: schema.tickets.departmentId,
                departmentName: schema.departments.name,
                ticketType: schema.tickets.ticketType,
                impact: schema.tickets.impact,
                urgency: schema.tickets.urgency,
                priority: schema.tickets.priority,
                priorityCode: schema.tickets.priorityCode,
                category: schema.tickets.category,
                subcategory: schema.tickets.subcategory,
                status: schema.tickets.status,
                source: schema.tickets.source,
                dueDate: schema.tickets.dueDate,
                firstResponseDueAt: schema.tickets.firstResponseDueAt,
                resolutionDueAt: schema.tickets.resolutionDueAt,
                slaHours: schema.tickets.slaHours,
                slaStatus: schema.tickets.slaStatus,
                slaBreached: schema.tickets.slaBreached,
                firstResponseAt: schema.tickets.firstResponseAt,
                resolvedAt: schema.tickets.resolvedAt,
                closedAt: schema.tickets.closedAt,
                reopenCount: schema.tickets.reopenCount,
                createdAt: schema.tickets.createdAt,
                updatedAt: schema.tickets.updatedAt,
            })
                .from(schema.tickets)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.tickets.requesterId, schema.users.id))
                .leftJoin(schema.departments, (0, drizzle_orm_1.eq)(schema.tickets.departmentId, schema.departments.id))
                .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
                .orderBy((0, drizzle_orm_1.desc)(schema.tickets.createdAt));
            return rows.map((r) => {
                const liveSla = this.slaService.evaluateLiveSla(r);
                return {
                    ...r,
                    requesterName: `${r.requesterFirstName || ''} ${r.requesterLastName || ''}`.trim() || 'Employee',
                    slaStatus: liveSla.slaStatus,
                    slaBreached: liveSla.slaBreached,
                    remainingSeconds: liveSla.remainingSeconds,
                    slaPercentageConsumed: liveSla.percentageConsumed,
                };
            });
        }
        return this.demoTickets
            .filter((t) => {
            if (isEmployeeOnly && t.requesterId !== user.id)
                return false;
            if (query.status && t.status !== query.status)
                return false;
            if (query.priority && t.priority !== query.priority)
                return false;
            if (query.priorityCode && t.priorityCode !== query.priorityCode)
                return false;
            if (query.category && t.category !== query.category)
                return false;
            if (query.departmentId && t.departmentId !== query.departmentId)
                return false;
            if (query.assignedTechnicianId && t.assignedTechnicianId !== query.assignedTechnicianId)
                return false;
            if (query.assignedTeamId && t.assignedTeamId !== query.assignedTeamId)
                return false;
            if (query.requesterId && t.requesterId !== query.requesterId)
                return false;
            if (query.search) {
                const s = query.search.toLowerCase();
                return (t.title.toLowerCase().includes(s) ||
                    t.description.toLowerCase().includes(s) ||
                    t.referenceId.toLowerCase().includes(s));
            }
            return true;
        })
            .map((t) => {
            const liveSla = this.slaService.evaluateLiveSla(t);
            return {
                ...t,
                slaStatus: liveSla.slaStatus,
                slaBreached: liveSla.slaBreached,
                remainingSeconds: liveSla.remainingSeconds,
                slaPercentageConsumed: liveSla.percentageConsumed,
            };
        });
    }
    async findById(id, user) {
        const isEmployee = user?.role === enums_1.UserRole.EMPLOYEE;
        if (this.dbService.getConnectionStatus()) {
            const [ticket] = await this.dbService.db
                .select({
                id: schema.tickets.id,
                referenceId: schema.tickets.referenceId,
                ticketNumber: schema.tickets.ticketNumber,
                title: schema.tickets.title,
                description: schema.tickets.description,
                requesterId: schema.tickets.requesterId,
                requesterFirstName: schema.users.firstName,
                requesterLastName: schema.users.lastName,
                requesterEmail: schema.users.email,
                assignedTechnicianId: schema.tickets.assignedTechnicianId,
                assignedTeamId: schema.tickets.assignedTeamId,
                departmentId: schema.tickets.departmentId,
                departmentName: schema.departments.name,
                ticketType: schema.tickets.ticketType,
                impact: schema.tickets.impact,
                urgency: schema.tickets.urgency,
                priority: schema.tickets.priority,
                priorityCode: schema.tickets.priorityCode,
                category: schema.tickets.category,
                subcategory: schema.tickets.subcategory,
                status: schema.tickets.status,
                source: schema.tickets.source,
                dueDate: schema.tickets.dueDate,
                firstResponseDueAt: schema.tickets.firstResponseDueAt,
                resolutionDueAt: schema.tickets.resolutionDueAt,
                slaHours: schema.tickets.slaHours,
                slaStatus: schema.tickets.slaStatus,
                slaBreached: schema.tickets.slaBreached,
                slaPausedAt: schema.tickets.slaPausedAt,
                slaPauseDurationSeconds: schema.tickets.slaPauseDurationSeconds,
                firstResponseAt: schema.tickets.firstResponseAt,
                resolutionSummary: schema.tickets.resolutionSummary,
                rootCause: schema.tickets.rootCause,
                resolutionCategory: schema.tickets.resolutionCategory,
                resolutionNotes: schema.tickets.resolutionNotes,
                resolvedAt: schema.tickets.resolvedAt,
                closedAt: schema.tickets.closedAt,
                reopenedAt: schema.tickets.reopenedAt,
                reopenCount: schema.tickets.reopenCount,
                escalatedAt: schema.tickets.escalatedAt,
                escalationReason: schema.tickets.escalationReason,
                escalatedToRole: schema.tickets.escalatedToRole,
                relatedTaskId: schema.tickets.relatedTaskId,
                relatedAssetId: schema.tickets.relatedAssetId,
                createdAt: schema.tickets.createdAt,
                updatedAt: schema.tickets.updatedAt,
            })
                .from(schema.tickets)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.tickets.requesterId, schema.users.id))
                .leftJoin(schema.departments, (0, drizzle_orm_1.eq)(schema.tickets.departmentId, schema.departments.id))
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema.tickets.id, id), (0, drizzle_orm_1.eq)(schema.tickets.referenceId, id)))
                .limit(1);
            if (!ticket) {
                throw new common_1.NotFoundException(`Ticket with ID or Reference '${id}' not found`);
            }
            if (isEmployee && ticket.requesterId !== user?.id) {
                throw new common_1.ForbiddenException('You are not authorized to view this ticket');
            }
            const commentsConditions = [(0, drizzle_orm_1.eq)(schema.ticketComments.ticketId, ticket.id)];
            if (isEmployee) {
                commentsConditions.push((0, drizzle_orm_1.eq)(schema.ticketComments.isInternalNote, false));
            }
            const rawComments = await this.dbService.db
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
                .where((0, drizzle_orm_1.and)(...commentsConditions))
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
            const timeEntries = await this.dbService.db
                .select({
                id: schema.ticketTimeEntries.id,
                employeeId: schema.ticketTimeEntries.employeeId,
                startedAt: schema.ticketTimeEntries.startedAt,
                endedAt: schema.ticketTimeEntries.endedAt,
                durationSeconds: schema.ticketTimeEntries.durationSeconds,
                isRunning: schema.ticketTimeEntries.isRunning,
                notes: schema.ticketTimeEntries.notes,
                createdAt: schema.ticketTimeEntries.createdAt,
                employeeFirstName: schema.users.firstName,
                employeeLastName: schema.users.lastName,
            })
                .from(schema.ticketTimeEntries)
                .leftJoin(schema.users, (0, drizzle_orm_1.eq)(schema.ticketTimeEntries.employeeId, schema.users.id))
                .where((0, drizzle_orm_1.eq)(schema.ticketTimeEntries.ticketId, ticket.id))
                .orderBy((0, drizzle_orm_1.desc)(schema.ticketTimeEntries.createdAt));
            const liveSla = this.slaService.evaluateLiveSla(ticket);
            const totalTimeSpentSeconds = timeEntries.reduce((sum, te) => sum + (te.durationSeconds || 0), 0);
            const activeTimer = timeEntries.find((te) => te.isRunning) || null;
            return {
                ...ticket,
                requesterName: `${ticket.requesterFirstName || ''} ${ticket.requesterLastName || ''}`.trim() || 'Employee',
                isPaused: liveSla.slaStatus === enums_1.SlaStatus.PAUSED,
                slaStatus: liveSla.slaStatus,
                slaBreached: liveSla.slaBreached,
                remainingSeconds: liveSla.remainingSeconds,
                slaPercentageConsumed: liveSla.percentageConsumed,
                permittedNextStatuses: this.stateMachine.getPermittedNextStatuses(ticket.status),
                comments: rawComments.map((c) => ({
                    ...c,
                    authorName: `${c.authorFirstName || ''} ${c.authorLastName || ''}`.trim() || 'Staff',
                })),
                history: history.map((h) => ({
                    ...h,
                    changedByName: `${h.changedByFirstName || ''} ${h.changedByLastName || ''}`.trim() || 'System',
                })),
                timeEntries: timeEntries.map((te) => ({
                    ...te,
                    employeeName: `${te.employeeFirstName || ''} ${te.employeeLastName || ''}`.trim() || 'Staff',
                    durationMinutes: Math.round(te.durationSeconds / 60),
                })),
                totalTimeSpentMinutes: Math.round(totalTimeSpentSeconds / 60),
                activeTimer,
                linkedTasks: [],
            };
        }
        const ticket = this.demoTickets.find((t) => t.id === id || t.referenceId === id);
        if (!ticket) {
            throw new common_1.NotFoundException(`Ticket with ID or Reference '${id}' not found`);
        }
        if (isEmployee && ticket.requesterId !== user?.id) {
            throw new common_1.ForbiddenException('You are not authorized to view this ticket');
        }
        const comments = this.demoComments
            .filter((c) => c.ticketId === ticket.id)
            .filter((c) => (!isEmployee ? true : !c.isInternalNote));
        const history = this.demoHistory.filter((h) => h.ticketId === ticket.id);
        const timeEntries = this.demoTimeEntries.filter((te) => te.ticketId === ticket.id);
        const linkedTasks = this.demoTaskLinks.filter((tl) => tl.ticketId === ticket.id);
        const liveSla = this.slaService.evaluateLiveSla(ticket);
        const totalTimeSpentSeconds = timeEntries.reduce((sum, te) => sum + (te.durationSeconds || 0), 0);
        const activeTimer = timeEntries.find((te) => te.isRunning) || null;
        return {
            ...ticket,
            isPaused: liveSla.slaStatus === enums_1.SlaStatus.PAUSED,
            slaStatus: liveSla.slaStatus,
            slaBreached: liveSla.slaBreached,
            remainingSeconds: liveSla.remainingSeconds,
            slaPercentageConsumed: liveSla.percentageConsumed,
            permittedNextStatuses: this.stateMachine.getPermittedNextStatuses(ticket.status),
            comments,
            history,
            timeEntries,
            linkedTasks,
            totalTimeSpentMinutes: Math.round(totalTimeSpentSeconds / 60),
            activeTimer,
        };
    }
    async transitionStatus(id, dto, user) {
        const ticket = await this.findById(id, user);
        this.stateMachine.validateTransition({
            fromStatus: ticket.status,
            toStatus: dto.status,
            actorRole: user.role,
            actorId: user.id,
            reason: dto.reason,
            resolutionNotes: dto.resolutionNotes,
            resolutionSummary: dto.resolutionSummary,
            rootCause: dto.rootCause,
        });
        const now = new Date();
        const updateData = {
            status: dto.status,
            updatedAt: now,
        };
        if (dto.status === enums_1.TicketStatus.PENDING_USER ||
            dto.status === enums_1.TicketStatus.PENDING_VENDOR ||
            dto.status === enums_1.TicketStatus.ON_HOLD) {
            updateData.slaPausedAt = now;
            updateData.slaStatus = enums_1.SlaStatus.PAUSED;
        }
        else if (ticket.slaPausedAt) {
            const pauseDuration = Math.round((now.getTime() - new Date(ticket.slaPausedAt).getTime()) / 1000);
            updateData.slaPausedAt = null;
            updateData.slaPauseDurationSeconds = (ticket.slaPauseDurationSeconds || 0) + pauseDuration;
            updateData.slaStatus = enums_1.SlaStatus.WITHIN_SLA;
        }
        if (dto.status === enums_1.TicketStatus.RESOLVED) {
            updateData.resolvedAt = now;
            updateData.resolutionNotes = dto.resolutionNotes?.trim();
            updateData.resolutionSummary = dto.resolutionSummary?.trim() || dto.resolutionNotes?.trim();
            updateData.rootCause = dto.rootCause?.trim() || 'Triage completed';
            updateData.resolutionCategory = dto.resolutionCategory || 'Issue Addressed';
            updateData.slaStatus = enums_1.SlaStatus.COMPLETED;
        }
        else if (dto.status === enums_1.TicketStatus.CLOSED) {
            updateData.closedAt = now;
        }
        else if (dto.status === enums_1.TicketStatus.REOPENED) {
            updateData.reopenedAt = now;
            updateData.reopenCount = (ticket.reopenCount || 0) + 1;
            updateData.resolvedAt = null;
            updateData.resolutionNotes = null;
            updateData.slaStatus = enums_1.SlaStatus.WITHIN_SLA;
        }
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.tickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: ticket.id,
                changedById: user.id,
                fieldChanged: 'STATUS',
                oldValue: ticket.status,
                newValue: dto.status,
            });
            if (ticket.requesterId && this.notificationsService) {
                this.notificationsService.create({
                    userId: ticket.requesterId,
                    title: `Ticket Status Updated: ${ticket.referenceId || ticket.ticketNumber}`,
                    message: `Your ticket "${ticket.title}" has been updated to ${dto.status}.`,
                    type: dto.status === 'RESOLVED' ? 'SUCCESS' : 'INFO',
                    entityType: 'TICKET',
                    entityId: ticket.id,
                }).catch(() => { });
            }
            return this.findById(ticket.id, user);
        }
        const stored = this.demoTickets.find((t) => t.id === ticket.id || t.referenceId === ticket.referenceId);
        if (stored) {
            Object.assign(stored, updateData);
        }
        this.demoHistory.unshift({
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            fieldChanged: 'STATUS',
            oldValue: ticket.status,
            newValue: dto.status,
            changedAt: now,
            changedByName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
        });
        if (ticket.requesterId && this.notificationsService) {
            this.notificationsService.create({
                userId: ticket.requesterId,
                title: `Ticket Status Updated: ${ticket.referenceId || ticket.ticketNumber}`,
                message: `Your ticket "${ticket.title}" has been updated to ${dto.status}.`,
                type: dto.status === 'RESOLVED' ? 'SUCCESS' : 'INFO',
                entityType: 'TICKET',
                entityId: ticket.id,
            }).catch(() => { });
        }
        return this.findById(ticket.id, user);
    }
    async assign(id, dto, user) {
        const ticket = await this.findById(id, user);
        const now = new Date();
        const updateData = { updatedAt: now };
        if (dto.assignedTechnicianId) {
            updateData.assignedTechnicianId = dto.assignedTechnicianId;
            if (ticket.status === enums_1.TicketStatus.NEW || ticket.status === enums_1.TicketStatus.OPEN) {
                updateData.status = enums_1.TicketStatus.ASSIGNED;
            }
        }
        if (dto.assignedTeamId) {
            updateData.assignedTeamId = dto.assignedTeamId;
        }
        const logEntry = `Assigned to ${dto.assignedTechnicianId ? 'Technician' : ''} ${dto.assignedTeamId ? 'Team' : ''}${dto.reason ? ` (Reason: ${dto.reason})` : ''}`.trim();
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.tickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: ticket.id,
                changedById: user.id,
                fieldChanged: 'ASSIGNMENT',
                oldValue: ticket.assignedTechnicianId || 'Unassigned',
                newValue: logEntry,
            });
            if (dto.assignedTechnicianId && this.notificationsService) {
                this.notificationsService.create({
                    userId: dto.assignedTechnicianId,
                    title: `Ticket Assigned: ${ticket.referenceId || ticket.ticketNumber}`,
                    message: `${user?.firstName || 'System'} assigned you to ticket "${ticket.title}".`,
                    type: 'TICKET',
                    entityType: 'TICKET',
                    entityId: ticket.id,
                }).catch(() => { });
            }
            return this.findById(ticket.id, user);
        }
        const stored = this.demoTickets.find((t) => t.id === ticket.id || t.referenceId === ticket.referenceId);
        if (stored) {
            Object.assign(stored, updateData);
        }
        this.demoHistory.unshift({
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            fieldChanged: 'ASSIGNMENT',
            oldValue: ticket.assignedTechnicianId || 'Unassigned',
            newValue: logEntry,
            changedAt: now,
            changedByName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
        });
        if (dto.assignedTechnicianId && this.notificationsService) {
            this.notificationsService.create({
                userId: dto.assignedTechnicianId,
                title: `Ticket Assigned: ${ticket.referenceId || ticket.ticketNumber}`,
                message: `${user?.firstName || 'System'} assigned you to ticket "${ticket.title}".`,
                type: 'TICKET',
                entityType: 'TICKET',
                entityId: ticket.id,
            }).catch(() => { });
        }
        return this.findById(ticket.id, user);
    }
    async escalate(id, dto, user) {
        const ticket = await this.findById(id, user);
        const now = new Date();
        const targetRole = dto.targetRole || 'IT_MANAGER';
        const updateData = {
            escalatedAt: now,
            escalationReason: dto.escalationReason.trim(),
            escalatedToRole: targetRole,
            priority: enums_1.Priority.CRITICAL,
            priorityCode: enums_1.TicketPriorityCode.P1,
            updatedAt: now,
        };
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.tickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: ticket.id,
                changedById: user.id,
                fieldChanged: 'ESCALATION',
                oldValue: ticket.priorityCode || 'P3',
                newValue: `Escalated to ${targetRole}: ${dto.escalationReason.trim()}`,
            });
            if (ticket.requesterId && this.notificationsService) {
                this.notificationsService.create({
                    userId: ticket.requesterId,
                    title: `Ticket Escalated: ${ticket.referenceId || ticket.ticketNumber}`,
                    message: `Ticket "${ticket.title}" escalated to ${targetRole}: ${dto.escalationReason.trim()}`,
                    type: 'URGENT',
                    entityType: 'TICKET',
                    entityId: ticket.id,
                }).catch(() => { });
            }
            return this.findById(ticket.id, user);
        }
        const stored = this.demoTickets.find((t) => t.id === ticket.id || t.referenceId === ticket.referenceId);
        if (stored) {
            Object.assign(stored, updateData);
        }
        this.demoHistory.unshift({
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            fieldChanged: 'ESCALATION',
            oldValue: ticket.priorityCode || 'P3',
            newValue: `Escalated to ${targetRole}: ${dto.escalationReason.trim()}`,
            changedAt: now,
            changedByName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
        });
        if (ticket.requesterId && this.notificationsService) {
            this.notificationsService.create({
                userId: ticket.requesterId,
                title: `Ticket Escalated: ${ticket.referenceId || ticket.ticketNumber}`,
                message: `Ticket "${ticket.title}" escalated to ${targetRole}: ${dto.escalationReason.trim()}`,
                type: 'URGENT',
                entityType: 'TICKET',
                entityId: ticket.id,
            }).catch(() => { });
        }
        return this.findById(ticket.id, user);
    }
    async update(id, updateTicketDto, user) {
        const existing = await this.findById(id, user);
        const updateData = { updatedAt: new Date() };
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
        if (updateTicketDto.assignedTechnicianId)
            updateData.assignedTechnicianId = updateTicketDto.assignedTechnicianId;
        if (updateTicketDto.assignedTeamId)
            updateData.assignedTeamId = updateTicketDto.assignedTeamId;
        if (updateTicketDto.resolutionNotes)
            updateData.resolutionNotes = updateTicketDto.resolutionNotes.trim();
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.tickets)
                .set(updateData)
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, existing.id));
            return this.findById(existing.id, user);
        }
        Object.assign(existing, updateData);
        return existing;
    }
    async resolve(id, dto, user) {
        return this.transitionStatus(id, {
            status: enums_1.TicketStatus.RESOLVED,
            resolutionNotes: dto.resolutionNotes,
            resolutionSummary: dto.resolutionSummary || dto.resolutionNotes,
            rootCause: dto.rootCause,
            resolutionCategory: dto.resolutionCategory,
        }, user);
    }
    async reopen(id, dto, user) {
        return this.transitionStatus(id, {
            status: enums_1.TicketStatus.REOPENED,
            reason: dto.reason,
        }, user);
    }
    async addComment(id, dto, user) {
        const ticket = await this.findById(id, user);
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
            userRole: user.role || 'STAFF',
            comment: dto.comment.trim(),
            isInternalNote: dto.isInternalNote || false,
            createdAt: new Date(),
        };
        this.demoComments.unshift(comment);
        if (!ticket.firstResponseAt && user.id !== ticket.requesterId) {
            ticket.firstResponseAt = new Date();
        }
        return comment;
    }
    async startTimer(id, user, dto) {
        const ticket = await this.findById(id, user);
        const now = new Date();
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.ticketTimeEntries)
                .set({ isRunning: false, endedAt: now, updatedAt: now })
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.ticketTimeEntries.employeeId, user.id), (0, drizzle_orm_1.eq)(schema.ticketTimeEntries.isRunning, true)));
            const [entry] = await this.dbService.db
                .insert(schema.ticketTimeEntries)
                .values({
                ticketId: ticket.id,
                employeeId: user.id,
                startedAt: now,
                isRunning: true,
                notes: dto?.notes?.trim() || 'Active triage stopwatch',
            })
                .returning();
            return entry;
        }
        this.demoTimeEntries.forEach((te) => {
            if (te.employeeId === user.id && te.isRunning) {
                te.isRunning = false;
                te.endedAt = now;
                te.durationSeconds = Math.round((now.getTime() - new Date(te.startedAt).getTime()) / 1000);
            }
        });
        const newTimer = {
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            employeeId: user.id,
            employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
            startedAt: now,
            endedAt: null,
            durationSeconds: 0,
            durationMinutes: 0,
            isRunning: true,
            notes: dto?.notes?.trim() || 'Active triage stopwatch',
            createdAt: now,
        };
        this.demoTimeEntries.unshift(newTimer);
        return newTimer;
    }
    async stopTimer(id, user) {
        const ticket = await this.findById(id, user);
        const now = new Date();
        if (this.dbService.getConnectionStatus()) {
            const [running] = await this.dbService.db
                .select()
                .from(schema.ticketTimeEntries)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.ticketTimeEntries.ticketId, ticket.id), (0, drizzle_orm_1.eq)(schema.ticketTimeEntries.employeeId, user.id), (0, drizzle_orm_1.eq)(schema.ticketTimeEntries.isRunning, true)))
                .limit(1);
            if (!running) {
                throw new common_1.NotFoundException('No active running stopwatch timer found for this ticket');
            }
            const durationSeconds = Math.round((now.getTime() - new Date(running.startedAt).getTime()) / 1000);
            const [stopped] = await this.dbService.db
                .update(schema.ticketTimeEntries)
                .set({
                isRunning: false,
                endedAt: now,
                durationSeconds,
                updatedAt: now,
            })
                .where((0, drizzle_orm_1.eq)(schema.ticketTimeEntries.id, running.id))
                .returning();
            return stopped;
        }
        const timer = this.demoTimeEntries.find((te) => te.ticketId === ticket.id && te.employeeId === user.id && te.isRunning);
        if (!timer) {
            throw new common_1.NotFoundException('No active running stopwatch timer found for this ticket');
        }
        timer.isRunning = false;
        timer.endedAt = now;
        timer.durationSeconds = Math.round((now.getTime() - new Date(timer.startedAt).getTime()) / 1000);
        timer.durationMinutes = Math.round(timer.durationSeconds / 60);
        return timer;
    }
    async addManualTimeEntry(id, dto, user) {
        const ticket = await this.findById(id, user);
        const durationSeconds = dto.durationMinutes * 60;
        const now = new Date();
        if (this.dbService.getConnectionStatus()) {
            const [entry] = await this.dbService.db
                .insert(schema.ticketTimeEntries)
                .values({
                ticketId: ticket.id,
                employeeId: user.id,
                startedAt: new Date(now.getTime() - durationSeconds * 1000),
                endedAt: now,
                durationSeconds,
                isRunning: false,
                notes: dto.notes?.trim() || 'Manual time record',
            })
                .returning();
            return entry;
        }
        const manualEntry = {
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            employeeId: user.id,
            employeeName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Staff',
            startedAt: new Date(now.getTime() - durationSeconds * 1000),
            endedAt: now,
            durationSeconds,
            durationMinutes: dto.durationMinutes,
            isRunning: false,
            notes: dto.notes?.trim() || 'Manual time record',
            createdAt: now,
        };
        this.demoTimeEntries.unshift(manualEntry);
        return manualEntry;
    }
    async linkExistingTask(ticketId, dto, user) {
        const ticket = await this.findById(ticketId, user);
        if (this.dbService.getConnectionStatus()) {
            await this.dbService.db
                .update(schema.tickets)
                .set({ relatedTaskId: dto.taskId, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: ticket.id,
                changedById: user.id,
                fieldChanged: 'TASK_LINK',
                oldValue: null,
                newValue: `Linked task ${dto.taskId}`,
            });
            return { success: true, message: `Task ${dto.taskId} linked to ticket ${ticket.referenceId}` };
        }
        this.demoTaskLinks.push({
            ticketId: ticket.id,
            taskId: dto.taskId,
            linkedAt: new Date(),
        });
        return { success: true, message: `Task ${dto.taskId} linked to ticket ${ticket.referenceId}` };
    }
    async createTaskFromTicket(ticketId, dto, user) {
        const ticket = await this.findById(ticketId, user);
        const referenceId = (0, reference_id_util_1.generateReferenceId)('TSK');
        if (this.dbService.getConnectionStatus()) {
            const [newTask] = await this.dbService.db
                .insert(schema.tasks)
                .values({
                referenceId,
                taskNumber: referenceId,
                title: dto.title.trim(),
                description: dto.description?.trim() || `Generated from ticket ${ticket.referenceId}: ${ticket.description}`,
                priority: dto.priority || ticket.priority || enums_1.Priority.MEDIUM,
                startDate: new Date(dto.startDate),
                dueDate: new Date(dto.dueDate),
                estimatedHours: String(dto.estimatedHours || 4),
                createdById: user.id,
                status: 'ASSIGNED',
            })
                .returning();
            await this.dbService.db
                .update(schema.tickets)
                .set({ relatedTaskId: newTask.id, updatedAt: new Date() })
                .where((0, drizzle_orm_1.eq)(schema.tickets.id, ticket.id));
            await this.dbService.db.insert(schema.ticketHistory).values({
                ticketId: ticket.id,
                changedById: user.id,
                fieldChanged: 'TASK_CREATED',
                oldValue: null,
                newValue: `Created and linked task ${newTask.referenceId}`,
            });
            return newTask;
        }
        const newTask = {
            id: crypto.randomUUID(),
            referenceId,
            title: dto.title.trim(),
            description: dto.description?.trim() || `Generated from ticket ${ticket.referenceId}`,
            priority: dto.priority || ticket.priority || enums_1.Priority.MEDIUM,
            status: 'ASSIGNED',
            createdAt: new Date(),
        };
        this.demoTaskLinks.push({
            ticketId: ticket.id,
            taskId: newTask.id,
            taskTitle: newTask.title,
            linkedAt: new Date(),
        });
        return newTask;
    }
    async getMetrics() {
        const all = await this.findAll({}, { role: enums_1.UserRole.SUPER_ADMIN });
        const openTickets = all.filter((t) => t.status !== enums_1.TicketStatus.RESOLVED &&
            t.status !== enums_1.TicketStatus.CLOSED &&
            t.status !== enums_1.TicketStatus.CANCELLED);
        const unassignedTickets = openTickets.filter((t) => !t.assignedTechnicianId);
        const inProgressTickets = openTickets.filter((t) => t.status === enums_1.TicketStatus.IN_PROGRESS);
        const pendingTickets = openTickets.filter((t) => t.status === enums_1.TicketStatus.PENDING_USER ||
            t.status === enums_1.TicketStatus.PENDING_VENDOR ||
            t.status === enums_1.TicketStatus.ON_HOLD);
        const resolvedTickets = all.filter((t) => t.status === enums_1.TicketStatus.RESOLVED);
        const closedTickets = all.filter((t) => t.status === enums_1.TicketStatus.CLOSED);
        const criticalTickets = openTickets.filter((t) => t.priorityCode === enums_1.TicketPriorityCode.P1 || t.priority === enums_1.Priority.CRITICAL);
        const approachingBreach = openTickets.filter((t) => t.slaStatus === enums_1.SlaStatus.APPROACHING_BREACH);
        const breachedCount = openTickets.filter((t) => t.slaBreached || t.slaStatus === enums_1.SlaStatus.BREACHED);
        const priorityBreakdown = {
            P1: all.filter((t) => t.priorityCode === 'P1').length,
            P2: all.filter((t) => t.priorityCode === 'P2').length,
            P3: all.filter((t) => t.priorityCode === 'P3').length,
            P4: all.filter((t) => t.priorityCode === 'P4').length,
        };
        const categoryBreakdown = {};
        all.forEach((t) => {
            const cat = t.category || 'General';
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
        });
        const statusBreakdown = {};
        all.forEach((t) => {
            statusBreakdown[t.status] = (statusBreakdown[t.status] || 0) + 1;
        });
        return {
            totalTickets: all.length,
            openTickets: openTickets.length,
            unassignedTickets: unassignedTickets.length,
            inProgressTickets: inProgressTickets.length,
            pendingTickets: pendingTickets.length,
            resolvedTickets: resolvedTickets.length,
            closedTickets: closedTickets.length,
            criticalTickets: criticalTickets.length,
            slaApproachingBreach: approachingBreach.length,
            slaBreachedCount: breachedCount.length,
            slaComplianceRate: openTickets.length > 0
                ? (((openTickets.length - breachedCount.length) / openTickets.length) * 100).toFixed(1) + '%'
                : '100%',
            averageFirstResponseHours: '1.8h',
            averageResolutionHours: '6.4h',
            avgResolutionTimeHours: 6.4,
            priorityBreakdown,
            categoryBreakdown,
            statusBreakdown,
        };
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = TicketsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        ticket_state_machine_service_1.TicketStateMachineService,
        ticket_sla_service_1.TicketSlaService,
        notifications_service_1.NotificationsService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map