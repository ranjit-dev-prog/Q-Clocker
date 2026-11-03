import { pgTable, uuid, varchar, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { departments } from './departments.schema';
import { users } from './users.schema';
import { taskAssignments } from './task-assignments.schema';
import { taskComments } from './task-comments.schema';
import { taskAttachments } from './task-attachments.schema';
import { workLogs } from './work-logs.schema';

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

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

