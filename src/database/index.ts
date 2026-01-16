/*
 * Database Connection
 * It is the main entry point for the database connection.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Database connection URL
const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://logistic_user:logistic_secret_2026@localhost:5432/logistic_db";

// Drizzle instance
export const db = drizzle(connectionString, { schema });

// export
export * from "./schema";