"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogsRelations = exports.notificationsRelations = exports.performanceReviewsRelations = exports.workLogsRelations = exports.ticketHistoryRelations = exports.ticketCommentsRelations = exports.ticketsRelations = exports.taskAttachmentsRelations = exports.taskCommentsRelations = exports.taskAssignmentsRelations = exports.tasksRelations = exports.usersRelations = exports.teamsRelations = exports.departmentsRelations = exports.rolesRelations = exports.auditLogs = exports.notifications = exports.performanceReviews = exports.workLogs = exports.ticketHistory = exports.ticketComments = exports.tickets = exports.taskAttachments = exports.taskComments = exports.taskAssignments = exports.tasks = exports.users = exports.teams = exports.departments = exports.roles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.roles = (0, pg_core_1.pgTable)('roles', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    isSystem: (0, pg_core_1.boolean)('is_system').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.departments = (0, pg_core_1.pgTable)('departments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    code: (0, pg_core_1.varchar)('code', { length: 20 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    managerId: (0, pg_core_1.uuid)('manager_id'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.teams = (0, pg_core_1.pgTable)('teams', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    departmentId: (0, pg_core_1.uuid)('department_id')
        .notNull()
        .references(() => exports.departments.id, { onDelete: 'cascade' }),
    leadId: (0, pg_core_1.uuid)('lead_id'),
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)('password_hash', { length: 255 }).notNull(),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }).notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 30 }),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    roleId: (0, pg_core_1.uuid)('role_id')
        .notNull()
        .references(() => exports.roles.id),
    roleCode: (0, pg_core_1.varchar)('role_code', { length: 50 }).notNull().default('EMPLOYEE'),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, {
        onDelete: 'set null',
    }),
    teamId: (0, pg_core_1.uuid)('team_id').references(() => exports.teams.id, { onDelete: 'set null' }),
    managerId: (0, pg_core_1.uuid)('manager_id'),
    jobTitle: (0, pg_core_1.varchar)('job_title', { length: 100 }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
});
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    taskNumber: (0, pg_core_1.varchar)('task_number', { length: 50 }).notNull().unique(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, {
        onDelete: 'set null',
    }),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull().default('MEDIUM'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }).notNull().default('General'),
    referenceProject: (0, pg_core_1.varchar)('reference_project', { length: 150 }),
    startDate: (0, pg_core_1.timestamp)('start_date', { withTimezone: true }).notNull(),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }).notNull(),
    estimatedHours: (0, pg_core_1.numeric)('estimated_hours', { precision: 6, scale: 2 }).default('0'),
    actualHours: (0, pg_core_1.numeric)('actual_hours', { precision: 6, scale: 2 }).default('0'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).notNull().default('NOT_STARTED'),
    completionPercentage: (0, pg_core_1.integer)('completion_percentage').default(0).notNull(),
    createdById: (0, pg_core_1.uuid)('created_by_id')
        .notNull()
        .references(() => exports.users.id),
    reviewedById: (0, pg_core_1.uuid)('reviewed_by_id').references(() => exports.users.id),
    reviewFeedback: (0, pg_core_1.text)('review_feedback'),
    reviewedAt: (0, pg_core_1.timestamp)('reviewed_at', { withTimezone: true }),
    completedAt: (0, pg_core_1.timestamp)('completed_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
});
exports.taskAssignments = (0, pg_core_1.pgTable)('task_assignments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    taskId: (0, pg_core_1.uuid)('task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    assignedById: (0, pg_core_1.uuid)('assigned_by_id')
        .notNull()
        .references(() => exports.users.id),
    assignedAt: (0, pg_core_1.timestamp)('assigned_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.taskComments = (0, pg_core_1.pgTable)('task_comments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    taskId: (0, pg_core_1.uuid)('task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    comment: (0, pg_core_1.text)('comment').notNull(),
    isInternal: (0, pg_core_1.boolean)('is_internal').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.taskAttachments = (0, pg_core_1.pgTable)('task_attachments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    taskId: (0, pg_core_1.uuid)('task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    fileName: (0, pg_core_1.varchar)('file_name', { length: 255 }).notNull(),
    fileUrl: (0, pg_core_1.text)('file_url').notNull(),
    fileSize: (0, pg_core_1.integer)('file_size'),
    mimeType: (0, pg_core_1.varchar)('mime_type', { length: 100 }),
    uploadedById: (0, pg_core_1.uuid)('uploaded_by_id')
        .notNull()
        .references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    ticketNumber: (0, pg_core_1.varchar)('ticket_number', { length: 50 }).notNull().unique(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    requesterId: (0, pg_core_1.uuid)('requester_id')
        .notNull()
        .references(() => exports.users.id),
    assignedTechnicianId: (0, pg_core_1.uuid)('assigned_technician_id').references(() => exports.users.id),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, {
        onDelete: 'set null',
    }),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull().default('MEDIUM'),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull().default('OTHER'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).notNull().default('OPEN'),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }),
    slaHours: (0, pg_core_1.integer)('sla_hours').default(24).notNull(),
    slaBreached: (0, pg_core_1.boolean)('sla_breached').default(false).notNull(),
    resolutionNotes: (0, pg_core_1.text)('resolution_notes'),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at', { withTimezone: true }),
    closedAt: (0, pg_core_1.timestamp)('closed_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
});
exports.ticketComments = (0, pg_core_1.pgTable)('ticket_comments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    ticketId: (0, pg_core_1.uuid)('ticket_id')
        .notNull()
        .references(() => exports.tickets.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    comment: (0, pg_core_1.text)('comment').notNull(),
    isInternalNote: (0, pg_core_1.boolean)('is_internal_note').default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.ticketHistory = (0, pg_core_1.pgTable)('ticket_history', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    ticketId: (0, pg_core_1.uuid)('ticket_id')
        .notNull()
        .references(() => exports.tickets.id, { onDelete: 'cascade' }),
    changedById: (0, pg_core_1.uuid)('changed_by_id')
        .notNull()
        .references(() => exports.users.id),
    fieldChanged: (0, pg_core_1.varchar)('field_changed', { length: 50 }).notNull(),
    oldValue: (0, pg_core_1.text)('old_value'),
    newValue: (0, pg_core_1.text)('new_value'),
    changedAt: (0, pg_core_1.timestamp)('changed_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.workLogs = (0, pg_core_1.pgTable)('work_logs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    taskId: (0, pg_core_1.uuid)('task_id').references(() => exports.tasks.id, { onDelete: 'set null' }),
    logDate: (0, pg_core_1.date)('log_date').notNull(),
    startTime: (0, pg_core_1.varchar)('start_time', { length: 10 }).notNull(),
    endTime: (0, pg_core_1.varchar)('end_time', { length: 10 }).notNull(),
    totalHours: (0, pg_core_1.numeric)('total_hours', { precision: 5, scale: 2 }).notNull(),
    workDescription: (0, pg_core_1.text)('work_description').notNull(),
    challengesFaced: (0, pg_core_1.text)('challenges_faced'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('SUBMITTED').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.performanceReviews = (0, pg_core_1.pgTable)('performance_reviews', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    reviewerId: (0, pg_core_1.uuid)('reviewer_id')
        .notNull()
        .references(() => exports.users.id),
    reviewPeriod: (0, pg_core_1.varchar)('review_period', { length: 30 }).notNull(),
    periodStart: (0, pg_core_1.date)('period_start').notNull(),
    periodEnd: (0, pg_core_1.date)('period_end').notNull(),
    score: (0, pg_core_1.numeric)('score', { precision: 5, scale: 2 }).notNull(),
    complexityRating: (0, pg_core_1.numeric)('complexity_rating', { precision: 3, scale: 2 }).default('0'),
    qualityRating: (0, pg_core_1.numeric)('quality_rating', { precision: 3, scale: 2 }).default('0'),
    timelinessRating: (0, pg_core_1.numeric)('timeliness_rating', { precision: 3, scale: 2 }).default('0'),
    managerRating: (0, pg_core_1.numeric)('manager_rating', { precision: 3, scale: 2 }).default('0'),
    taskCompletionRate: (0, pg_core_1.numeric)('task_completion_rate', { precision: 5, scale: 2 }).default('0'),
    reopenedPenalty: (0, pg_core_1.numeric)('reopened_penalty', { precision: 5, scale: 2 }).default('0'),
    feedback: (0, pg_core_1.text)('feedback'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    type: (0, pg_core_1.varchar)('type', { length: 50 }).notNull(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }),
    entityId: (0, pg_core_1.uuid)('entity_id'),
    isRead: (0, pg_core_1.boolean)('is_read').default(false).notNull(),
    readAt: (0, pg_core_1.timestamp)('read_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id, { onDelete: 'set null' }),
    action: (0, pg_core_1.varchar)('action', { length: 100 }).notNull(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 100 }).notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id'),
    details: (0, pg_core_1.text)('details'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }),
    userAgent: (0, pg_core_1.text)('user_agent'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.rolesRelations = (0, drizzle_orm_1.relations)(exports.roles, ({ many }) => ({
    users: many(exports.users),
}));
exports.departmentsRelations = (0, drizzle_orm_1.relations)(exports.departments, ({ one, many }) => ({
    manager: one(exports.users, {
        fields: [exports.departments.managerId],
        references: [exports.users.id],
        relationName: 'departmentManager',
    }),
    teams: many(exports.teams),
    members: many(exports.users, { relationName: 'departmentMembers' }),
    tasks: many(exports.tasks),
    tickets: many(exports.tickets),
}));
exports.teamsRelations = (0, drizzle_orm_1.relations)(exports.teams, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.teams.departmentId],
        references: [exports.departments.id],
    }),
    lead: one(exports.users, {
        fields: [exports.teams.leadId],
        references: [exports.users.id],
        relationName: 'teamLead',
    }),
    members: many(exports.users, { relationName: 'teamMembers' }),
}));
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    role: one(exports.roles, {
        fields: [exports.users.roleId],
        references: [exports.roles.id],
    }),
    department: one(exports.departments, {
        fields: [exports.users.departmentId],
        references: [exports.departments.id],
        relationName: 'departmentMembers',
    }),
    team: one(exports.teams, {
        fields: [exports.users.teamId],
        references: [exports.teams.id],
        relationName: 'teamMembers',
    }),
    manager: one(exports.users, {
        fields: [exports.users.managerId],
        references: [exports.users.id],
        relationName: 'managerSubordinates',
    }),
    assignedTasks: many(exports.taskAssignments),
    createdTasks: many(exports.tasks, { relationName: 'taskCreator' }),
    requestedTickets: many(exports.tickets, { relationName: 'ticketRequester' }),
    assignedTickets: many(exports.tickets, { relationName: 'ticketTechnician' }),
    workLogs: many(exports.workLogs),
    receivedReviews: many(exports.performanceReviews, { relationName: 'employeeReviews' }),
    givenReviews: many(exports.performanceReviews, { relationName: 'managerReviews' }),
    notifications: many(exports.notifications),
}));
exports.tasksRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.tasks.departmentId],
        references: [exports.departments.id],
    }),
    creator: one(exports.users, {
        fields: [exports.tasks.createdById],
        references: [exports.users.id],
        relationName: 'taskCreator',
    }),
    reviewer: one(exports.users, {
        fields: [exports.tasks.reviewedById],
        references: [exports.users.id],
        relationName: 'taskReviewer',
    }),
    assignments: many(exports.taskAssignments),
    comments: many(exports.taskComments),
    attachments: many(exports.taskAttachments),
    workLogs: many(exports.workLogs),
}));
exports.taskAssignmentsRelations = (0, drizzle_orm_1.relations)(exports.taskAssignments, ({ one }) => ({
    task: one(exports.tasks, {
        fields: [exports.taskAssignments.taskId],
        references: [exports.tasks.id],
    }),
    employee: one(exports.users, {
        fields: [exports.taskAssignments.employeeId],
        references: [exports.users.id],
    }),
    assignedBy: one(exports.users, {
        fields: [exports.taskAssignments.assignedById],
        references: [exports.users.id],
    }),
}));
exports.taskCommentsRelations = (0, drizzle_orm_1.relations)(exports.taskComments, ({ one }) => ({
    task: one(exports.tasks, {
        fields: [exports.taskComments.taskId],
        references: [exports.tasks.id],
    }),
    author: one(exports.users, {
        fields: [exports.taskComments.userId],
        references: [exports.users.id],
    }),
}));
exports.taskAttachmentsRelations = (0, drizzle_orm_1.relations)(exports.taskAttachments, ({ one }) => ({
    task: one(exports.tasks, {
        fields: [exports.taskAttachments.taskId],
        references: [exports.tasks.id],
    }),
    uploader: one(exports.users, {
        fields: [exports.taskAttachments.uploadedById],
        references: [exports.users.id],
    }),
}));
exports.ticketsRelations = (0, drizzle_orm_1.relations)(exports.tickets, ({ one, many }) => ({
    requester: one(exports.users, {
        fields: [exports.tickets.requesterId],
        references: [exports.users.id],
        relationName: 'ticketRequester',
    }),
    assignedTechnician: one(exports.users, {
        fields: [exports.tickets.assignedTechnicianId],
        references: [exports.users.id],
        relationName: 'ticketTechnician',
    }),
    department: one(exports.departments, {
        fields: [exports.tickets.departmentId],
        references: [exports.departments.id],
    }),
    comments: many(exports.ticketComments),
    history: many(exports.ticketHistory),
}));
exports.ticketCommentsRelations = (0, drizzle_orm_1.relations)(exports.ticketComments, ({ one }) => ({
    ticket: one(exports.tickets, {
        fields: [exports.ticketComments.ticketId],
        references: [exports.tickets.id],
    }),
    author: one(exports.users, {
        fields: [exports.ticketComments.userId],
        references: [exports.users.id],
    }),
}));
exports.ticketHistoryRelations = (0, drizzle_orm_1.relations)(exports.ticketHistory, ({ one }) => ({
    ticket: one(exports.tickets, {
        fields: [exports.ticketHistory.ticketId],
        references: [exports.tickets.id],
    }),
    changedBy: one(exports.users, {
        fields: [exports.ticketHistory.changedById],
        references: [exports.users.id],
    }),
}));
exports.workLogsRelations = (0, drizzle_orm_1.relations)(exports.workLogs, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.workLogs.employeeId],
        references: [exports.users.id],
    }),
    task: one(exports.tasks, {
        fields: [exports.workLogs.taskId],
        references: [exports.tasks.id],
    }),
}));
exports.performanceReviewsRelations = (0, drizzle_orm_1.relations)(exports.performanceReviews, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.performanceReviews.employeeId],
        references: [exports.users.id],
        relationName: 'employeeReviews',
    }),
    reviewer: one(exports.users, {
        fields: [exports.performanceReviews.reviewerId],
        references: [exports.users.id],
        relationName: 'managerReviews',
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id],
    }),
}));
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.auditLogs.userId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=index.js.map