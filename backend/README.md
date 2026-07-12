# Fleet Management ERP Backend

Welcome to the backend repository for the **Fleet Management ERP** system. This system provides a robust API to manage vehicles, drivers, trips, maintenance logs, and financial expenses for a modern fleet.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Validation**: Zod

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development and testing.

### 1. Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (Running locally on port 5432 or accessible via a remote URI)
- **pgAdmin** (Optional, but highly recommended for viewing the database tables visually)

### 2. Installation

Navigate to the `backend` directory and install the dependencies:

```bash
cd backend
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the `backend` directory. You can use the provided `.env.example` as a template:

```bash
cp .env.example .env
```

Open your `.env` file and configure your variables:
- `PORT`: The port your server will run on (default: `3000`).
- `DATABASE_URL`: Your PostgreSQL connection string. 
  - *Format*: `postgresql://<USER>:<PASSWORD>@localhost:5432/<DATABASE_NAME>`
  - *Example*: `postgresql://apple:Shrey123@localhost:5432/hackathon`
- `JWT_SECRET`: A secure random string used to sign authentication tokens.

### 4. Database Setup (Prisma)

Once your `DATABASE_URL` is configured and your PostgreSQL server is running, you need to apply the database schema. This will automatically create all the necessary tables in your database and generate the Prisma Client for TypeScript.

```bash
npx prisma migrate dev
```
*(If prompted for a migration name, you can type `init`)*.

### 5. Running the Application

To start the server in development mode with hot-reloading (via `nodemon` / `ts-node`):

```bash
npm run dev
```

The server should now be running. You can test it by visiting the health check endpoint in your browser or Postman:
👉 `http://localhost:3000/health`

---

## 🗂️ Project Structure

The project is organized using a standard layered architecture to keep code clean and scalable:

```text
backend/
├── prisma/
│   └── schema.prisma       # Database schema and models
├── src/
│   ├── app.ts              # Express app setup (middlewares, base routes)
│   ├── server.ts           # Server entry point (starts the HTTP server)
│   ├── config/             # Environment variables and configuration files
│   ├── database/           # Prisma client initialization (singleton)
│   ├── routes/             # API route definitions (e.g., /api/vehicles)
│   ├── controllers/        # Request handlers (processes req/res)
│   ├── services/           # Core business logic
│   ├── repositories/       # Database query abstractions (optional layer)
│   ├── middlewares/        # Custom Express middlewares (auth, error handling)
│   ├── validators/         # Zod schemas for input validation
│   ├── utils/              # Helper functions and utilities
│   └── types/              # Custom TypeScript interfaces/types
└── package.json
```

---

## 📊 Database Schema Overview

The database is modeled to handle all core logistics of fleet management. Key entities include:

- **User**: System users categorized by strict roles (`FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`). Passwords are cryptographically hashed.
- **Vehicle**: The core asset. Tracks load capacity, odometer, acquisition cost, and availability (`AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`).
- **Driver**: Fleet personnel. Tracks license expiry, a calculated safety score, and duty status.
- **Trip**: The main operational record. Links a `Vehicle` and a `Driver` to a specific journey. Tracks planned vs. actual distance, cargo weight, and fuel consumption.
- **Maintenance**: Records of vehicle repairs and routine servicing, including cost and completion status.
- **FuelLog**: Granular tracking of fuel purchases (liters and cost), optionally linked to specific trips to analyze efficiency.
- **Expense**: Financial ledger for the vehicle (tolls, parking, repairs, etc.).

### Important Architectural Decisions
- **No Cascading Deletions**: To preserve financial and audit history, deleting a `Vehicle` or `Driver` is strictly **restricted** (`onDelete: Restrict`) if they have associated Trips, Maintenance records, or Expenses.
- **Precision Mathematics**: All monetary values, distances, and capacities use PostgreSQL `Decimal` types to avoid floating-point rounding errors native to JavaScript.
- **Performance Indexing**: Foreign keys and heavily filtered fields (like `status`, `registrationNumber`, `licenseNumber`, and `email`) are explicitly indexed to ensure queries remain blazing fast as the fleet scales.
