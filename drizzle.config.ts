import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/database/schema/index.ts",
    out: "./drizzle",
    dialect: "postgresql",

    // ignore postgis tables
    extensionsFilters: ["postgis"],
    schemaFilter: ["public"],

    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || "logistic_user",
        password: process.env.DB_PASSWORD || "logistic_secret_2026",
        database: process.env.DB_NAME || "logistic_db",
        // prevent ssl error
        ssl: false,
    },

    // detailed log
    verbose: true,

    // warn on dangerous operations
    strict: true,

});