import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tickets } from './tickets.schema';
import { users } from './users.schema';

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

export type TicketHistory = typeof ticketHistory.$inferSelect;
export type NewTicketHistory = typeof ticketHistory.$inferInsert;

