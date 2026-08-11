# Vehicle Rental Management Backend

A REST API for a vehicle rental company. Staff log in and manage the vehicle fleet; customer bookings are recorded as rentals.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL (via Knex query builder)
- **Auth:** JWT (jsonwebtoken)
- **Validation:** Joi
- **File Upload:** Multer

## Project Structure

```
src/
  config/           # Environment, database, Knex configuration
  controllers/      # Route handlers (Auth, Vehicle, Rental, Report)
  database/
    migrations/     # Database schema migrations
    seeds/          # Seed data
  middleware/       # JWT auth, file upload (Multer)
  routes/           # Express route definitions
  services/         # Business logic (OOP classes)
  types/            # TypeScript interfaces and type declarations
  validators/       # Joi validation schemas
  app.ts            # Express app setup
  index.ts          # Entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running

### 1. Clone the repository

```bash
git clone https://github.com/Prosunsajal4/Assignment360.git
cd Assignment360
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=vehicle_rental_db
JWT_SECRET=your_secret_key
```

### 4. Create the database

```sql
CREATE DATABASE vehicle_rental_db;
```

### 5. Run migrations

```bash
npx knex --knexfile src/config/knexfile.ts migrate:latest
```

### 6. Seed the database

```bash
npx knex --knexfile src/config/knexfile.ts seed:run
```

### 7. Start the server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

The server runs on `http://localhost:3000` by default.

## API Endpoints

### Authentication

| Method | Endpoint       | Body                         | Description         |
|--------|----------------|------------------------------|---------------------|
| POST   | `/auth/login`  | `{ email, password }`        | Login, returns JWT  |

### Vehicles (requires JWT)

| Method | Endpoint           | Body / Query                                        | Description              |
|--------|--------------------|------------------------------------------------------|--------------------------|
| GET    | `/vehicles`        | `?page=1&limit=10&category=&search=`                | List vehicles (paginated) |
| GET    | `/vehicles/:id`    |                                                      | Get vehicle by ID        |
| POST   | `/vehicles`        | multipart: `name, plate_number, category, daily_rate, photo` | Create vehicle     |
| PUT    | `/vehicles/:id`    | multipart: same fields + `photo`                     | Update vehicle           |
| DELETE | `/vehicles/:id`    |                                                      | Soft delete vehicle      |

### Rentals (requires JWT)

| Method | Endpoint          | Body / Query                                              | Description              |
|--------|-------------------|------------------------------------------------------------|--------------------------|
| GET    | `/rentals`        | `?page=1&limit=10&vehicle_id=&status=&start_date=&end_date=` | List rentals (paginated) |
| GET    | `/rentals/:id`    |                                                            | Get rental by ID         |
| POST   | `/rentals`        | `{ vehicle_id, customer_name, customer_phone, start_date, end_date }` | Create rental |
| PUT    | `/rentals/:id`    | same fields or `{ status }`                                | Update rental            |
| DELETE | `/rentals/:id`    |                                                            | Delete rental            |

**Overlap check:** Returns `409 Conflict` if the vehicle has an active rental overlapping the requested dates.

**Total calculation:** Server-side: `daily_rate × number_of_days` (same start/end = 1 day).

### Reports (requires JWT)

| Method | Endpoint              | Query                             | Description                   |
|--------|-----------------------|-----------------------------------|-------------------------------|
| GET    | `/reports/rentals`    | `?month=YYYY-MM&vehicle_id=`      | Monthly rental activity report |

Response per vehicle:
```json
{
  "vehicle_id": 1,
  "name": "Toyota Corolla",
  "total_bookings": 3,
  "days_rented": 12,
  "revenue": 600.00
}
```

Only days/revenue falling inside the requested month are counted. A rental running Jul 29–Aug 3 contributes 3 days to the August report.

Also returns `top_vehicle` with the highest revenue for the month.

## Seed Data

| Staff Email           | Password     |
|-----------------------|--------------|
| admin@rental.com      | password123  |
| john@rental.com       | password123  |

The seed includes a rental (vehicle_id=1) spanning **July 28 – August 4, 2026** to test the monthly report's cross-month boundary logic.

## Database Schema

### staff
- id, email (unique), password_hash, name, created_at, updated_at

### vehicles
- id, name, plate_number (unique), category, daily_rate, photo_path (nullable), deleted_at (nullable), created_at, updated_at

### rentals
- id, vehicle_id (FK), customer_name, customer_phone, start_date, end_date, total_amount, status (booked/ongoing/completed/cancelled), created_at, updated_at
