/*
 * Route stops table
 * Stores individual stops in a route wth sequence order.
 */
import {
  pgTable,
  serial,
  integer,
  doublePrecision,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { routes } from './routes';
import { deliveries } from './deliveries';

export const routeStops = pgTable(
  'route_stops',
  {
    id: serial('id').primaryKey(),
    route_id: integer('route_id')
      .notNull()
      .references(() => routes.id),
    delivery_id: integer('delivery_id')
      .notNull()
      .references(() => deliveries.id),

    sequence_order: integer('sequence_order').notNull(), // 1, 2, 3...

    departure_time: timestamp('departure_time'), // estimated departure
    arrival_time: timestamp('arrival_time'), // estimated arrival
    cumulative_distance: doublePrecision('cumulative_distance'), // km from start

    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('route_stops_route_idx').on(table.route_id)],
);
