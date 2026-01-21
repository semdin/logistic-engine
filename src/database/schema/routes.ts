/*
 * Routes table
 * Stores optimized route results for each vehicle.
 */
import {
  pgTable,
  pgEnum,
  serial,
  integer,
  doublePrecision,
  timestamp,
} from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles';

export const routeStatusEnum = pgEnum('route_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  vehicle_id: integer('vehicle_id')
    .notNull()
    .references(() => vehicles.id),
  total_distance: doublePrecision('total_distance').notNull(), //km
  total_time: doublePrecision('total_time').notNull(), // min
  total_cost: doublePrecision('total_cost').notNull(), // currency
  status: routeStatusEnum('status').notNull().default('pending'),
  scheduled_date: timestamp('scheduled_date').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;
