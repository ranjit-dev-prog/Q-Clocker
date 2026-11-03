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

// -------------------------------------------------------------
// 1. Roles
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 2. Departments
// -------------------------------------------------------------
export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
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

// -------------------------------------------------------------
// 3. Teams
// -------------------------------------------------------------
export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
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

// -------------------------------------------------------------
// 4. Users
// -------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
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
  managerId: uuid('manager_id'),
  jobTitle: varchar('job_title', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// -------------------------------------------------------------
// 5. Tasks
// -------------------------------------------------------------
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskNumber: varchar('task_number', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  departmentId: uuid('department_id').references(() => departments.id, {
    onDelete: 'set null',
  }),
  priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
  category: varchar('category', { length: 100 }).notNull().default('General'),
  referenceProject: varchar('reference_project', { length: 150 }),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 6, scale: 2 }).default('0'),
  actualHours: numeric('actual_hours', { precision: 6, scale: 2 }).default('0'),
  status: varchar('status', { length: 30 }).notNull().default('NOT_STARTED'),
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

// -------------------------------------------------------------
// 6. Task Assignments
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 7. Task Comments
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 8. Task Attachments
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 9. Tickets
// -------------------------------------------------------------
export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  requesterId: uuid('requester_id')
    .notNull()
    .references(() => users.id),
  assignedTechnicianId: uuid('assigned_technician_id').references(() => users.id),
  departmentId: uuid('department_id').references(() => departments.id, {
    onDelete: 'set null',
  }),
  priority: varchar('priority', { length: 20 }).notNull().default('MEDIUM'),
  category: varchar('category', { length: 50 }).notNull().default('OTHER'),
  status: varchar('status', { length: 30 }).notNull().default('OPEN'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  slaHours: integer('sla_hours').default(24).notNull(),
  slaBreached: boolean('sla_breached').default(false).notNull(),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

// -------------------------------------------------------------
// 10. Ticket Comments
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 11. Ticket History
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 12. Work Logs
// -------------------------------------------------------------
export const workLogs = pgTable('work_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  logDate: date('log_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(),
  endTime: varchar('end_time', { length: 10 }).notNull(),
  totalHours: numeric('total_hours', { precision: 5, scale: 2 }).notNull(),
  workDescription: text('work_description').notNull(),
  challengesFaced: text('challenges_faced'),
  status: varchar('status', { length: 30 }).default('SUBMITTED').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type WorkLog = typeof workLogs.$inferSelect;
export type NewWorkLog = typeof workLogs.$inferInsert;

// -------------------------------------------------------------
// 13. Performance Reviews
// -------------------------------------------------------------
export const performanceReviews = pgTable('performance_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id')
    .notNull()
    .references(() => users.id),
  reviewPeriod: varchar('review_period', { length: 30 }).notNull(),
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

// -------------------------------------------------------------
// 14. Notifications
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 15. Audit Logs
// -------------------------------------------------------------
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
  assignedTasks: many(taskAssignments),
  createdTasks: many(tasks, { relationName: 'taskCreator' }),
  requestedTickets: many(tickets, { relationName: 'ticketRequester' }),
  assignedTickets: many(tickets, { relationName: 'ticketTechnician' }),
  workLogs: many(workLogs),
  receivedReviews: many(performanceReviews, { relationName: 'employeeReviews' }),
  givenReviews: many(performanceReviews, { relationName: 'managerReviews' }),
  notifications: many(notifications),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  department: one(departments, {
    fields: [tasks.departmentId],
    references: [departments.id],
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
  comments: many(ticketComments),
  history: many(ticketHistory),
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

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
