import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from './roles.schema';
import { departments } from './departments.schema';
import { teams } from './teams.schema';
import { tasks } from './tasks.schema';
import { taskAssignments } from './task-assignments.schema';
import { tickets } from './tickets.schema';
import { workLogs } from './work-logs.schema';
import { performanceReviews } from './performance.schema';
import { notifications } from './notifications.schema';

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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

