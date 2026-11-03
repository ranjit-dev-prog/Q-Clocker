"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const connection_1 = require("./connection");
async function runMigrations() {
    console.log('🚀 Running enterprise database DDL schema synchronization...');
    const { pool } = (0, connection_1.getDatabaseConnection)();
    const ddl = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- 1. Roles
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_system BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 2. Permissions & Role Permissions
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(150) NOT NULL,
      module VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id)
    );

    -- 3. Departments
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(20) NOT NULL UNIQUE,
      description TEXT,
      manager_id UUID,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 4. Teams
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
      lead_id UUID,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 4b. Designations
    CREATE TABLE IF NOT EXISTS designations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 5. Users
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      employee_code VARCHAR(50) UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      personal_email VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30),
      avatar_url TEXT,
      role_id UUID NOT NULL REFERENCES roles(id),
      role_code VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
      designation_id UUID REFERENCES designations(id) ON DELETE SET NULL,
      manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
      job_title VARCHAR(100),
      employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
      joining_date DATE,
      work_location VARCHAR(100) NOT NULL DEFAULT 'Headquarters',
      has_login_account BOOLEAN NOT NULL DEFAULT true,
      account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
      invitation_token VARCHAR(255),
      invitation_token_expires_at TIMESTAMPTZ,
      is_active BOOLEAN NOT NULL DEFAULT true,
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ,
      archived_at TIMESTAMPTZ,
      archived_by_id UUID
    );

    -- Backward compatibility alter columns
    ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_code VARCHAR(50) UNIQUE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS personal_email VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS designation_id UUID REFERENCES designations(id) ON DELETE SET NULL;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS joining_date DATE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS work_location VARCHAR(100) NOT NULL DEFAULT 'Headquarters';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS has_login_account BOOLEAN NOT NULL DEFAULT true;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS invitation_token_expires_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS archived_by_id UUID;

    -- 6. User Sessions & Refresh Tokens
    CREATE TABLE IF NOT EXISTS user_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      refresh_token_hash VARCHAR(255) NOT NULL,
      user_agent TEXT,
      ip_address VARCHAR(50),
      is_revoked BOOLEAN NOT NULL DEFAULT false,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 7. Projects & Assets
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(150) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      lead_id UUID REFERENCES users(id) ON DELETE SET NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS assets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(150) NOT NULL,
      asset_tag VARCHAR(50) NOT NULL UNIQUE,
      category VARCHAR(50) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'OPERATIONAL',
      assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      details TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 8. Task Management
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      task_number VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
      category VARCHAR(100) NOT NULL DEFAULT 'General',
      start_date TIMESTAMPTZ NOT NULL,
      due_date TIMESTAMPTZ NOT NULL,
      estimated_hours NUMERIC(6, 2) DEFAULT 0,
      actual_hours NUMERIC(6, 2) DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'ASSIGNED',
      completion_percentage INTEGER NOT NULL DEFAULT 0,
      created_by_id UUID NOT NULL REFERENCES users(id),
      reviewed_by_id UUID REFERENCES users(id),
      review_feedback TEXT,
      reviewed_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS task_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_by_id UUID NOT NULL REFERENCES users(id),
      assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS task_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      is_internal BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS task_attachments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_size INTEGER,
      mime_type VARCHAR(100),
      uploaded_by_id UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS task_dependencies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      dependency_type VARCHAR(30) NOT NULL DEFAULT 'BLOCKS',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 9. SLA Policies & Tickets
    CREATE TABLE IF NOT EXISTS sla_policies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      priority VARCHAR(20) NOT NULL,
      response_time_hours INTEGER NOT NULL,
      resolution_time_hours INTEGER NOT NULL,
      escalation_role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      ticket_number VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      requester_id UUID NOT NULL REFERENCES users(id),
      assigned_technician_id UUID REFERENCES users(id),
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
      category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
      subcategory VARCHAR(100),
      status VARCHAR(30) NOT NULL DEFAULT 'NEW',
      sla_policy_id UUID REFERENCES sla_policies(id) ON DELETE SET NULL,
      due_date TIMESTAMPTZ,
      sla_hours INTEGER NOT NULL DEFAULT 24,
      sla_breached BOOLEAN NOT NULL DEFAULT false,
      first_response_at TIMESTAMPTZ,
      resolution_notes TEXT,
      resolved_at TIMESTAMPTZ,
      closed_at TIMESTAMPTZ,
      related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      related_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS ticket_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      is_internal_note BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ticket_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      changed_by_id UUID NOT NULL REFERENCES users(id),
      field_changed VARCHAR(50) NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 10. Work Logs (Qualitative)
    CREATE TABLE IF NOT EXISTS work_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
      log_date DATE NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      total_hours NUMERIC(5, 2) NOT NULL,
      work_description TEXT NOT NULL,
      investigation_performed TEXT,
      actions_taken TEXT,
      challenges_faced TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 11. Attendance & Work Sessions
    CREATE TABLE IF NOT EXISTS attendance_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      event_type VARCHAR(30) NOT NULL,
      event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip_address VARCHAR(50),
      device_info TEXT,
      notes TEXT,
      is_correction BOOLEAN NOT NULL DEFAULT false,
      verified_by_id UUID REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS work_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_date DATE NOT NULL,
      clock_in_time TIMESTAMPTZ NOT NULL,
      clock_out_time TIMESTAMPTZ,
      total_break_minutes INTEGER NOT NULL DEFAULT 0,
      net_work_minutes INTEGER NOT NULL DEFAULT 0,
      overtime_minutes INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 12. Stopwatches / Timers (Decoupled from Attendance)
    CREATE TABLE IF NOT EXISTS task_time_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      started_at TIMESTAMPTZ NOT NULL,
      ended_at TIMESTAMPTZ,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      is_running BOOLEAN NOT NULL DEFAULT true,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ticket_time_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      started_at TIMESTAMPTZ NOT NULL,
      ended_at TIMESTAMPTZ,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      is_running BOOLEAN NOT NULL DEFAULT true,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 13. Timesheets & Entries
    CREATE TABLE IF NOT EXISTS timesheets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
      period_type VARCHAR(20) NOT NULL DEFAULT 'WEEKLY',
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      total_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
      billable_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
      submitted_at TIMESTAMPTZ,
      reviewed_at TIMESTAMPTZ,
      review_notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS timesheet_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      timesheet_id UUID NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
      entry_date DATE NOT NULL,
      task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
      hours NUMERIC(5, 2) NOT NULL,
      is_billable BOOLEAN NOT NULL DEFAULT true,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 14. Approvals & Follow-ups
    CREATE TABLE IF NOT EXISTS approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      entity_type VARCHAR(50) NOT NULL,
      entity_id UUID NOT NULL,
      requested_by_id UUID NOT NULL REFERENCES users(id),
      approver_id UUID NOT NULL REFERENCES users(id),
      status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
      comments TEXT,
      decided_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reference_id VARCHAR(20) NOT NULL UNIQUE,
      entity_type VARCHAR(30) NOT NULL,
      entity_id UUID NOT NULL,
      owner_id UUID NOT NULL REFERENCES users(id),
      assigned_to_id UUID REFERENCES users(id),
      follow_up_date DATE NOT NULL,
      follow_up_time VARCHAR(10),
      expected_response TEXT,
      notes TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 15. Reminders & Notifications
    CREATE TABLE IF NOT EXISTS reminders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      remind_at TIMESTAMPTZ NOT NULL,
      entity_type VARCHAR(50),
      entity_id UUID,
      channel VARCHAR(30) NOT NULL DEFAULT 'IN_APP',
      is_sent BOOLEAN NOT NULL DEFAULT false,
      sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50),
      entity_id UUID,
      is_read BOOLEAN NOT NULL DEFAULT false,
      read_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 16. Performance & Audit Logs
    CREATE TABLE IF NOT EXISTS performance_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reviewer_id UUID NOT NULL REFERENCES users(id),
      review_period VARCHAR(30) NOT NULL,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      score NUMERIC(5, 2) NOT NULL,
      complexity_rating NUMERIC(3, 2) DEFAULT 0,
      quality_rating NUMERIC(3, 2) DEFAULT 0,
      timeliness_rating NUMERIC(3, 2) DEFAULT 0,
      manager_rating NUMERIC(3, 2) DEFAULT 0,
      task_completion_rate NUMERIC(5, 2) DEFAULT 0,
      reopened_penalty NUMERIC(5, 2) DEFAULT 0,
      feedback TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id UUID,
      details TEXT,
      ip_address VARCHAR(50),
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create Critical Indexes
    CREATE INDEX IF NOT EXISTS idx_tasks_reference ON tasks(reference_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_dept ON tasks(department_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_reference ON tickets(reference_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
    CREATE INDEX IF NOT EXISTS idx_users_reference ON users(reference_id);
    CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance_events(employee_id, event_timestamp);
    CREATE INDEX IF NOT EXISTS idx_task_timer_running ON task_time_entries(employee_id, is_running);
    CREATE INDEX IF NOT EXISTS idx_timesheet_employee_period ON timesheets(employee_id, start_date, end_date);
    CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
  `;
    try {
        await pool.query(ddl);
        console.log('✅ Enterprise PostgreSQL schema successfully synchronized with 26 tables and indexes!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    }
}
if (require.main === module) {
    runMigrations()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}
//# sourceMappingURL=migrate.js.map