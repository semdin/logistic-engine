/*
 * Deliveries table
 * It represents the orders/jobs that need to be visited.
 */
import {
  pgTable,
  smallint,
  serial,
  text,
  doublePrecision,
  boolean,
  timestamp,
  geometry,
  index,
} from 'drizzle-orm/pg-core';

export const deliveries = pgTable(
  'deliveries',
  {
    id: serial('id').primaryKey(),
    customer_name: text('customer_name').notNull(),
    address: text('address').notNull(),
    weight: doublePrecision('weight').notNull(),
    //priority 1-5
    priority: smallint('priority').notNull().default(1),
    time_window_start: timestamp('time_window_start').notNull(),
    time_window_end: timestamp('time_window_end').notNull(),
    volume: doublePrecision('volume').notNull(), // m^3
    service_time: smallint('service_time').notNull(), // minutes

    // PostGIS geometry point (SRID 4326 = WGS84, GPS coordinates)
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),

    is_delivered: boolean('is_delivered').notNull().default(false),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('deliveries_location_idx').using('gist', table.location)],
);

export type Delivery = typeof deliveries.$inferSelect;
export type NewDelivery = typeof deliveries.$inferInsert;
