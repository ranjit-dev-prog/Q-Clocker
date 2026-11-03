import { pgTable, uuid, varchar, text, date, numeric, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { tasks } from './tasks.schema';

export const workLogs = pgTable('work_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  employeeId: uuid('employee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  logDate: date('log_date').notNull(),
  startTime: varchar('start_time', { length: 10 }).notNull(), // HH:mm
  endTime: varchar('end_time', { length: 10 }).notNull(), // HH:mm
  totalHours: numeric('total_hours', { precision: 5, scale: 2 }).notNull(),
  workDescription: text('work_description').notNull(),
  challengesFaced: text('challenges_faced'),
  status: varchar('status', { length: 30 }).default('SUBMITTED').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

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

export type WorkLog = typeof workLogs.$inferSelect;
export type NewWorkLog = typeof workLogs.$inferInsert;
