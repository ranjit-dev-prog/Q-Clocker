import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks.schema';
import { users } from './users.schema';

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

export type TaskAssignment = typeof taskAssignments.$inferSelect;
export type NewTaskAssignment = typeof taskAssignments.$inferInsert;

