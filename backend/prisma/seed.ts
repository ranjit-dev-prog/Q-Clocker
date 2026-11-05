import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/q_clocker';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function main() {
  console.log('🌱 Starting Enterprise Q Clocker database seeding with Prisma ORM...');

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
        description: 'Service desk, ticket troubleshooting, asset provisioning, and device repair',
        isSystem: true,
      },
      {
        code: 'OPERATIONS_MANAGER',
        name: 'Operations Manager',
        description: 'Resource allocation, task workflows, delivery timelines, and logistics',
        isSystem: true,
      },
      {
        code: 'OPERATIONS_EXECUTIVE',
        name: 'Operations Executive',
        description: 'Daily operational tasks, dispatch assistance, and process verification',
        isSystem: true,
      },
      {
        code: 'DEPARTMENT_HEAD',
        name: 'Department Head',
        description: 'Strategic oversight, team allocations, departmental approvals, and metrics',
        isSystem: true,
      },
      {
        code: 'TEAM_LEAD',
        name: 'Team Lead',
        description: 'Team task delegation, sprint tracking, review approvals, and attendance',
        isSystem: true,
      },
      {
        code: 'EMPLOYEE',
        name: 'Employee',
        description: 'Standard worker access, task progress, work logs, attendance, and tickets',
        isSystem: true,
      },
    ];

    const seededRoles: Record<string, string> = {};
    for (const r of rolesData) {
      const role = await prisma.role.upsert({
        where: { code: r.code },
        update: { name: r.name, description: r.description, isSystem: r.isSystem },
        create: r,
      });
      seededRoles[r.code] = role.id;
    }
    console.log(`✅ Roles seeded (${Object.keys(seededRoles).length})`);

    // 2. Seed Granular Permissions
    const permissionsData = [
      { code: 'users:read', name: 'View Users & Profiles', module: 'users' },
      { code: 'users:write', name: 'Create & Update Users', module: 'users' },
      { code: 'users:delete', name: 'Deactivate / Soft-Delete Users', module: 'users' },
      { code: 'tasks:read', name: 'View Tasks & Projects', module: 'tasks' },
      { code: 'tasks:write', name: 'Create & Edit Tasks', module: 'tasks' },
      { code: 'tasks:assign', name: 'Assign Tasks to Staff', module: 'tasks' },
      { code: 'tasks:review', name: 'Review & Grade Tasks', module: 'tasks' },
      { code: 'tickets:read', name: 'View Tickets', module: 'tickets' },
      { code: 'tickets:write', name: 'Create & Modify Tickets', module: 'tickets' },
      { code: 'tickets:assign', name: 'Assign Technicians to Tickets', module: 'tickets' },
      { code: 'tickets:resolve', name: 'Resolve & Close Tickets', module: 'tickets' },
      { code: 'worklogs:read', name: 'View Timesheets & Work Logs', module: 'worklogs' },
      { code: 'worklogs:write', name: 'Submit Work Logs & Timer', module: 'worklogs' },
      { code: 'worklogs:approve', name: 'Approve Work Logs', module: 'worklogs' },
      { code: 'reports:export', name: 'Generate & Export Analytics', module: 'reports' },
      { code: 'settings:manage', name: 'Manage System Configurations', module: 'settings' },
      { code: 'departments:manage', name: 'Manage Departments & Teams', module: 'departments' },
      { code: 'payroll:read', name: 'View Payroll & Batches', module: 'payroll' },
      { code: 'payroll:write', name: 'Process & Upload Payroll Batches', module: 'payroll' },
      { code: 'lifecycle:manage', name: 'Manage Workforce Lifecycle Events', module: 'lifecycle' },
      { code: 'database:explorer', name: 'Explore & Query Database Relational Tables', module: 'system' },
    ];

    for (const p of permissionsData) {
      await prisma.permission.upsert({
        where: { code: p.code },
        update: { name: p.name, module: p.module },
        create: p,
      });
    }
    console.log(`✅ Permissions seeded (${permissionsData.length})`);

    // 3. Seed Departments
    const deptsData = [
      { referenceId: 'DEP-HQ001', code: 'EXEC', name: 'Executive Leadership', description: 'C-Suite and executive steering committee' },
      { referenceId: 'DEP-IT001', code: 'IT', name: 'Information Technology', description: 'Internal infrastructure, cybersecurity, and enterprise systems' },
      { referenceId: 'DEP-ENG001', code: 'ENG', name: 'Software Engineering', description: 'Core product engineering, architecture, and quality assurance' },
      { referenceId: 'DEP-HR001', code: 'HR', name: 'Human Resources', description: 'People operations, talent acquisition, and employee success' },
      { referenceId: 'DEP-OPS001', code: 'OPS', name: 'Operations & Logistics', description: 'Global business operations and client delivery' },
      { referenceId: 'DEP-FIN001', code: 'FIN', name: 'Finance & Accounting', description: 'Financial planning, payroll, and risk analysis' },
    ];

    const seededDepts: Record<string, string> = {};
    for (const d of deptsData) {
      const dept = await prisma.department.upsert({
        where: { code: d.code },
        update: { name: d.name, description: d.description },
        create: d,
      });
      seededDepts[d.code] = dept.id;
    }
    console.log(`✅ Departments seeded (${Object.keys(seededDepts).length})`);

    // 4. Seed Teams
    const teamsData = [
      { referenceId: 'TEM-IT001', departmentId: seededDepts['IT'], name: 'IT Infrastructure & Cloud', description: 'Cloud systems and security operations' },
      { referenceId: 'TEM-IT002', departmentId: seededDepts['IT'], name: 'Enterprise Service Desk', description: 'Level 1-3 helpdesk and user computing' },
      { referenceId: 'TEM-ENG001', departmentId: seededDepts['ENG'], name: 'Frontend Architecture', description: 'Angular, UI engineering, and design systems' },
      { referenceId: 'TEM-ENG002', departmentId: seededDepts['ENG'], name: 'Backend Platform', description: 'NestJS, microservices, and database engineering' },
      { referenceId: 'TEM-HR001', departmentId: seededDepts['HR'], name: 'Talent & Culture', description: 'Onboarding, employee engagement, and benefits' },
    ];

    const seededTeams: Record<string, string> = {};
    for (const t of teamsData) {
      const existing = await prisma.team.findUnique({ where: { referenceId: t.referenceId } });
      if (existing) {
        seededTeams[t.referenceId] = existing.id;
      } else {
        const team = await prisma.team.create({ data: t });
        seededTeams[t.referenceId] = team.id;
      }
    }
    console.log(`✅ Teams seeded (${Object.keys(seededTeams).length})`);

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
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          firstName: u.firstName,
          lastName: u.lastName,
          roleId: u.roleId,
          roleCode: u.roleCode,
          departmentId: u.departmentId,
          teamId: u.teamId,
          jobTitle: u.jobTitle,
          isActive: u.isActive,
        },
        create: u,
      });
    }
    console.log(`✅ Default enterprise users seeded successfully (${usersData.length})`);

    // 6. Seed Default SLA Policies
    const slaData = [
      {
        name: 'Critical Priority SLA (P1)',
        priority: 'CRITICAL',
        responseTargetMinutes: 30,
        resolveTargetMinutes: 240,
        businessHoursOnly: false,
        description: 'Outage or severe service degradation impacting critical operations',
      },
      {
        name: 'High Priority SLA (P2)',
        priority: 'HIGH',
        responseTargetMinutes: 60,
        resolveTargetMinutes: 480,
        businessHoursOnly: false,
        description: 'Significant business degradation with no immediate workaround',
      },
      {
        name: 'Medium Priority SLA (P3)',
        priority: 'MEDIUM',
        responseTargetMinutes: 120,
        resolveTargetMinutes: 1440,
        businessHoursOnly: true,
        description: 'Standard issue impacting individual or minor operations',
      },
      {
        name: 'Low Priority SLA (P4)',
        priority: 'LOW',
        responseTargetMinutes: 480,
        resolveTargetMinutes: 2880,
        businessHoursOnly: true,
        description: 'Minor inquiry, enhancement request, or cosmetic defect',
      },
    ];

    for (const s of slaData) {
      await prisma.slaPolicy.upsert({
        where: { priority: s.priority },
        update: {
          name: s.name,
          responseTargetMinutes: s.responseTargetMinutes,
          resolveTargetMinutes: s.resolveTargetMinutes,
          businessHoursOnly: s.businessHoursOnly,
          description: s.description,
        },
        create: s,
      });
    }
    console.log(`✅ SLA Policies seeded (${slaData.length})`);

    console.log('🎉 Enterprise Database Seeding Completed Successfully with Prisma ORM!');
  } catch (error) {
    console.error('❌ Seeding failed:', (error as Error).message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

