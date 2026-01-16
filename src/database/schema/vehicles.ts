/*
 * Vehicles table
 * It represents the vehicles that are used to transport the goods.
 */
import {
    pgTable,
    serial,
    text,
    doublePrecision,
    boolean,
    timestamp,
    geometry,
    index,
} from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    capacity: doublePrecision("capacity").notNull(),

    // PostGIS geometry point (SRID 4326 = WGS84, GPS coordinates)
    start_location: geometry("start_location", {
        type: "point",
        mode: "xy",
        srid: 4326,
    }).notNull(),

    is_active: boolean("is_active").notNull().default(true),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
    index("vehicles_location_idx").using("gist", table.start_location),
]);

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
