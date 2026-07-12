# TransitOps — Smart Transport Operations Platform

TransitOps is a Fleet Management ERP that goes beyond simple CRUD screens — it's a rules-driven operations system that automates vehicle/driver state transitions, enforces business validations at the service layer, and surfaces live fleet analytics through a dedicated dashboard and reporting engine.

Built as a societal/hackathon project to demonstrate how a small team can ship a production-shaped backend (layered architecture, transactional integrity, RBAC) alongside a modern React frontend in a compressed timeline.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Entity-Relationship Diagram](#entity-relationship-diagram)
- [Roles & Permissions (RBAC)](#roles--permissions-rbac)
- [Trip Lifecycle (State Machine)](#trip-lifecycle-state-machine)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Frontend Overview](#frontend-overview)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Team](#team)
- [License](#license)

---

## Overview

Fleet operators today juggle vehicle availability, driver eligibility, trip dispatch, maintenance downtime, fuel spend, and cost reporting — usually across spreadsheets or disconnected tools. TransitOps consolidates all of it into one system where:

- **State transitions are automatic and transactional.** Dispatching a trip atomically moves the vehicle and driver to `ON_TRIP` — no manual status updates, no partial-failure states.
- **Business rules live in the backend, not the UI.** A suspended driver or a retired vehicle can never be dispatched, regardless of what the frontend allows through.
- **Every action is auditable.** Trips, maintenance records, fuel logs, and expenses are never hard-deleted — historical data is preserved for reporting and analysis.
- **Role-specific views.** A Dispatcher, a Safety Officer, and a Financial Analyst each see and can act on a different slice of the system.

---

## Key Features

- 🔐 JWT-based authentication with role-based access control (RBAC)
- 🚚 Vehicle lifecycle management (Available → On Trip → In Shop → Retired)
- 🧑‍✈️ Driver eligibility engine (license validity, suspension, availability checks)
- 🧾 Transactional trip dispatch / completion / cancellation workflow
- 🔧 Maintenance tracking with automatic vehicle status sync
- ⛽ Fuel log tracking tied to vehicles and trips
- 💰 Expense tracking by category
- 📊 Live operations dashboard (fleet utilization, active trips, drivers on duty)
- 📈 Analytics & reporting (fuel efficiency, operational cost, vehicle ROI)
- 🖥️ Responsive React (Vite) frontend consuming the REST API

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios / Fetch, TailwindCSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Validation | Zod |
| API Testing | Postman |
| Dev Tooling | ts-node-dev, ESLint, Prettier |

---

## System Architecture

The backend follows a strict layered architecture so business logic never leaks into the HTTP layer or the frontend:

```
Client (React)
      │
      ▼
 Express Routes
      │
      ▼
 Controllers   → parse request, call service, shape response
      │
      ▼
 Services      → business rules, validation orchestration, transactions
      │
      ▼
 Repositories  → all Prisma / database calls live here
      │
      ▼
 PostgreSQL (via Prisma Client)
```

Middlewares (`authMiddleware`, `requireRole`) sit in front of controllers and gate access before a request ever reaches business logic.

---

## Database Schema

| Table | Key Fields | Notes |
|---|---|---|
| **User** | id, name, email (unique), password (hashed), role, createdAt | Roles: `FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST` |
| **Vehicle** | id, registrationNumber (unique), vehicleName, vehicleType, maxLoadCapacity, odometer, acquisitionCost, status, createdAt, updatedAt | Status: `AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED` |
| **Driver** | id, name, licenseNumber (unique), licenseCategory, licenseExpiry, phone, safetyScore, status | Status: `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED` |
| **Trip** | id, source, destination, vehicleId (FK), driverId (FK), cargoWeight, plannedDistance, actualDistance, fuelConsumed, status, createdAt, completedAt | Status: `DRAFT`, `DISPATCHED`, `COMPLETED`, `CANCELLED` |
| **Maintenance** | id, vehicleId (FK), description, cost, status, createdAt, completedAt | Status: `ACTIVE`, `CLOSED` |
| **FuelLog** | id, vehicleId (FK), tripId (FK, nullable), liters, cost, date | Optionally linked to a trip |
| **Expense** | id, vehicleId (FK), type, amount, description, date | Type: `MAINTENANCE`, `TOLL`, `REPAIR`, `PARKING`, `OTHER` |

**Referential integrity:** Vehicle/Driver deletions are restricted (`onDelete: Restrict`) where historical Trip, Maintenance, FuelLog, or Expense records exist — financial and audit history is never silently cascaded away.

---

## Entity-Relationship Diagram

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email
        string password
        string role
        datetime createdAt
    }

    VEHICLE {
        string id PK
        string registrationNumber
        string vehicleName
        string vehicleType
        decimal maxLoadCapacity
        decimal odometer
        decimal acquisitionCost
        string status
        datetime createdAt
        datetime updatedAt
    }

    DRIVER {
        string id PK
        string name
        string licenseNumber
        string licenseCategory
        datetime licenseExpiry
        string phone
        decimal safetyScore
        string status
    }

    TRIP {
        string id PK
        string source
        string destination
        string vehicleId FK
        string driverId FK
        decimal cargoWeight
        decimal plannedDistance
        decimal actualDistance
        decimal fuelConsumed
        string status
        datetime createdAt
        datetime completedAt
    }

    MAINTENANCE {
        string id PK
        string vehicleId FK
        string description
        decimal cost
        string status
        datetime createdAt
        datetime completedAt
    }

    FUELLOG {
        string id PK
        string vehicleId FK
        string tripId FK
        decimal liters
        decimal cost
        datetime date
    }

    EXPENSE {
        string id PK
        string vehicleId FK
        string type
        decimal amount
        string description
        datetime date
    }

    VEHICLE ||--o{ TRIP : "assigned to"
    DRIVER ||--o{ TRIP : "assigned to"
    VEHICLE ||--o{ MAINTENANCE : "undergoes"
    VEHICLE ||--o{ FUELLOG : "refuels"
    VEHICLE ||--o{ EXPENSE : "incurs"
    TRIP ||--o{ FUELLOG : "logs fuel for"
```

> Renders automatically on GitHub. If viewing elsewhere, paste the block into the [Mermaid Live Editor](https://mermaid.live).

---

## Roles & Permissions (RBAC)

| Role | Vehicles | Drivers | Trips | Maintenance | Fuel Logs | Expenses | Dashboard | Reports |
|---|---|---|---|---|---|---|---|---|
| **Fleet Manager** | Full | Read | Read | Full | Read | Read | Full | Read |
| **Dispatcher** | Read | Full | Full | — | Full | — | — | — |
| **Safety Officer** | — | Full | Read | — | — | — | — | — |
| **Financial Analyst** | Read | — | Read | Read | Read | Full | — | Full |

*(Adjust this table if your final implementation diverges — this reflects the RBAC map defined in the backend's `permissions.ts`.)*

---

## Trip Lifecycle (State Machine)

```mermaid
stateDiagram-v2
    [*] --> DRAFT: POST /trips
    DRAFT --> DISPATCHED: PATCH /trips/:id/dispatch
    DRAFT --> CANCELLED: PATCH /trips/:id/cancel
    DISPATCHED --> COMPLETED: PATCH /trips/:id/complete
    DISPATCHED --> CANCELLED: PATCH /trips/:id/cancel
    COMPLETED --> [*]
    CANCELLED --> [*]
```

Every transition on this diagram that touches more than one table (Trip + Vehicle + Driver) is executed inside a single `prisma.$transaction` — either every update succeeds, or none do.

---

## API Reference

Base URL: `http://localhost:<PORT>/api`

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Authenticate, returns JWT |
| GET | `/auth/me` | Authenticated | Current user profile |

### Vehicles
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/vehicles` | Fleet Manager | Create vehicle |
| GET | `/vehicles` | Fleet Manager, Dispatcher | List vehicles (filters: status, vehicleType, pagination) |
| GET | `/vehicles/:id` | Fleet Manager, Dispatcher | Get vehicle by ID |
| PUT | `/vehicles/:id` | Fleet Manager | Update vehicle |
| DELETE | `/vehicles/:id` | Fleet Manager | Delete vehicle (blocked if ON_TRIP) |

### Drivers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/drivers` | Safety Officer | Create driver |
| GET | `/drivers` | Safety Officer, Dispatcher | List drivers (filters: status, licenseCategory) |
| GET | `/drivers/:id` | Safety Officer, Dispatcher | Get driver by ID |
| PUT | `/drivers/:id` | Safety Officer | Update driver |
| DELETE | `/drivers/:id` | Safety Officer | Delete driver |

### Trips
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/trips` | Dispatcher | Create trip (DRAFT) |
| PATCH | `/trips/:id/dispatch` | Dispatcher | Dispatch trip (transactional) |
| PATCH | `/trips/:id/complete` | Dispatcher | Complete trip (transactional) |
| PATCH | `/trips/:id/cancel` | Dispatcher | Cancel trip (transactional) |
| GET | `/trips` | Dispatcher, Fleet Manager | List trips (filters: status, date) |
| GET | `/trips/:id` | Dispatcher, Fleet Manager | Get trip by ID |

### Maintenance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/maintenance` | Fleet Manager | Open maintenance record |
| GET | `/maintenance` | Fleet Manager | List maintenance records |
| GET | `/maintenance/:id` | Fleet Manager | Get record by ID |
| PATCH | `/maintenance/:id/close` | Fleet Manager | Close maintenance record |

### Fuel Logs
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/fuel` | Dispatcher, Fleet Manager | Log fuel entry |
| GET | `/fuel` | Dispatcher, Fleet Manager | List fuel logs (filters: vehicleId, tripId, date) |

### Expenses
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/expenses` | Financial Analyst | Log expense |
| GET | `/expenses` | Financial Analyst, Fleet Manager | List expenses (filters: vehicleId, type, date) |

### Dashboard & Reports
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard` | Fleet Manager | Live fleet stats & utilization |
| GET | `/reports` | Financial Analyst, Fleet Manager | Fuel efficiency, operational cost, ROI |

All error responses follow the shape:
```json
{ "error": "Descriptive message here" }
```

---

## Project Structure

```
TransitOps/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/       # API client (Axios/fetch wrappers)
│   │   ├── context/        # Auth context, role-based routing
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm or pnpm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, PORT
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs at `http://localhost:5000` (or your configured `PORT`), with a health check at `GET /health`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # set VITE_API_BASE_URL to the backend URL
npm run dev
```

Frontend runs at `http://localhost:5173` by default (Vite).

---

## Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/transitops"
JWT_SECRET="your-secret-key"
PORT=5000
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## Available Scripts

### Backend
| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npx prisma studio` | Visual database browser |
| `npx prisma migrate dev` | Run/create migrations |

### Frontend
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Frontend Overview

Built with **React (Vite)** for fast dev iteration and a small production bundle.

- **Routing:** React Router, with role-gated routes — a Dispatcher never sees the Financial Analyst's reports view, and vice versa, mirrored from the backend RBAC map.
- **Auth flow:** JWT stored client-side (memory or httpOnly-cookie pattern, depending on your final choice — document whichever you pick), attached via an Axios interceptor to every request.
- **State/data fetching:** API service layer in `src/services/` wraps every backend endpoint; components consume via hooks rather than calling fetch directly.
- **Key views:**
  - Login / Register
  - Dashboard (Fleet Manager) — live counts, fleet utilization
  - Vehicle management (list, create, edit, retire)
  - Driver management (list, create, edit, license status)
  - Trip board (create, dispatch, complete, cancel — reflecting the state machine above)
  - Maintenance log
  - Fuel & Expense entry forms
  - Reports view (Financial Analyst) — fuel efficiency, operational cost, ROI charts
- **Styling:** TailwindCSS for utility-first styling and consistent design tokens across views.

---

## Testing

- **API testing:** Postman collection (`/postman/TransitOps.postman_collection.json`) covering every endpoint and its rejection cases (duplicate registration, expired license, invalid state transitions, etc.) — grown incrementally alongside backend phases.
- **Manual QA checklist:** see acceptance criteria embedded in each backend module for the specific state-transition scenarios to verify by hand before a demo.

---

## Roadmap

- [ ] Real-time trip status updates (WebSocket/SSE)
- [ ] Revenue modeling to complete the ROI calculation
- [ ] Driver mobile companion app
- [ ] Route optimization suggestions
- [ ] Automated maintenance scheduling based on odometer thresholds
- [ ] CSV/PDF export for reports

---

## Team

Built by:
- Shrey Butala
- Daksh Patel
- Deep Prajapati
- Yashvi Mehta

*(Update names/roles to match actual contributions before submission.)*

---

## License

This project was built for academic/hackathon purposes. Add a license (e.g. MIT) here if the project is intended for reuse or public distribution.
