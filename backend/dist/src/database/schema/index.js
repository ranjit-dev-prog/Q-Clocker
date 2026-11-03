"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskTimeEntriesRelations = exports.workSessionsRelations = exports.attendanceEventsRelations = exports.workLogsRelations = exports.ticketHistoryRelations = exports.ticketCommentsRelations = exports.ticketsRelations = exports.taskAttachmentsRelations = exports.taskCommentsRelations = exports.taskAssignmentsRelations = exports.tasksRelations = exports.userSessionsRelations = exports.usersRelations = exports.teamsRelations = exports.departmentsRelations = exports.rolePermissionsRelations = exports.permissionsRelations = exports.rolesRelations = exports.auditLogs = exports.performanceReviews = exports.notifications = exports.reminders = exports.followUps = exports.approvals = exports.timesheetEntries = exports.timesheets = exports.ticketTimeEntries = exports.taskTimeEntries = exports.workSessions = exports.attendanceEvents = exports.workLogs = exports.ticketHistory = exports.ticketComments = exports.tickets = exports.slaPolicies = exports.taskDependencies = exports.taskAttachments = exports.taskComments = exports.taskAssignments = exports.tasks = exports.assets = exports.projects = exports.userSessions = exports.users = exports.designations = exports.teams = exports.departments = exports.rolePermissions = exports.permissions = exports.roles = void 0;
exports.auditLogsRelations = exports.performanceReviewsRelations = exports.notificationsRelations = exports.remindersRelations = exports.followUpsRelations = exports.approvalsRelations = exports.timesheetEntriesRelations = exports.timesheetsRelations = exports.ticketTimeEntriesRelations = void 0;
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
exports.permissions = (0, pg_core_1.pgTable)('permissions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)('code', { length: 100 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 150 }).notNull(),
    module: (0, pg_core_1.varchar)('module', { length: 50 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.rolePermissions = (0, pg_core_1.pgTable)('role_permissions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    roleId: (0, pg_core_1.uuid)('role_id')
        .notNull()
        .references(() => exports.roles.id, { onDelete: 'cascade' }),
    permissionId: (0, pg_core_1.uuid)('permission_id')
        .notNull()
        .references(() => exports.permissions.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.departments = (0, pg_core_1.pgTable)('departments', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
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
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
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
exports.designations = (0, pg_core_1.pgTable)('designations', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    description: (0, pg_core_1.text)('description'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    employeeCode: (0, pg_core_1.varchar)('employee_code', { length: 50 }).unique(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    personalEmail: (0, pg_core_1.varchar)('personal_email', { length: 255 }),
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
    designationId: (0, pg_core_1.uuid)('designation_id').references(() => exports.designations.id, { onDelete: 'set null' }),
    managerId: (0, pg_core_1.uuid)('manager_id'),
    jobTitle: (0, pg_core_1.varchar)('job_title', { length: 100 }),
    employmentType: (0, pg_core_1.varchar)('employment_type', { length: 50 }).default('FULL_TIME').notNull(),
    joiningDate: (0, pg_core_1.date)('joining_date'),
    workLocation: (0, pg_core_1.varchar)('work_location', { length: 100 }).default('Headquarters').notNull(),
    hasLoginAccount: (0, pg_core_1.boolean)('has_login_account').default(true).notNull(),
    accountStatus: (0, pg_core_1.varchar)('account_status', { length: 30 }).default('ACTIVE').notNull(),
    invitationToken: (0, pg_core_1.varchar)('invitation_token', { length: 255 }),
    invitationTokenExpiresAt: (0, pg_core_1.timestamp)('invitation_token_expires_at', { withTimezone: true }),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    lastLoginAt: (0, pg_core_1.timestamp)('last_login_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: (0, pg_core_1.timestamp)('deleted_at', { withTimezone: true }),
    archivedAt: (0, pg_core_1.timestamp)('archived_at', { withTimezone: true }),
    archivedById: (0, pg_core_1.uuid)('archived_by_id'),
});
exports.userSessions = (0, pg_core_1.pgTable)('user_sessions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    refreshTokenHash: (0, pg_core_1.varchar)('refresh_token_hash', { length: 255 }).notNull(),
    userAgent: (0, pg_core_1.text)('user_agent'),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }),
    isRevoked: (0, pg_core_1.boolean)('is_revoked').default(false).notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at', { withTimezone: true }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 150 }).notNull(),
    code: (0, pg_core_1.varchar)('code', { length: 50 }).notNull().unique(),
    description: (0, pg_core_1.text)('description'),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    leadId: (0, pg_core_1.uuid)('lead_id').references(() => exports.users.id, { onDelete: 'set null' }),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('ACTIVE').notNull(),
    startDate: (0, pg_core_1.date)('start_date'),
    endDate: (0, pg_core_1.date)('end_date'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.assets = (0, pg_core_1.pgTable)('assets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 150 }).notNull(),
    assetTag: (0, pg_core_1.varchar)('asset_tag', { length: 50 }).notNull().unique(),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('OPERATIONAL').notNull(),
    assignedToId: (0, pg_core_1.uuid)('assigned_to_id').references(() => exports.users.id, { onDelete: 'set null' }),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    details: (0, pg_core_1.text)('details'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.tasks = (0, pg_core_1.pgTable)('tasks', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    taskNumber: (0, pg_core_1.varchar)('task_number', { length: 50 }).notNull().unique(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description'),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    teamId: (0, pg_core_1.uuid)('team_id').references(() => exports.teams.id, { onDelete: 'set null' }),
    projectId: (0, pg_core_1.uuid)('project_id').references(() => exports.projects.id, { onDelete: 'set null' }),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull().default('MEDIUM'),
    category: (0, pg_core_1.varchar)('category', { length: 100 }).notNull().default('General'),
    startDate: (0, pg_core_1.timestamp)('start_date', { withTimezone: true }).notNull(),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }).notNull(),
    estimatedHours: (0, pg_core_1.numeric)('estimated_hours', { precision: 6, scale: 2 }).default('0'),
    actualHours: (0, pg_core_1.numeric)('actual_hours', { precision: 6, scale: 2 }).default('0'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).notNull().default('ASSIGNED'),
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
exports.taskDependencies = (0, pg_core_1.pgTable)('task_dependencies', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    taskId: (0, pg_core_1.uuid)('task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    dependsOnTaskId: (0, pg_core_1.uuid)('depends_on_task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    dependencyType: (0, pg_core_1.varchar)('dependency_type', { length: 30 }).default('BLOCKS').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.slaPolicies = (0, pg_core_1.pgTable)('sla_policies', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull(),
    responseTimeHours: (0, pg_core_1.integer)('response_time_hours').notNull(),
    resolutionTimeHours: (0, pg_core_1.integer)('resolution_time_hours').notNull(),
    escalationRole: (0, pg_core_1.varchar)('escalation_role', { length: 50 }).default('ADMIN').notNull(),
    isActive: (0, pg_core_1.boolean)('is_active').default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.tickets = (0, pg_core_1.pgTable)('tickets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    ticketNumber: (0, pg_core_1.varchar)('ticket_number', { length: 50 }).notNull().unique(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    requesterId: (0, pg_core_1.uuid)('requester_id')
        .notNull()
        .references(() => exports.users.id),
    assignedTechnicianId: (0, pg_core_1.uuid)('assigned_technician_id').references(() => exports.users.id),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    priority: (0, pg_core_1.varchar)('priority', { length: 20 }).notNull().default('MEDIUM'),
    category: (0, pg_core_1.varchar)('category', { length: 50 }).notNull().default('OTHER'),
    subcategory: (0, pg_core_1.varchar)('subcategory', { length: 100 }),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).notNull().default('NEW'),
    slaPolicyId: (0, pg_core_1.uuid)('sla_policy_id').references(() => exports.slaPolicies.id, { onDelete: 'set null' }),
    dueDate: (0, pg_core_1.timestamp)('due_date', { withTimezone: true }),
    slaHours: (0, pg_core_1.integer)('sla_hours').default(24).notNull(),
    slaBreached: (0, pg_core_1.boolean)('sla_breached').default(false).notNull(),
    firstResponseAt: (0, pg_core_1.timestamp)('first_response_at', { withTimezone: true }),
    resolutionNotes: (0, pg_core_1.text)('resolution_notes'),
    resolvedAt: (0, pg_core_1.timestamp)('resolved_at', { withTimezone: true }),
    closedAt: (0, pg_core_1.timestamp)('closed_at', { withTimezone: true }),
    relatedTaskId: (0, pg_core_1.uuid)('related_task_id').references(() => exports.tasks.id, { onDelete: 'set null' }),
    relatedAssetId: (0, pg_core_1.uuid)('related_asset_id').references(() => exports.assets.id, { onDelete: 'set null' }),
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
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    taskId: (0, pg_core_1.uuid)('task_id').references(() => exports.tasks.id, { onDelete: 'set null' }),
    ticketId: (0, pg_core_1.uuid)('ticket_id').references(() => exports.tickets.id, { onDelete: 'set null' }),
    logDate: (0, pg_core_1.date)('log_date').notNull(),
    startTime: (0, pg_core_1.varchar)('start_time', { length: 10 }).notNull(),
    endTime: (0, pg_core_1.varchar)('end_time', { length: 10 }).notNull(),
    totalHours: (0, pg_core_1.numeric)('total_hours', { precision: 5, scale: 2 }).notNull(),
    workDescription: (0, pg_core_1.text)('work_description').notNull(),
    investigationPerformed: (0, pg_core_1.text)('investigation_performed'),
    actionsTaken: (0, pg_core_1.text)('actions_taken'),
    challengesFaced: (0, pg_core_1.text)('challenges_faced'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('SUBMITTED').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.attendanceEvents = (0, pg_core_1.pgTable)('attendance_events', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    eventType: (0, pg_core_1.varchar)('event_type', { length: 30 }).notNull(),
    eventTimestamp: (0, pg_core_1.timestamp)('event_timestamp', { withTimezone: true }).defaultNow().notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 50 }),
    deviceInfo: (0, pg_core_1.text)('device_info'),
    notes: (0, pg_core_1.text)('notes'),
    isCorrection: (0, pg_core_1.boolean)('is_correction').default(false).notNull(),
    verifiedById: (0, pg_core_1.uuid)('verified_by_id').references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.workSessions = (0, pg_core_1.pgTable)('work_sessions', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    sessionDate: (0, pg_core_1.date)('session_date').notNull(),
    clockInTime: (0, pg_core_1.timestamp)('clock_in_time', { withTimezone: true }).notNull(),
    clockOutTime: (0, pg_core_1.timestamp)('clock_out_time', { withTimezone: true }),
    totalBreakMinutes: (0, pg_core_1.integer)('total_break_minutes').default(0).notNull(),
    netWorkMinutes: (0, pg_core_1.integer)('net_work_minutes').default(0).notNull(),
    overtimeMinutes: (0, pg_core_1.integer)('overtime_minutes').default(0).notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('ACTIVE').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.taskTimeEntries = (0, pg_core_1.pgTable)('task_time_entries', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    taskId: (0, pg_core_1.uuid)('task_id')
        .notNull()
        .references(() => exports.tasks.id, { onDelete: 'cascade' }),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }).notNull(),
    endedAt: (0, pg_core_1.timestamp)('ended_at', { withTimezone: true }),
    durationSeconds: (0, pg_core_1.integer)('duration_seconds').default(0).notNull(),
    isRunning: (0, pg_core_1.boolean)('is_running').default(true).notNull(),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.ticketTimeEntries = (0, pg_core_1.pgTable)('ticket_time_entries', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    ticketId: (0, pg_core_1.uuid)('ticket_id')
        .notNull()
        .references(() => exports.tickets.id, { onDelete: 'cascade' }),
    startedAt: (0, pg_core_1.timestamp)('started_at', { withTimezone: true }).notNull(),
    endedAt: (0, pg_core_1.timestamp)('ended_at', { withTimezone: true }),
    durationSeconds: (0, pg_core_1.integer)('duration_seconds').default(0).notNull(),
    isRunning: (0, pg_core_1.boolean)('is_running').default(true).notNull(),
    notes: (0, pg_core_1.text)('notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.timesheets = (0, pg_core_1.pgTable)('timesheets', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    employeeId: (0, pg_core_1.uuid)('employee_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    departmentId: (0, pg_core_1.uuid)('department_id').references(() => exports.departments.id, { onDelete: 'set null' }),
    managerId: (0, pg_core_1.uuid)('manager_id').references(() => exports.users.id, { onDelete: 'set null' }),
    periodType: (0, pg_core_1.varchar)('period_type', { length: 20 }).default('WEEKLY').notNull(),
    startDate: (0, pg_core_1.date)('start_date').notNull(),
    endDate: (0, pg_core_1.date)('end_date').notNull(),
    totalHours: (0, pg_core_1.numeric)('total_hours', { precision: 6, scale: 2 }).default('0').notNull(),
    billableHours: (0, pg_core_1.numeric)('billable_hours', { precision: 6, scale: 2 }).default('0').notNull(),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('DRAFT').notNull(),
    submittedAt: (0, pg_core_1.timestamp)('submitted_at', { withTimezone: true }),
    reviewedAt: (0, pg_core_1.timestamp)('reviewed_at', { withTimezone: true }),
    reviewNotes: (0, pg_core_1.text)('review_notes'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.timesheetEntries = (0, pg_core_1.pgTable)('timesheet_entries', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    timesheetId: (0, pg_core_1.uuid)('timesheet_id')
        .notNull()
        .references(() => exports.timesheets.id, { onDelete: 'cascade' }),
    entryDate: (0, pg_core_1.date)('entry_date').notNull(),
    taskId: (0, pg_core_1.uuid)('task_id').references(() => exports.tasks.id, { onDelete: 'set null' }),
    ticketId: (0, pg_core_1.uuid)('ticket_id').references(() => exports.tickets.id, { onDelete: 'set null' }),
    hours: (0, pg_core_1.numeric)('hours', { precision: 5, scale: 2 }).notNull(),
    isBillable: (0, pg_core_1.boolean)('is_billable').default(true).notNull(),
    description: (0, pg_core_1.text)('description'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.approvals = (0, pg_core_1.pgTable)('approvals', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }).notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id').notNull(),
    requestedById: (0, pg_core_1.uuid)('requested_by_id')
        .notNull()
        .references(() => exports.users.id),
    approverId: (0, pg_core_1.uuid)('approver_id')
        .notNull()
        .references(() => exports.users.id),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('PENDING').notNull(),
    comments: (0, pg_core_1.text)('comments'),
    decidedAt: (0, pg_core_1.timestamp)('decided_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.followUps = (0, pg_core_1.pgTable)('follow_ups', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    referenceId: (0, pg_core_1.varchar)('reference_id', { length: 20 }).notNull().unique(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 30 }).notNull(),
    entityId: (0, pg_core_1.uuid)('entity_id').notNull(),
    ownerId: (0, pg_core_1.uuid)('owner_id')
        .notNull()
        .references(() => exports.users.id),
    assignedToId: (0, pg_core_1.uuid)('assigned_to_id').references(() => exports.users.id),
    followUpDate: (0, pg_core_1.date)('follow_up_date').notNull(),
    followUpTime: (0, pg_core_1.varchar)('follow_up_time', { length: 10 }),
    expectedResponse: (0, pg_core_1.text)('expected_response'),
    notes: (0, pg_core_1.text)('notes'),
    status: (0, pg_core_1.varchar)('status', { length: 30 }).default('PENDING').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
exports.reminders = (0, pg_core_1.pgTable)('reminders', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => exports.users.id, { onDelete: 'cascade' }),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    remindAt: (0, pg_core_1.timestamp)('remind_at', { withTimezone: true }).notNull(),
    entityType: (0, pg_core_1.varchar)('entity_type', { length: 50 }),
    entityId: (0, pg_core_1.uuid)('entity_id'),
    channel: (0, pg_core_1.varchar)('channel', { length: 30 }).default('IN_APP').notNull(),
    isSent: (0, pg_core_1.boolean)('is_sent').default(false).notNull(),
    sentAt: (0, pg_core_1.timestamp)('sent_at', { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
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
    permissions: many(exports.rolePermissions),
}));
exports.permissionsRelations = (0, drizzle_orm_1.relations)(exports.permissions, ({ many }) => ({
    roles: many(exports.rolePermissions),
}));
exports.rolePermissionsRelations = (0, drizzle_orm_1.relations)(exports.rolePermissions, ({ one }) => ({
    role: one(exports.roles, {
        fields: [exports.rolePermissions.roleId],
        references: [exports.roles.id],
    }),
    permission: one(exports.permissions, {
        fields: [exports.rolePermissions.permissionId],
        references: [exports.permissions.id],
    }),
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
    sessions: many(exports.userSessions),
    assignedTasks: many(exports.taskAssignments),
    createdTasks: many(exports.tasks, { relationName: 'taskCreator' }),
    requestedTickets: many(exports.tickets, { relationName: 'ticketRequester' }),
    assignedTickets: many(exports.tickets, { relationName: 'ticketTechnician' }),
    workLogs: many(exports.workLogs),
    attendanceEvents: many(exports.attendanceEvents),
    workSessions: many(exports.workSessions),
    taskTimeEntries: many(exports.taskTimeEntries),
    ticketTimeEntries: many(exports.ticketTimeEntries),
    timesheets: many(exports.timesheets),
    receivedReviews: many(exports.performanceReviews, { relationName: 'employeeReviews' }),
    givenReviews: many(exports.performanceReviews, { relationName: 'managerReviews' }),
    notifications: many(exports.notifications),
}));
exports.userSessionsRelations = (0, drizzle_orm_1.relations)(exports.userSessions, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userSessions.userId],
        references: [exports.users.id],
    }),
}));
exports.tasksRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one, many }) => ({
    department: one(exports.departments, {
        fields: [exports.tasks.departmentId],
        references: [exports.departments.id],
    }),
    team: one(exports.teams, {
        fields: [exports.tasks.teamId],
        references: [exports.teams.id],
    }),
    project: one(exports.projects, {
        fields: [exports.tasks.projectId],
        references: [exports.projects.id],
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
    dependencies: many(exports.taskDependencies, { relationName: 'primaryTask' }),
    timeEntries: many(exports.taskTimeEntries),
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
    slaPolicy: one(exports.slaPolicies, {
        fields: [exports.tickets.slaPolicyId],
        references: [exports.slaPolicies.id],
    }),
    comments: many(exports.ticketComments),
    history: many(exports.ticketHistory),
    timeEntries: many(exports.ticketTimeEntries),
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
    ticket: one(exports.tickets, {
        fields: [exports.workLogs.ticketId],
        references: [exports.tickets.id],
    }),
}));
exports.attendanceEventsRelations = (0, drizzle_orm_1.relations)(exports.attendanceEvents, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.attendanceEvents.employeeId],
        references: [exports.users.id],
    }),
    verifier: one(exports.users, {
        fields: [exports.attendanceEvents.verifiedById],
        references: [exports.users.id],
    }),
}));
exports.workSessionsRelations = (0, drizzle_orm_1.relations)(exports.workSessions, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.workSessions.employeeId],
        references: [exports.users.id],
    }),
}));
exports.taskTimeEntriesRelations = (0, drizzle_orm_1.relations)(exports.taskTimeEntries, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.taskTimeEntries.employeeId],
        references: [exports.users.id],
    }),
    task: one(exports.tasks, {
        fields: [exports.taskTimeEntries.taskId],
        references: [exports.tasks.id],
    }),
}));
exports.ticketTimeEntriesRelations = (0, drizzle_orm_1.relations)(exports.ticketTimeEntries, ({ one }) => ({
    employee: one(exports.users, {
        fields: [exports.ticketTimeEntries.employeeId],
        references: [exports.users.id],
    }),
    ticket: one(exports.tickets, {
        fields: [exports.ticketTimeEntries.ticketId],
        references: [exports.tickets.id],
    }),
}));
exports.timesheetsRelations = (0, drizzle_orm_1.relations)(exports.timesheets, ({ one, many }) => ({
    employee: one(exports.users, {
        fields: [exports.timesheets.employeeId],
        references: [exports.users.id],
    }),
    department: one(exports.departments, {
        fields: [exports.timesheets.departmentId],
        references: [exports.departments.id],
    }),
    manager: one(exports.users, {
        fields: [exports.timesheets.managerId],
        references: [exports.users.id],
    }),
    entries: many(exports.timesheetEntries),
}));
exports.timesheetEntriesRelations = (0, drizzle_orm_1.relations)(exports.timesheetEntries, ({ one }) => ({
    timesheet: one(exports.timesheets, {
        fields: [exports.timesheetEntries.timesheetId],
        references: [exports.timesheets.id],
    }),
    task: one(exports.tasks, {
        fields: [exports.timesheetEntries.taskId],
        references: [exports.tasks.id],
    }),
    ticket: one(exports.tickets, {
        fields: [exports.timesheetEntries.ticketId],
        references: [exports.tickets.id],
    }),
}));
exports.approvalsRelations = (0, drizzle_orm_1.relations)(exports.approvals, ({ one }) => ({
    requester: one(exports.users, {
        fields: [exports.approvals.requestedById],
        references: [exports.users.id],
    }),
    approver: one(exports.users, {
        fields: [exports.approvals.approverId],
        references: [exports.users.id],
    }),
}));
exports.followUpsRelations = (0, drizzle_orm_1.relations)(exports.followUps, ({ one }) => ({
    owner: one(exports.users, {
        fields: [exports.followUps.ownerId],
        references: [exports.users.id],
    }),
    assignee: one(exports.users, {
        fields: [exports.followUps.assignedToId],
        references: [exports.users.id],
    }),
}));
exports.remindersRelations = (0, drizzle_orm_1.relations)(exports.reminders, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.reminders.userId],
        references: [exports.users.id],
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_1.relations)(exports.notifications, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.notifications.userId],
        references: [exports.users.id],
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
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.auditLogs.userId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=index.js.map