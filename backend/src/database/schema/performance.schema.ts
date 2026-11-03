import { pgTable, uuid, varchar, text, date, numeric, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

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
  score: numeric('score', { precision: 5, scale: 2 }).notNull(), // 0 - 100
  complexityRating: numeric('complexity_rating', { precision: 3, scale: 2 }).default('0'), // 0 - 5
  qualityRating: numeric('quality_rating', { precision: 3, scale: 2 }).default('0'), // 0 - 5
  timelinessRating: numeric('timeliness_rating', { precision: 3, scale: 2 }).default('0'), // 0 - 5
  managerRating: numeric('manager_rating', { precision: 3, scale: 2 }).default('0'), // 0 - 5
  taskCompletionRate: numeric('task_completion_rate', { precision: 5, scale: 2 }).default('0'), // percentage
  reopenedPenalty: numeric('reopened_penalty', { precision: 5, scale: 2 }).default('0'), // points deducted
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

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

export type PerformanceReview = typeof performanceReviews.$inferSelect;
export type NewPerformanceReview = typeof performanceReviews.$inferInsert;
