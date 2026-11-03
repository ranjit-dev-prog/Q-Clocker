"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const bcrypt = require("bcryptjs");
const connection_1 = require("./connection");
const schema = require("./schema");
const drizzle_orm_1 = require("drizzle-orm");
async function seedDatabase() {
    console.log('🌱 Starting Enterprise Q Clocker database seeding...');
    const { db } = (0, connection_1.getDatabaseConnection)();
    try {
        const rolesData = [
            {
                code: 'SUPER_ADMIN',
                name: 'Super Administrator',
                description: 'Global access across all organization departments, settings, and users',
                isSystem: true,
            },
            {
                code: 'ADMIN',
                name: 'IT Manager / Administrator',
                description: 'Manages tickets, assigns tasks, monitors progress, evaluates performance',
                isSystem: true,
            },
            {
                code: 'TEAM_LEAD',
                name: 'Team Lead',
                description: 'Assigns tasks to team members, creates tickets, reviews daily reports',
                isSystem: true,
            },
            {
                code: 'EMPLOYEE',
                name: 'Employee',
                description: 'Works on tasks, submits daily work logs, creates tickets, views personal reports',
                isSystem: true,
            },
            {
                code: 'AUDITOR',
                name: 'Compliance Auditor',
                description: 'Read-only audit and compliance inspection access across all operational logs',
                isSystem: true,
            },
        ];
        const seededRoles = {};
        for (const r of rolesData) {
            const existing = await db
                .select()
                .from(schema.roles)
                .where((0, drizzle_orm_1.eq)(schema.roles.code, r.code))
                .limit(1);
            if (existing.length > 0) {
                seededRoles[r.code] = existing[0].id;
            }
            else {
                const [inserted] = await db.insert(schema.roles).values(r).returning();
                seededRoles[r.code] = inserted.id;
            }
        }
        console.log('✅ Roles seeded:', Object.keys(seededRoles));
        const permissionsData = [
            { code: 'task.create', name: 'Create Task', module: 'Tasks' },
            { code: 'task.assign', name: 'Assign Task', module: 'Tasks' },
            { code: 'task.update', name: 'Update Task', module: 'Tasks' },
            { code: 'task.approve', name: 'Approve Task', module: 'Tasks' },
            { code: 'ticket.create', name: 'Create Ticket', module: 'Tickets' },
            { code: 'ticket.assign', name: 'Assign Ticket', module: 'Tickets' },
            { code: 'ticket.escalate', name: 'Escalate Ticket', module: 'Tickets' },
            { code: 'ticket.resolve', name: 'Resolve Ticket', module: 'Tickets' },
            { code: 'attendance.record', name: 'Record Attendance', module: 'Attendance' },
            { code: 'attendance.correct', name: 'Correct Attendance', module: 'Attendance' },
            { code: 'timesheet.submit', name: 'Submit Timesheet', module: 'Timesheets' },
            { code: 'timesheet.approve', name: 'Approve Timesheet', module: 'Timesheets' },
            { code: 'employee.manage', name: 'Manage Employees', module: 'Employees' },
            { code: 'department.manage', name: 'Manage Departments', module: 'Departments' },
            { code: 'report.export', name: 'Export Reports', module: 'Reports' },
            { code: 'audit.view', name: 'View Audit Logs', module: 'Audit' },
        ];
        const seededPermissions = {};
        for (const p of permissionsData) {
            const existing = await db
                .select()
                .from(schema.permissions)
                .where((0, drizzle_orm_1.eq)(schema.permissions.code, p.code))
                .limit(1);
            if (existing.length > 0) {
                seededPermissions[p.code] = existing[0].id;
            }
            else {
                const [inserted] = await db.insert(schema.permissions).values(p).returning();
                seededPermissions[p.code] = inserted.id;
            }
        }
        console.log('✅ Permissions seeded:', Object.keys(seededPermissions).length);
        const deptsData = [
            {
                referenceId: 'DEP-IT0001',
                name: 'Information Technology',
                code: 'IT',
                description: 'Enterprise IT infrastructure, helpdesk, network operations and cybersecurity',
            },
            {
                referenceId: 'DEP-ENG001',
                name: 'Software Engineering',
                code: 'ENG',
                description: 'Core product engineering, platform development, API architecture and QA',
            },
            {
                referenceId: 'DEP-OPS001',
                name: 'Operations & Facilities',
                code: 'OPS',
                description: 'Business continuity, facilities, vendor relationships and client delivery',
            },
            {
                referenceId: 'DEP-HR0001',
                name: 'Human Resources',
                code: 'HR',
                description: 'Talent acquisition, employee satisfaction, compensation and organizational policy',
            },
        ];
        const seededDepts = {};
        for (const d of deptsData) {
            const existing = await db
                .select()
                .from(schema.departments)
                .where((0, drizzle_orm_1.eq)(schema.departments.code, d.code))
                .limit(1);
            if (existing.length > 0) {
                seededDepts[d.code] = existing[0].id;
            }
            else {
                const [inserted] = await db.insert(schema.departments).values(d).returning();
                seededDepts[d.code] = inserted.id;
            }
        }
        console.log('✅ Departments seeded:', Object.keys(seededDepts));
        const teamsData = [
            {
                referenceId: 'TEM-ENG001',
                name: 'Core Backend Squad',
                departmentId: seededDepts['ENG'],
                description: 'High-throughput microservices and relational data pipelines',
            },
            {
                referenceId: 'TEM-IT0001',
                name: 'Tier 1/2 Helpdesk & SecOps',
                departmentId: seededDepts['IT'],
                description: 'Enterprise IT support, endpoint security, and access control',
            },
        ];
        const seededTeams = {};
        for (const t of teamsData) {
            const existing = await db
                .select()
                .from(schema.teams)
                .where((0, drizzle_orm_1.eq)(schema.teams.referenceId, t.referenceId))
                .limit(1);
            if (existing.length > 0) {
                seededTeams[t.referenceId] = existing[0].id;
            }
            else {
                const [inserted] = await db.insert(schema.teams).values(t).returning();
                seededTeams[t.referenceId] = inserted.id;
            }
        }
        console.log('✅ Teams seeded:', Object.keys(seededTeams));
        const defaultPasswordHash = await bcrypt.hash('SuperAdmin@2026!', 10);
        const usersData = [
            {
                referenceId: 'EMP-ADM001',
                email: 'superadmin@qclocker.io',
                passwordHash: defaultPasswordHash,
                firstName: 'Alexander',
                lastName: 'Vance',
                phone: '+1-555-0100',
                roleId: seededRoles['SUPER_ADMIN'],
                roleCode: 'SUPER_ADMIN',
                departmentId: seededDepts['IT'],
                jobTitle: 'Chief Information Officer',
                isActive: true,
            },
            {
                referenceId: 'EMP-MGR001',
                email: 'itmanager@qclocker.io',
                passwordHash: await bcrypt.hash('Manager@2026!', 10),
                firstName: 'Marcus',
                lastName: 'Chen',
                phone: '+1-555-0101',
                roleId: seededRoles['ADMIN'],
                roleCode: 'ADMIN',
                departmentId: seededDepts['IT'],
                jobTitle: 'IT Infrastructure & Operations Manager',
                isActive: true,
            },
            {
                referenceId: 'EMP-TL0001',
                email: 'teamlead@qclocker.io',
                passwordHash: await bcrypt.hash('TeamLead@2026!', 10),
                firstName: 'Sarah',
                lastName: 'Jenkins',
                phone: '+1-555-0102',
                roleId: seededRoles['TEAM_LEAD'],
                roleCode: 'TEAM_LEAD',
                departmentId: seededDepts['ENG'],
                teamId: seededTeams['TEM-ENG001'],
                jobTitle: 'Senior Engineering Lead',
                isActive: true,
            },
            {
                referenceId: 'EMP-DEV001',
                email: 'employee@qclocker.io',
                passwordHash: await bcrypt.hash('Employee@2026!', 10),
                firstName: 'David',
                lastName: 'Ross',
                phone: '+1-555-0103',
                roleId: seededRoles['EMPLOYEE'],
                roleCode: 'EMPLOYEE',
                departmentId: seededDepts['ENG'],
                teamId: seededTeams['TEM-ENG001'],
                jobTitle: 'Full-Stack Software Engineer',
                isActive: true,
            },
        ];
        for (const u of usersData) {
            const existing = await db
                .select()
                .from(schema.users)
                .where((0, drizzle_orm_1.eq)(schema.users.email, u.email))
                .limit(1);
            if (!existing.length) {
                await db.insert(schema.users).values(u);
            }
        }
        console.log('✅ Enterprise users seeded successfully');
        const slaData = [
            {
                referenceId: 'SLA-CRIT01',
                name: 'Critical Incident SLA',
                priority: 'CRITICAL',
                responseTimeHours: 1,
                resolutionTimeHours: 4,
                escalationRole: 'ADMIN',
            },
            {
                referenceId: 'SLA-HIGH01',
                name: 'High Priority SLA',
                priority: 'HIGH',
                responseTimeHours: 2,
                resolutionTimeHours: 8,
                escalationRole: 'ADMIN',
            },
            {
                referenceId: 'SLA-MED001',
                name: 'Standard Medium SLA',
                priority: 'MEDIUM',
                responseTimeHours: 4,
                resolutionTimeHours: 24,
                escalationRole: 'TEAM_LEAD',
            },
            {
                referenceId: 'SLA-LOW001',
                name: 'Low Priority Inquiry SLA',
                priority: 'LOW',
                responseTimeHours: 8,
                resolutionTimeHours: 48,
                escalationRole: 'TEAM_LEAD',
            },
        ];
        for (const sla of slaData) {
            const existing = await db
                .select()
                .from(schema.slaPolicies)
                .where((0, drizzle_orm_1.eq)(schema.slaPolicies.referenceId, sla.referenceId))
                .limit(1);
            if (!existing.length) {
                await db.insert(schema.slaPolicies).values(sla);
            }
        }
        console.log('✅ SLA Policies seeded successfully');
        console.log('🎉 Enterprise Q Clocker database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error.message);
        throw error;
    }
}
if (require.main === module) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
//# sourceMappingURL=seed.js.map