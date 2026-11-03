import * as bcrypt from 'bcryptjs';
import { getDatabaseConnection } from './connection';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { generateReferenceId } from '../common/utils/reference-id.util';

export async function seedDatabase() {
  console.log('🌱 Starting Enterprise Q Clocker database seeding...');
  const { db } = getDatabaseConnection();

  try {
    // 1. Seed Roles
    const rolesData = [
      {
        code: 'SUPER_ADMIN',
        name: 'Super Administrator',
        description: 'Global access across all organization departments, settings, and users',
        isSystem: true,
      },
      {
        code: 'ADMIN',
        name: 'Administrator',
        description: 'Organizational administration, user management, and operational workflows',
        isSystem: true,
      },
      {
        code: 'HR_MANAGER',
        name: 'HR Manager',
        description: 'Human resources administration, employee lifecycle, and attendance oversight',
        isSystem: true,
      },
      {
        code: 'HR_EXECUTIVE',
        name: 'HR Executive',
        description: 'Employee onboarding, records management, and document verification',
        isSystem: true,
      },
      {
        code: 'IT_MANAGER',
        name: 'IT Manager',
        description: 'IT operations, infrastructure, ticket dispatch, and security response',
        isSystem: true,
      },
      {
        code: 'IT_EXECUTIVE',
        name: 'IT Executive',
        description: 'Technical support, incident resolution, and hardware/software assets',
        isSystem: true,
      },
      {
        code: 'TEAM_LEAD',
        name: 'Team Lead',
        description: 'Sprint planning, task assignment, progress review, and timesheet approvals',
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
      {
        code: 'READ_ONLY',
        name: 'Read Only Viewer',
        description: 'Restricted read-only access for external guests or stakeholders',
        isSystem: true,
      },
    ];

    const seededRoles: Record<string, string> = {};

    for (const r of rolesData) {
      const existing = await db
        .select()
        .from(schema.roles)
        .where(eq(schema.roles.code, r.code))
        .limit(1);

      if (existing.length > 0) {
        seededRoles[r.code] = existing[0].id;
      } else {
        const [inserted] = await db.insert(schema.roles).values(r).returning();
        seededRoles[r.code] = inserted.id;
      }
    }
    console.log('✅ Roles seeded:', Object.keys(seededRoles));

    // 2. Seed Granular Permissions
    const permissionsData = [
      { code: 'employees.create', name: 'Create Employee Records', module: 'Employees' },
      { code: 'employees.read', name: 'View Employee Directory and Profiles', module: 'Employees' },
      { code: 'employees.update', name: 'Update Employee Information', module: 'Employees' },
      { code: 'employees.delete', name: 'Delete Employee Accounts', module: 'Employees' },
      { code: 'employees.archive', name: 'Archive Employee Lifecycle', module: 'Employees' },
      { code: 'employees.import', name: 'Bulk Import Employees via CSV', module: 'Employees' },
      { code: 'employees.export', name: 'Export Employee Records', module: 'Employees' },
      { code: 'departments.create', name: 'Create Departments and Teams', module: 'Departments' },
      { code: 'departments.read', name: 'View Department Structure', module: 'Departments' },
      { code: 'departments.update', name: 'Update Department Details', module: 'Departments' },
      { code: 'departments.delete', name: 'Archive Departments', module: 'Departments' },
      { code: 'roles.create', name: 'Create System Roles', module: 'Roles' },
      { code: 'roles.read', name: 'View Role Permissions', module: 'Roles' },
      { code: 'roles.update', name: 'Modify Role Capabilities', module: 'Roles' },
      { code: 'roles.delete', name: 'Delete Custom Roles', module: 'Roles' },
      { code: 'roles.assign', name: 'Assign Roles to Users', module: 'Roles' },
      { code: 'permissions.read', name: 'Inspect Permission Matrix', module: 'Permissions' },
      { code: 'permissions.assign', name: 'Assign Granular Permissions', module: 'Permissions' },
      { code: 'attendance.read', name: 'View Attendance Records', module: 'Attendance' },
      { code: 'attendance.create', name: 'Clock In / Clock Out', module: 'Attendance' },
      { code: 'attendance.update', name: 'Correct Attendance Punches', module: 'Attendance' },
      { code: 'attendance.approve', name: 'Approve Attendance Corrections', module: 'Attendance' },
      { code: 'timesheets.read', name: 'View Timesheets', module: 'Timesheets' },
      { code: 'timesheets.create', name: 'Submit Weekly Timesheet', module: 'Timesheets' },
      { code: 'timesheets.update', name: 'Modify Timesheet Claims', module: 'Timesheets' },
      { code: 'timesheets.approve', name: 'Approve or Reject Timesheets', module: 'Timesheets' },
      { code: 'tickets.create', name: 'Create ITSM Service Tickets', module: 'Tickets' },
      { code: 'tickets.read', name: 'View Incident Tickets', module: 'Tickets' },
      { code: 'tickets.update', name: 'Update Ticket Status & Notes', module: 'Tickets' },
      { code: 'tickets.assign', name: 'Dispatch / Reassign Tickets', module: 'Tickets' },
      { code: 'tickets.close', name: 'Close & Resolve Incidents', module: 'Tickets' },
      { code: 'tasks.create', name: 'Create Tasks and Objectives', module: 'Tasks' },
      { code: 'tasks.read', name: 'View Tasks & Kanban Board', module: 'Tasks' },
      { code: 'tasks.update', name: 'Update Task Progress & Status', module: 'Tasks' },
      { code: 'tasks.assign', name: 'Assign Tasks to Team Members', module: 'Tasks' },
      { code: 'tasks.delete', name: 'Cancel or Delete Tasks', module: 'Tasks' },
      { code: 'reports.read', name: 'View Operational Reports', module: 'Reports' },
      { code: 'reports.export', name: 'Export PDF and Excel Analytics', module: 'Reports' },
      { code: 'audit_logs.read', name: 'Inspect System Audit Logs', module: 'Audit' },
      { code: 'settings.read', name: 'View Enterprise Configuration', module: 'Settings' },
      { code: 'settings.update', name: 'Modify System Settings', module: 'Settings' },
    ];

    const seededPermissions: Record<string, string> = {};

    for (const p of permissionsData) {
      const existing = await db
        .select()
        .from(schema.permissions)
        .where(eq(schema.permissions.code, p.code))
        .limit(1);

      if (existing.length > 0) {
        seededPermissions[p.code] = existing[0].id;
      } else {
        const [inserted] = await db.insert(schema.permissions).values(p).returning();
        seededPermissions[p.code] = inserted.id;
      }
    }
    console.log('✅ Permissions seeded:', Object.keys(seededPermissions).length);

    // 3. Seed Departments with Reference IDs
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

    const seededDepts: Record<string, string> = {};

    for (const d of deptsData) {
      const existing = await db
        .select()
        .from(schema.departments)
        .where(eq(schema.departments.code, d.code))
        .limit(1);

      if (existing.length > 0) {
        seededDepts[d.code] = existing[0].id;
      } else {
        const [inserted] = await db.insert(schema.departments).values(d).returning();
        seededDepts[d.code] = inserted.id;
      }
    }
    console.log('✅ Departments seeded:', Object.keys(seededDepts));

    // 4. Seed Teams
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

    const seededTeams: Record<string, string> = {};

    for (const t of teamsData) {
      const existing = await db
        .select()
        .from(schema.teams)
        .where(eq(schema.teams.referenceId, t.referenceId))
        .limit(1);

      if (existing.length > 0) {
        seededTeams[t.referenceId] = existing[0].id;
      } else {
        const [inserted] = await db.insert(schema.teams).values(t).returning();
        seededTeams[t.referenceId] = inserted.id;
      }
    }
    console.log('✅ Teams seeded:', Object.keys(seededTeams));

    // 5. Seed Core Default Accounts
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
        .where(eq(schema.users.email, u.email))
        .limit(1);

      if (!existing.length) {
        await db.insert(schema.users).values(u);
      }
    }
    console.log('✅ Enterprise users seeded successfully');

    // 6. Seed Default SLA Policies
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
        .where(eq(schema.slaPolicies.referenceId, sla.referenceId))
        .limit(1);

      if (!existing.length) {
        await db.insert(schema.slaPolicies).values(sla);
      }
    }
    console.log('✅ SLA Policies seeded successfully');

    console.log('🎉 Enterprise Q Clocker database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', (error as Error).message);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
