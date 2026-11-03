import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks.schema';
import { users } from './users.schema';

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

export type TaskAttachment = typeof taskAttachments.$inferSelect;
export type NewTaskAttachment = typeof taskAttachments.$inferInsert;

