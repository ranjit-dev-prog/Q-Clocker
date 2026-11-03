import { getDatabaseConnection } from './connection';

export async function runMigrations() {
  console.log('🚀 Running database DDL schema synchronization...');
  const { pool } = getDatabaseConnection();

  const ddl = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- 1. Roles
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_system BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 2. Departments
    CREATE TABLE IF NOT EXISTS departments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(20) NOT NULL UNIQUE,
      description TEXT,
      manager_id UUID,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 3. Teams
    CREATE TABLE IF NOT EXISTS teams (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
      lead_id UUID,
      description TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 4. Users
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30),
      avatar_url TEXT,
      role_id UUID NOT NULL REFERENCES roles(id),
      role_code VARCHAR(50) NOT NULL DEFAULT 'EMPLOYEE',
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
      manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
      job_title VARCHAR(100),
      is_active BOOLEAN NOT NULL DEFAULT true,
      last_login_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    -- Add circular FK for department manager and team lead if not present
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_departments_manager'
      ) THEN
        ALTER TABLE departments ADD CONSTRAINT fk_departments_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_teams_lead'
      ) THEN
        ALTER TABLE teams ADD CONSTRAINT fk_teams_lead FOREIGN KEY (lead_id) REFERENCES users(id) ON DELETE SET NULL;
      END IF;
    END $$;

    -- 5. Tasks
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_number VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
      category VARCHAR(100) NOT NULL DEFAULT 'General',
      reference_project VARCHAR(150),
      start_date TIMESTAMPTZ NOT NULL,
      due_date TIMESTAMPTZ NOT NULL,
      estimated_hours NUMERIC(6, 2) DEFAULT 0,
      actual_hours NUMERIC(6, 2) DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED',
      completion_percentage INT NOT NULL DEFAULT 0,
      created_by_id UUID NOT NULL REFERENCES users(id),
      reviewed_by_id UUID REFERENCES users(id),
      review_feedback TEXT,
      reviewed_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    -- 6. Task Assignments
    CREATE TABLE IF NOT EXISTS task_assignments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_by_id UUID NOT NULL REFERENCES users(id),
      assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 7. Task Comments
    CREATE TABLE IF NOT EXISTS task_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      is_internal BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 8. Task Attachments
    CREATE TABLE IF NOT EXISTS task_attachments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      file_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_size INT,
      mime_type VARCHAR(100),
      uploaded_by_id UUID NOT NULL REFERENCES users(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 9. Tickets
    CREATE TABLE IF NOT EXISTS tickets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ticket_number VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      requester_id UUID NOT NULL REFERENCES users(id),
      assigned_technician_id UUID REFERENCES users(id),
      department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
      category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
      status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
      due_date TIMESTAMPTZ,
      sla_hours INT NOT NULL DEFAULT 24,
      sla_breached BOOLEAN NOT NULL DEFAULT false,
      resolution_notes TEXT,
      resolved_at TIMESTAMPTZ,
      closed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMPTZ
    );

    -- 10. Ticket Comments
    CREATE TABLE IF NOT EXISTS ticket_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      is_internal_note BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 11. Ticket History
    CREATE TABLE IF NOT EXISTS ticket_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      changed_by_id UUID NOT NULL REFERENCES users(id),
      field_changed VARCHAR(50) NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 12. Work Logs
    CREATE TABLE IF NOT EXISTS work_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
      log_date DATE NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10) NOT NULL,
      total_hours NUMERIC(5, 2) NOT NULL,
      work_description TEXT NOT NULL,
      challenges_faced TEXT,
      status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 13. Performance Reviews
    CREATE TABLE IF NOT EXISTS performance_reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    -- 14. Notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

    -- 15. Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(100) NOT NULL,
      entity_id UUID,
      details TEXT,
      ip_address VARCHAR(50),
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Performance Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role_code ON users(role_code);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_sla_breached ON tickets(sla_breached);
    CREATE INDEX IF NOT EXISTS idx_work_logs_employee_date ON work_logs(employee_id, log_date);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
  `;

  try {
    await pool.query(ddl);
    console.log('✅ PostgreSQL DDL executed successfully! All tables and indexes are ready.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}
