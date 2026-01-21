/*
 * Depots table
 * Stores depot/warehouse locations where vehicles start and their routes.
 */
import {
  pgTable,
  serial,
  text,
  timestamp,
  geometry,
  index,
} from 'drizzle-orm/pg-core';

export const depots = pgTable(
  'depots',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),

    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }).notNull(),

    opening_time: timestamp('opening_time'),
    closing_time: timestamp('closing_time'),

    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('depots_location_idx').using('gist', table.location)],
);

export type Depot = typeof depots.$inferSelect;
export type NewDepot = typeof depots.$inferInsert;
