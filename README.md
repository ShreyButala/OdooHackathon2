# 🚚 TransitOps
> **Smart Transport Operations Platform**
>
> An end-to-end transport operations platform that digitizes vehicle registry, driver profiles, dispatch, maintenance workflows, and expense management while enforcing strict business rules and providing real-time financial insights. Built in 8 hours for the Odoo Hackathon.

---

## 📌 Problem Statement
Many logistics and transport companies still rely on manual spreadsheets and fragmented paper logbooks. This leads to:
* **Scheduling Conflicts** & underutilized vehicles.
* **Compliance Risks** (expired driver licenses, missed safety standards).
* **Financial Leakage** (inaccurate expense tracking, hidden maintenance costs).
* **Operational Blindspots** (no clear view of vehicle ROI or overall fleet utilization).

### The Solution: TransitOps
TransitOps centralizes the transport lifecycle into a single dashboard. It enforces automated state transitions, safeguards against dispatch violations, logs fuel/maintenance expenses, and runs advanced reports on fleet health and ROI.

---

## 👥 Target Users & Personas
* **Fleet Manager**: Oversees assets, vehicle lifecycle, maintenance, and operational efficiency.
* **Driver Dispatcher**: Plans trips, assigns drivers and vehicles, and monitors active routes.
* **Safety Officer**: Monitors driver safety scores, compliance, and license expirations.
* **Financial Analyst**: Evaluates operational costs, fuel efficiency, maintenance expenses, and ROI.

---

## ⚙️ Core Architecture & Database Schema
Below is the relational database structure implemented to support role-based access, trip tracking, and financial logging:

```mermaid
erDiagram
    USERS ||--o{ ROLES : "has"
    VEHICLES ||--o{ TRIPS : "assigned_to"
    VEHICLES ||--o{ MAINTENANCE_LOGS : "undergoes"
    VEHICLES ||--o{ FUEL_LOGS : "consumes"
    VEHICLES ||--o{ EXPENSES : "incurs"
    DRIVERS ||--o{ TRIPS : "drives"
    
    USERS {
        int id PK
        string email
        string password_hash
        int role_id FK
    }
    
    ROLES {
        int id PK
        string role_name "Fleet Manager | Driver | Safety Officer | Financial Analyst"
    }

    VEHICLES {
        int id PK
        string registration_number UK "Unique"
        string make_model
        string type "Box Truck | Van | Semi | Flatbed"
        float max_load_capacity "kg"
        float odometer "km"
        float acquisition_cost
        string status "Available | On Trip | In Shop | Retired"
    }

    DRIVERS {
        int id PK
        string name
        string license_number UK
        string license_category "A | B | C | D | CDL"
        date license_expiry_date
        string contact_number
        float safety_score "0.0 - 100.0"
        string status "Available | On Trip | Off Duty | Suspended"
    }

    TRIPS {
        int id PK
        string source
        string destination
        int vehicle_id FK
        int driver_id FK
        float cargo_weight "kg"
        float planned_distance "km"
        float actual_distance_traveled "km"
        string status "Draft | Dispatched | Completed | Cancelled"
    }

    MAINTENANCE_LOGS {
        int id PK
        int vehicle_id FK
        string description "e.g. Oil Change, Brake Pad Replacement"
        float cost
        date start_date
        date end_date
        string status "Active | Closed"
    }

    FUEL_LOGS {
        int id PK
        int vehicle_id FK
        float liters
        float cost
        date date
    }

    EXPENSES {
        int id PK
        int vehicle_id FK
        string type "Toll | Permit | Insurance | Other"
        float cost
        date date
    }