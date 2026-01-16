# Logistic Engine

A backend application for managing deliveries and vehicles. Built with NestJS, PostgreSQL, PostGIS, and Redis.

## What This Project Does

This project helps you:
- Track delivery locations
- Manage vehicle fleet
- Calculate distances between points
- Find nearest delivery points

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework |
| **PostgreSQL** | Main database |
| **PostGIS** | Geographic data support |
| **Redis** | Caching |
| **Drizzle ORM** | Database management |
| **Docker** | Running services |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

Make sure Docker is running on your computer. Then:

```bash
docker compose up -d
```

This starts:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)

### 3. Push Database Schema

```bash
npm run db:push
```

This creates the tables in the database.

### 4. Run the Application

```bash
npm run start:dev
```

The app runs on `http://localhost:3000`

## Database Tables

### Vehicles Table

Stores information about delivery vehicles.

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Unique ID |
| name | text | Vehicle name or license plate |
| capacity | double | Maximum load capacity |
| start_location | geometry | Starting point (GPS coordinates) |
| is_active | boolean | Is the vehicle available? |
| created_at | timestamp | When it was created |
| updated_at | timestamp | When it was last updated |

### Deliveries Table

Stores delivery orders.

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Unique ID |
| customer_name | text | Customer's name |
| address | text | Delivery address |
| weight | double | Package weight |
| location | geometry | Delivery point (GPS coordinates) |
| is_delivered | boolean | Is it delivered? |
| created_at | timestamp | When it was created |
| updated_at | timestamp | When it was last updated |

## Project Structure

```
logistic-engine/
├── src/
│   ├── database/
│   │   ├── schema/
│   │   │   ├── index.ts        # Export all tables
│   │   │   ├── vehicles.ts     # Vehicles table
│   │   │   └── deliveries.ts   # Deliveries table
│   │   └── index.ts            # Database connection
│   ├── app.module.ts           # Main module
│   ├── app.controller.ts       # Main controller
│   ├── app.service.ts          # Main service
│   └── main.ts                 # Entry point
├── drizzle/                    # Migration files
├── docker-compose.yml          # Docker services
├── drizzle.config.ts           # Drizzle configuration
└── package.json
```

## Available Commands

### NPM Scripts

| Command | What It Does |
|---------|--------------|
| `npm run start:dev` | Start app in development mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production build |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open database viewer |

### Docker Commands

| Command | What It Does |
|---------|--------------|
| `docker compose up -d` | Start all services |
| `docker compose down` | Stop all services |
| `docker compose down -v` | Stop and delete data |
| `docker ps` | Show running containers |

## Environment Variables

You can set these in a `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_USER | logistic_user | Database user |
| DB_PASSWORD | logistic_secret_2026 | Database password |
| DB_NAME | logistic_db | Database name |

## PostGIS Features

This project uses PostGIS for geographic data. You can:

- Store GPS coordinates as geometry points
- Calculate distance between two points
- Find all deliveries within a radius
- Use spatial indexes for fast queries

### Example: Insert a Location

```typescript
// Using geometry type with x (longitude) and y (latitude)
await db.insert(vehicles).values({
    name: "Truck 1",
    capacity: 1000,
    start_location: { x: 28.9784, y: 41.0082 }, // Istanbul
    is_active: true,
});
```

## License

This project is private.
