# Q Clocker — Enterprise Task Management, IT Ticketing & Performance Tracking System

Q Clocker is a production-ready, full-stack enterprise web application designed for organization-wide employee task management, IT support ticket lifecycle handling, daily timesheets, and multi-factor employee performance evaluation.

---

## 🏛️ System Architecture

- **Frontend**: Angular 19+ (Standalone Components, Signals, Reactive Forms, Angular Material, Tailwind CSS)
- **Backend**: NestJS (TypeScript, Modular Architecture, REST API, Swagger/OpenAPI, Passport JWT, RBAC Guards, Throttling)
- **Database**: PostgreSQL 16 with **Prisma ORM** & **Prisma Client** (39 relational models, Prisma Studio)
- **Infrastructure**: Docker & Docker Compose

---

## 👤 User Roles & System Matrix

| Role | Access Scope | Key Capabilities |
| :--- | :--- | :--- |
| **Super Admin** | Organization-wide | System config, department & team hierarchy, user provisioning, global executive reports. |
| **Admin / IT Manager** | Department & IT Operations | Ticket dispatch, SLA escalation, task approval/rejection, multi-factor performance reviews. |
| **Team Lead** | Team & Project Squad | Assign daily sprint tasks, create support tickets, monitor team progress, daily reviews. |
| **Employee** | Personal Workspace | View assigned tasks, submit completed work & time logs, raise IT tickets, track performance. |

---

## 🔑 Pre-Seeded Default Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@qclocker.io` | `SuperAdmin@2026!` |
| **IT Manager** | `itmanager@qclocker.io` | `Manager@2026!` |
| **Team Lead** | `teamlead@qclocker.io` | `TeamLead@2026!` |
| **Employee** | `employee@qclocker.io` | `Employee@2026!` |

---

## 🚀 Getting Started

### Option 1: Docker Compose (All-in-One Deployment)

Start PostgreSQL, Backend, and Frontend containers with one command:

```bash
docker compose up -d --build
```

- **Frontend Application**: [http://localhost:4200](http://localhost:4200)
- **Backend REST API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Swagger Documentation**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Option 2: Local Development

#### 1. Backend Setup
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:seed
npm run prisma:studio # Open Prisma Studio at http://localhost:5555
npm run start:dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

