import * as bcrypt from 'bcryptjs';
import { getDatabaseConnection } from './connection';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
  console.log('🌱 Starting Q Clocker database seeding...');
  const { db, pool } = getDatabaseConnection();

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

    // 2. Seed Departments
    const deptsData = [
      { name: 'Information Technology', code: 'IT', description: 'Enterprise IT infrastructure, helpdesk and security' },
      { name: 'Software Engineering', code: 'ENG', description: 'Core product development and software architecture' },
      { name: 'Operations', code: 'OPS', description: 'Business operations, facilities, and service delivery' },
      { name: 'Human Resources', code: 'HR', description: 'Talent management, organizational development and compliance' },
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

    // 3. Seed Users
    const saltRounds = 10;
    const adminHash = await bcrypt.hash('SuperAdmin@2026!', saltRounds);
    const mgrHash = await bcrypt.hash('Manager@2026!', saltRounds);
    const leadHash = await bcrypt.hash('TeamLead@2026!', saltRounds);
    const empHash = await bcrypt.hash('Employee@2026!', saltRounds);

    const usersData = [
      {
        email: 'superadmin@qclocker.io',
        passwordHash: adminHash,
        firstName: 'Alexander',
        lastName: 'Vance',
        roleId: seededRoles['SUPER_ADMIN'],
        roleCode: 'SUPER_ADMIN',
        departmentId: seededDepts['IT'],
        jobTitle: 'Chief Information Officer',
        phone: '+1-555-0100',
        isActive: true,
      },
      {
        email: 'itmanager@qclocker.io',
        passwordHash: mgrHash,
        firstName: 'Marcus',
        lastName: 'Chen',
        roleId: seededRoles['ADMIN'],
        roleCode: 'ADMIN',
        departmentId: seededDepts['IT'],
        jobTitle: 'IT Infrastructure & Operations Manager',
        phone: '+1-555-0101',
        isActive: true,
      },
      {
        email: 'teamlead@qclocker.io',
        passwordHash: leadHash,
        firstName: 'Sarah',
        lastName: 'Jenkins',
        roleId: seededRoles['TEAM_LEAD'],
        roleCode: 'TEAM_LEAD',
        departmentId: seededDepts['ENG'],
        jobTitle: 'Senior Engineering Lead',
        phone: '+1-555-0102',
        isActive: true,
      },
      {
        email: 'employee@qclocker.io',
        passwordHash: empHash,
        firstName: 'David',
        lastName: 'Ross',
        roleId: seededRoles['EMPLOYEE'],
        roleCode: 'EMPLOYEE',
        departmentId: seededDepts['ENG'],
        jobTitle: 'Full-Stack Software Engineer',
        phone: '+1-555-0103',
        isActive: true,
      },
    ];

    const seededUsers: Record<string, string> = {};

    for (const u of usersData) {
      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, u.email))
        .limit(1);

      if (existing.length > 0) {
        seededUsers[u.email] = existing[0].id;
      } else {
        const [inserted] = await db.insert(schema.users).values(u).returning();
        seededUsers[u.email] = inserted.id;
      }
    }
    console.log('✅ Users seeded successfully:', Object.keys(seededUsers));
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase();
}
