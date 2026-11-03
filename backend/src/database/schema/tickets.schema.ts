import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { departments } from './departments.schema';
import { users } from './users.schema';
import { ticketComments } from './ticket-comments.schema';
import { ticketHistory } from './ticket-history.schema';

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

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
