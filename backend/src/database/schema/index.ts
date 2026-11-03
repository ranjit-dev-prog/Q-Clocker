import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// =============================================================
// 1. ROLES & GRANULAR PERMISSIONS
// =============================================================

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isSystem: boolean('is_system').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  module: varchar('module', { length: 50 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id')
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;

// =============================================================
// 2. DEPARTMENTS & TEAMS (ORGANIZATIONAL HIERARCHY)
// =============================================================

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  description: text('description'),
  managerId: uuid('manager_id'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  departmentId: uuid('department_id')
    .notNull()
    .references(() => departments.id, { onDelete: 'cascade' }),
  leadId: uuid('lead_id'),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export const designations = pgTable('designations', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Designation = typeof designations.$inferSelect;
export type NewDesignation = typeof designations.$inferInsert;

// =============================================================
// 3. USERS, EMPLOYEES & SESSIONS
// =============================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  employeeCode: varchar('employee_code', { length: 50 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  personalEmail: varchar('personal_email', { length: 255 }),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  avatarUrl: text('avatar_url'),
  roleId: uuid('role_id')
    .notNull()
    .references(() => roles.id),
  roleCode: varchar('role_code', { length: 50 }).notNull().default('EMPLOYEE'),
  departmentId: uuid('department_id').references(() => departments.id, {
    onDelete: 'set null',
  }),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
  designationId: uuid('designation_id').references(() => designations.id, { onDelete: 'set null' }),
  managerId: uuid('manager_id'),
  jobTitle: varchar('job_title', { length: 100 }),
  employmentType: varchar('employment_type', { length: 50 }).default('FULL_TIME').notNull(),
  joiningDate: date('joining_date'),
  workLocation: varchar('work_location', { length: 100 }).default('Headquarters').notNull(),
  hasLoginAccount: boolean('has_login_account').default(true).notNull(),
  accountStatus: varchar('account_status', { length: 30 }).default('ACTIVE').notNull(),
  invitationToken: varchar('invitation_token', { length: 255 }),
  invitationTokenExpiresAt: timestamp('invitation_token_expires_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  archivedById: uuid('archived_by_id'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 50 }),
  isRevoked: boolean('is_revoked').default(false).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;

// =============================================================
// 4. PROJECTS & ASSETS
// =============================================================

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  leadId: uuid('lead_id').references(() => users.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 30 }).default('ACTIVE').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 150 }).notNull(),
  assetTag: varchar('asset_tag', { length: 50 }).notNull().unique(),
  category: varchar('category', { length: 50 }).notNull(),
  status: varchar('status', { length: 30 }).default('OPERATIONAL').notNull(),
  assignedToId: uuid('assigned_to_id').references(() => users.id, { onDelete: 'set null' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

// =============================================================
// 5. TASK MANAGEMENT ENGINE
// =============================================================

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  taskNumber: varchar('task_number', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 6, scale: 2 }).default('0'),
  actualHours: numeric('actual_hours', { precision: 6, scale: 2 }).default('0'),
  status: varchar('status', { length: 30 }).notNull().default('ASSIGNED'),
  completionPercentage: integer('completion_percentage').default(0).notNull(),
  createdById: uuid('created_by_id')
    .notNull()
    .references(() => users.id),
  reviewedById: uuid('reviewed_by_id').references(() => users.id),
  reviewFeedback: text('review_feedback'),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export const taskAssignments = pgTable('task_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assignedById: uuid('assigned_by_id')
    .notNull()
    .references(() => users.id),
  assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TaskAssignment = typeof taskAssignments.$inferSelect;
export type NewTaskAssignment = typeof taskAssignments.$inferInsert;

export const taskComments = pgTable('task_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  isInternal: boolean('is_internal').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TaskComment = typeof taskComments.$inferSelect;
export type NewTaskComment = typeof taskComments.$inferInsert;

export const taskAttachments = pgTable('task_attachments', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedById: uuid('uploaded_by_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TaskAttachment = typeof taskAttachments.$inferSelect;
export type NewTaskAttachment = typeof taskAttachments.$inferInsert;

export const taskDependencies = pgTable('task_dependencies', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  dependsOnTaskId: uuid('depends_on_task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  dependencyType: varchar('dependency_type', { length: 30 }).default('BLOCKS').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TaskDependency = typeof taskDependencies.$inferSelect;
export type NewTaskDependency = typeof taskDependencies.$inferInsert;

// =============================================================
// 6. ENTERPRISE ITSM TICKETING & SLA ENGINE
// =============================================================

// =============================================================
// 6. ITSM TICKETS & SLA ENGINE
// =============================================================

export const ticketCategories = pgTable('ticket_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description'),
  defaultDepartmentId: uuid('default_department_id').references(() => departments.id, { onDelete: 'set null' }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketCategory = typeof ticketCategories.$inferSelect;
export type NewTicketCategory = typeof ticketCategories.$inferInsert;

export const ticketSubcategories = pgTable('ticket_subcategories', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => ticketCategories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  description: text('description'),
  defaultSlaHours: integer('default_sla_hours').default(24).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketSubcategory = typeof ticketSubcategories.$inferSelect;
export type NewTicketSubcategory = typeof ticketSubcategories.$inferInsert;

export const slaPolicies = pgTable('sla_policies', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  priority: varchar('priority', { length: 20 }).notNull(),
  responseTimeHours: integer('response_time_hours').notNull(),
  resolutionTimeHours: integer('resolution_time_hours').notNull(),
  escalationRole: varchar('escalation_role', { length: 50 }).default('ADMIN').notNull(),
  businessHoursOnly: boolean('business_hours_only').default(true).notNull(),
  timezone: varchar('timezone', { length: 50 }).default('UTC').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type SlaPolicy = typeof slaPolicies.$inferSelect;
export type NewSlaPolicy = typeof slaPolicies.$inferInsert;

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requesterId: uuid('requester_id')
    .notNull()
    .references(() => users.id),
  assignedTechnicianId: uuid('assigned_technician_id').references(() => users.id),
  assignedTeamId: uuid('assigned_team_id').references(() => teams.id, { onDelete: 'set null' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  ticketType: varchar('ticket_type', { length: 50 }).notNull().default('Incident'),
  impact: varchar('impact', { length: 20 }).notNull().default('MEDIUM'),
  urgency: varchar('urgency', { length: 20 }).notNull().default('MEDIUM'),
  priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
  priorityCode: varchar('priority_code', { length: 10 }).notNull().default('P3'),
  category: varchar('category', { length: 50 }).notNull().default('OTHER'),
  subcategory: varchar('subcategory', { length: 100 }),
  status: varchar('status', { length: 30 }).notNull().default('NEW'),
  source: varchar('source', { length: 30 }).notNull().default('PORTAL'),
  slaPolicyId: uuid('sla_policy_id').references(() => slaPolicies.id, { onDelete: 'set null' }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  firstResponseDueAt: timestamp('first_response_due_at', { withTimezone: true }),
  resolutionDueAt: timestamp('resolution_due_at', { withTimezone: true }),
  slaHours: integer('sla_hours').default(24).notNull(),
  slaStatus: varchar('sla_status', { length: 30 }).notNull().default('WITHIN_SLA'),
  slaBreached: boolean('sla_breached').default(false).notNull(),
  slaPausedAt: timestamp('sla_paused_at', { withTimezone: true }),
  slaPauseDurationSeconds: integer('sla_pause_duration_seconds').default(0).notNull(),
  firstResponseAt: timestamp('first_response_at', { withTimezone: true }),
  resolutionSummary: text('resolution_summary'),
  rootCause: text('root_cause'),
  resolutionCategory: varchar('resolution_category', { length: 100 }),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  reopenedAt: timestamp('reopened_at', { withTimezone: true }),
  reopenCount: integer('reopen_count').default(0).notNull(),
  escalatedAt: timestamp('escalated_at', { withTimezone: true }),
  escalationReason: text('escalation_reason'),
  escalatedToRole: varchar('escalated_to_role', { length: 50 }),
  relatedTaskId: uuid('related_task_id').references(() => tasks.id, { onDelete: 'set null' }),
  relatedAssetId: uuid('related_asset_id').references(() => assets.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

export const ticketComments = pgTable('ticket_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  comment: text('comment').notNull(),
  isInternalNote: boolean('is_internal_note').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketComment = typeof ticketComments.$inferSelect;
export type NewTicketComment = typeof ticketComments.$inferInsert;

export const ticketHistory = pgTable('ticket_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  changedById: uuid('changed_by_id')
    .notNull()
    .references(() => users.id),
  fieldChanged: varchar('field_changed', { length: 50 }).notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketHistory = typeof ticketHistory.$inferSelect;
export type NewTicketHistory = typeof ticketHistory.$inferInsert;

// =============================================================
// 7. DAILY WORK LOGS (QUALITATIVE ACTIVITY)
// =============================================================

export const workLogs = pgTable('work_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'set null' }),
  logDate: date('log_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  totalHours: numeric('total_hours', { precision: 5, scale: 2 }).notNull(),
  workDescription: text('work_description').notNull(),
  investigationPerformed: text('investigation_performed'),
  actionsTaken: text('actions_taken'),
  challengesFaced: text('challenges_faced'),
  status: varchar('status', { length: 30 }).default('SUBMITTED').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type WorkLog = typeof workLogs.$inferSelect;
export type NewWorkLog = typeof workLogs.$inferInsert;

// =============================================================
// 8. Q CLOCKER: ATTENDANCE & WORK SESSIONS
// =============================================================

export const attendanceEvents = pgTable('attendance_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 30 }).notNull(), // CLOCK_IN, CLOCK_OUT, BREAK_START, BREAK_END
  eventTimestamp: timestamp('event_timestamp', { withTimezone: true }).defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  deviceInfo: text('device_info'),
  notes: text('notes'),
  isCorrection: boolean('is_correction').default(false).notNull(),
  verifiedById: uuid('verified_by_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AttendanceEvent = typeof attendanceEvents.$inferSelect;
export type NewAttendanceEvent = typeof attendanceEvents.$inferInsert;

export const workSessions = pgTable('work_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sessionDate: date('session_date').notNull(),
  clockInTime: timestamp('clock_in_time', { withTimezone: true }).notNull(),
  clockOutTime: timestamp('clock_out_time', { withTimezone: true }),
  totalBreakMinutes: integer('total_break_minutes').default(0).notNull(),
  netWorkMinutes: integer('net_work_minutes').default(0).notNull(),
  overtimeMinutes: integer('overtime_minutes').default(0).notNull(),
  status: varchar('status', { length: 30 }).default('ACTIVE').notNull(), // ACTIVE, COMPLETED, IRREGULAR
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type WorkSession = typeof workSessions.$inferSelect;
export type NewWorkSession = typeof workSessions.$inferInsert;

// =============================================================
// 9. TIME TRACKING STOPWATCHES (TASK & TICKET TIMERS)
// =============================================================

export const taskTimeEntries = pgTable('task_time_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  durationSeconds: integer('duration_seconds').default(0).notNull(),
  isRunning: boolean('is_running').default(true).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TaskTimeEntry = typeof taskTimeEntries.$inferSelect;
export type NewTaskTimeEntry = typeof taskTimeEntries.$inferInsert;

export const ticketTimeEntries = pgTable('ticket_time_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ticketId: uuid('ticket_id')
    .notNull()
    .references(() => tickets.id, { onDelete: 'cascade' }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  durationSeconds: integer('duration_seconds').default(0).notNull(),
  isRunning: boolean('is_running').default(true).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TicketTimeEntry = typeof ticketTimeEntries.$inferSelect;
export type NewTicketTimeEntry = typeof ticketTimeEntries.$inferInsert;

// =============================================================
// 10. TIMESHEET MANAGEMENT & APPROVALS
// =============================================================

export const timesheets = pgTable('timesheets', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  managerId: uuid('manager_id').references(() => users.id, { onDelete: 'set null' }),
  periodType: varchar('period_type', { length: 20 }).default('WEEKLY').notNull(), // WEEKLY, MONTHLY
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  totalHours: numeric('total_hours', { precision: 6, scale: 2 }).default('0').notNull(),
  billableHours: numeric('billable_hours', { precision: 6, scale: 2 }).default('0').notNull(),
  status: varchar('status', { length: 30 }).default('DRAFT').notNull(), // DRAFT, SUBMITTED, APPROVED, REJECTED
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Timesheet = typeof timesheets.$inferSelect;
export type NewTimesheet = typeof timesheets.$inferInsert;

export const timesheetEntries = pgTable('timesheet_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  timesheetId: uuid('timesheet_id')
    .notNull()
    .references(() => timesheets.id, { onDelete: 'cascade' }),
  entryDate: date('entry_date').notNull(),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'set null' }),
  hours: numeric('hours', { precision: 5, scale: 2 }).notNull(),
  isBillable: boolean('is_billable').default(true).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type TimesheetEntry = typeof timesheetEntries.$inferSelect;
export type NewTimesheetEntry = typeof timesheetEntries.$inferInsert;

export const approvals = pgTable('approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // TIMESHEET, TASK, ATTENDANCE_CORRECTION
  entityId: uuid('entity_id').notNull(),
  requestedById: uuid('requested_by_id')
    .notNull()
    .references(() => users.id),
  approverId: uuid('approver_id')
    .notNull()
    .references(() => users.id),
  status: varchar('status', { length: 30 }).default('PENDING').notNull(), // PENDING, APPROVED, REJECTED
  comments: text('comments'),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Approval = typeof approvals.$inferSelect;
export type NewApproval = typeof approvals.$inferInsert;

// =============================================================
// 11. FOLLOW-UPS & REMINDER ENGINE
// =============================================================

export const followUps = pgTable('follow_ups', {
  id: uuid('id').defaultRandom().primaryKey(),
  referenceId: varchar('reference_id', { length: 20 }).notNull().unique(),
  entityType: varchar('entity_type', { length: 30 }).notNull(), // TICKET, TASK
  entityId: uuid('entity_id').notNull(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  followUpDate: date('follow_up_date').notNull(),
  followUpTime: varchar('follow_up_time', { length: 10 }),
  expectedResponse: text('expected_response'),
  notes: text('notes'),
  status: varchar('status', { length: 30 }).default('PENDING').notNull(), // PENDING, COMPLETED, ESCALATED
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type FollowUp = typeof followUps.$inferSelect;
export type NewFollowUp = typeof followUps.$inferInsert;

export const reminders = pgTable('reminders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  remindAt: timestamp('remind_at', { withTimezone: true }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  channel: varchar('channel', { length: 30 }).default('IN_APP').notNull(), // IN_APP, EMAIL
  isSent: boolean('is_sent').default(false).notNull(),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// =============================================================
// 12. PERFORMANCE & AUDIT TRAIL
// =============================================================

export const performanceReviews = pgTable('performance_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id')
    .notNull()
    .references(() => users.id),
  reviewPeriod: varchar('review_period', { length: 30 }).notNull(), // DAILY, WEEKLY, MONTHLY
  periodStart: date('period_start').notNull(),
  periodEnd: date('period_end').notNull(),
  score: numeric('score', { precision: 5, scale: 2 }).notNull(),
  complexityRating: numeric('complexity_rating', { precision: 3, scale: 2 }).default('0'),
  qualityRating: numeric('quality_rating', { precision: 3, scale: 2 }).default('0'),
  timelinessRating: numeric('timeliness_rating', { precision: 3, scale: 2 }).default('0'),
  managerRating: numeric('manager_rating', { precision: 3, scale: 2 }).default('0'),
  taskCompletionRate: numeric('task_completion_rate', { precision: 5, scale: 2 }).default('0'),
  reopenedPenalty: numeric('reopened_penalty', { precision: 5, scale: 2 }).default('0'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type NewPerformanceReview = typeof performanceReviews.$inferInsert;

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

// =============================================================
// RELATIONS
// =============================================================

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
    relationName: 'departmentManager',
  }),
  teams: many(teams),
  members: many(users, { relationName: 'departmentMembers' }),
  tasks: many(tasks),
  tickets: many(tickets),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  department: one(departments, {
    fields: [teams.departmentId],
    references: [departments.id],
  }),
  lead: one(users, {
    fields: [teams.leadId],
    references: [users.id],
    relationName: 'teamLead',
  }),
  members: many(users, { relationName: 'teamMembers' }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
    relationName: 'departmentMembers',
  }),
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
    relationName: 'teamMembers',
  }),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
    relationName: 'managerSubordinates',
  }),
  sessions: many(userSessions),
  assignedTasks: many(taskAssignments),
  createdTasks: many(tasks, { relationName: 'taskCreator' }),
  requestedTickets: many(tickets, { relationName: 'ticketRequester' }),
  assignedTickets: many(tickets, { relationName: 'ticketTechnician' }),
  workLogs: many(workLogs),
  attendanceEvents: many(attendanceEvents),
  workSessions: many(workSessions),
  taskTimeEntries: many(taskTimeEntries),
  ticketTimeEntries: many(ticketTimeEntries),
  timesheets: many(timesheets),
  receivedReviews: many(performanceReviews, { relationName: 'employeeReviews' }),
  givenReviews: many(performanceReviews, { relationName: 'managerReviews' }),
  notifications: many(notifications),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  department: one(departments, {
    fields: [tasks.departmentId],
    references: [departments.id],
  }),
  team: one(teams, {
    fields: [tasks.teamId],
    references: [teams.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: 'taskCreator',
  }),
  reviewer: one(users, {
    fields: [tasks.reviewedById],
    references: [users.id],
    relationName: 'taskReviewer',
  }),
  assignments: many(taskAssignments),
  comments: many(taskComments),
  attachments: many(taskAttachments),
  dependencies: many(taskDependencies, { relationName: 'primaryTask' }),
  timeEntries: many(taskTimeEntries),
  workLogs: many(workLogs),
}));

export const taskAssignmentsRelations = relations(taskAssignments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAssignments.taskId],
    references: [tasks.id],
  }),
  employee: one(users, {
    fields: [taskAssignments.employeeId],
    references: [users.id],
  }),
  assignedBy: one(users, {
    fields: [taskAssignments.assignedById],
    references: [users.id],
  }),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
  author: one(users, {
    fields: [taskComments.userId],
    references: [users.id],
  }),
}));

export const taskAttachmentsRelations = relations(taskAttachments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAttachments.taskId],
    references: [tasks.id],
  }),
  uploader: one(users, {
    fields: [taskAttachments.uploadedById],
    references: [users.id],
  }),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  requester: one(users, {
    fields: [tickets.requesterId],
    references: [users.id],
    relationName: 'ticketRequester',
  }),
  assignedTechnician: one(users, {
    fields: [tickets.assignedTechnicianId],
    references: [users.id],
    relationName: 'ticketTechnician',
  }),
  department: one(departments, {
    fields: [tickets.departmentId],
    references: [departments.id],
  }),
  slaPolicy: one(slaPolicies, {
    fields: [tickets.slaPolicyId],
    references: [slaPolicies.id],
  }),
  comments: many(ticketComments),
  history: many(ticketHistory),
  timeEntries: many(ticketTimeEntries),
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketComments.ticketId],
    references: [tickets.id],
  }),
  author: one(users, {
    fields: [ticketComments.userId],
    references: [users.id],
  }),
}));

export const ticketHistoryRelations = relations(ticketHistory, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketHistory.ticketId],
    references: [tickets.id],
  }),
  changedBy: one(users, {
    fields: [ticketHistory.changedById],
    references: [users.id],
  }),
}));

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  employee: one(users, {
    fields: [workLogs.employeeId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [workLogs.taskId],
    references: [tasks.id],
  }),
  ticket: one(tickets, {
    fields: [workLogs.ticketId],
    references: [tickets.id],
  }),
}));

export const attendanceEventsRelations = relations(attendanceEvents, ({ one }) => ({
  employee: one(users, {
    fields: [attendanceEvents.employeeId],
    references: [users.id],
  }),
  verifier: one(users, {
    fields: [attendanceEvents.verifiedById],
    references: [users.id],
  }),
}));

export const workSessionsRelations = relations(workSessions, ({ one }) => ({
  employee: one(users, {
    fields: [workSessions.employeeId],
    references: [users.id],
  }),
}));

export const taskTimeEntriesRelations = relations(taskTimeEntries, ({ one }) => ({
  employee: one(users, {
    fields: [taskTimeEntries.employeeId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [taskTimeEntries.taskId],
    references: [tasks.id],
  }),
}));

export const ticketTimeEntriesRelations = relations(ticketTimeEntries, ({ one }) => ({
  employee: one(users, {
    fields: [ticketTimeEntries.employeeId],
    references: [users.id],
  }),
  ticket: one(tickets, {
    fields: [ticketTimeEntries.ticketId],
    references: [tickets.id],
  }),
}));

export const timesheetsRelations = relations(timesheets, ({ one, many }) => ({
  employee: one(users, {
    fields: [timesheets.employeeId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [timesheets.departmentId],
    references: [departments.id],
  }),
  manager: one(users, {
    fields: [timesheets.managerId],
    references: [users.id],
  }),
  entries: many(timesheetEntries),
}));

export const timesheetEntriesRelations = relations(timesheetEntries, ({ one }) => ({
  timesheet: one(timesheets, {
    fields: [timesheetEntries.timesheetId],
    references: [timesheets.id],
  }),
  task: one(tasks, {
    fields: [timesheetEntries.taskId],
    references: [tasks.id],
  }),
  ticket: one(tickets, {
    fields: [timesheetEntries.ticketId],
    references: [tickets.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  requester: one(users, {
    fields: [approvals.requestedById],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [approvals.approverId],
    references: [users.id],
  }),
}));

export const followUpsRelations = relations(followUps, ({ one }) => ({
  owner: one(users, {
    fields: [followUps.ownerId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [followUps.assignedToId],
    references: [users.id],
  }),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, {
    fields: [reminders.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const performanceReviewsRelations = relations(performanceReviews, ({ one }) => ({
  employee: one(users, {
    fields: [performanceReviews.employeeId],
    references: [users.id],
    relationName: 'employeeReviews',
  }),
  reviewer: one(users, {
    fields: [performanceReviews.reviewerId],
    references: [users.id],
    relationName: 'managerReviews',
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
