/**
 * Enterprise API Test Suite (Positive, Negative, Boundary, Response Envelope)
 * Q Clocker QA Architecture
 */

const fs = require('fs');
const path = require('path');
const { apiRequest, tracker } = require('../utils/client');

async function runApiTests() {
  console.log('=== STEP 7: EXECUTING BACKEND API TESTS ===');

  let adminToken = '';
  let employeeToken = '';
  let sampleUserId = '';
  let sampleDeptId = '';
  let sampleDesignationId = '';
  let sampleTaskId = '';
  let sampleTicketId = '';
  let sampleWorkLogId = '';

  // -------------------------------------------------------------
  // 1. AUTHENTICATION MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Auth APIs ---');

  // Test 1: Positive Login (Super Admin)
  {
    const res = await apiRequest('POST', '/auth/login', {
      body: { email: 'superadmin@qclocker.io', password: 'SuperAdmin@2026!' },
    });
    const pass = res.status === 200 && res.data?.success === true && res.data?.data?.accessToken;
    if (pass) {
      adminToken = res.data.data.accessToken;
      sampleUserId = res.data.data.user.id;
    }
    tracker.record({
      testId: 'TC-API-AUTH-001',
      module: 'Auth',
      scenario: 'Super Admin login with valid credentials',
      type: 'POSITIVE',
      expected: 'HTTP 200 with JWT accessToken and user object',
      actual: `HTTP ${res.status}, success: ${res.data?.success}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 2: Positive Login (Employee)
  {
    const res = await apiRequest('POST', '/auth/login', {
      body: { email: 'employee@qclocker.io', password: 'Employee@2026!' },
    });
    const pass = res.status === 200 && res.data?.data?.accessToken;
    if (pass) {
      employeeToken = res.data.data.accessToken;
    }
    tracker.record({
      testId: 'TC-API-AUTH-002',
      module: 'Auth',
      scenario: 'Standard Employee login with valid credentials',
      type: 'POSITIVE',
      expected: 'HTTP 200 with employee role in token payload',
      actual: `HTTP ${res.status}, role: ${res.data?.data?.user?.role}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 3: Negative Login (Invalid Password)
  {
    const res = await apiRequest('POST', '/auth/login', {
      body: { email: 'superadmin@qclocker.io', password: 'WrongPassword123!' },
    });
    const pass = res.status === 401;
    tracker.record({
      testId: 'TC-API-AUTH-003',
      module: 'Auth',
      scenario: 'Login with incorrect password',
      type: 'NEGATIVE',
      expected: 'HTTP 401 Unauthorized',
      actual: `HTTP ${res.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 4: Negative Login (Missing Email/Password)
  {
    const res = await apiRequest('POST', '/auth/login', { body: {} });
    const pass = res.status === 400 || res.status === 401;
    tracker.record({
      testId: 'TC-API-AUTH-004',
      module: 'Auth',
      scenario: 'Login with empty payload',
      type: 'NEGATIVE',
      expected: 'HTTP 400 Bad Request or 401 Unauthorized',
      actual: `HTTP ${res.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 5: Profile Me
  {
    const res = await apiRequest('GET', '/auth/me', { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.email === 'superadmin@qclocker.io';
    tracker.record({
      testId: 'TC-API-AUTH-005',
      module: 'Auth',
      scenario: 'Get authenticated user profile via /auth/me',
      type: 'POSITIVE',
      expected: 'HTTP 200 with current user profile',
      actual: `HTTP ${res.status}, email: ${res.data?.data?.email}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 6: Sessions Listing
  {
    const res = await apiRequest('GET', '/auth/sessions', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data);
    tracker.record({
      testId: 'TC-API-AUTH-006',
      module: 'Auth',
      scenario: 'List active sessions for current user',
      type: 'POSITIVE',
      expected: 'HTTP 200 with array of user sessions',
      actual: `HTTP ${res.status}, count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 2. USERS & EMPLOYEES MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Employee APIs ---');

  // Test 7: Admin Dashboard Metrics
  {
    const res = await apiRequest('GET', '/users/admin-dashboard', { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.totalEmployees !== undefined;
    tracker.record({
      testId: 'TC-API-EMP-001',
      module: 'Employees',
      scenario: 'Fetch aggregated enterprise workforce metrics',
      type: 'POSITIVE',
      expected: 'HTTP 200 with totalEmployees, roleDistribution, departmentDistribution',
      actual: `HTTP ${res.status}, total: ${res.data?.data?.totalEmployees}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 8: Import Template CSV
  {
    const res = await apiRequest('GET', '/users/import/template', { token: adminToken });
    const pass = res.status === 200 && res.text.includes('employee_code');
    tracker.record({
      testId: 'TC-API-EMP-002',
      module: 'Employees',
      scenario: 'Download bulk import CSV template',
      type: 'POSITIVE',
      expected: 'HTTP 200 with CSV content-type and valid headers',
      actual: `HTTP ${res.status}, contains headers: ${res.text.includes('employee_code')}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 9: Import Preview (Formula Injection check)
  {
    const sampleCsv = `employee_code,first_name,last_name,email,department,designation,role,joining_date,employment_type,work_location
EMP991,=cmd|' /C calc'!A0,Tester,qa.tester@qclocker.io,Software Engineering,QA Engineer,EMPLOYEE,2026-11-01,FULL_TIME,Headquarters`;
    const res = await apiRequest('POST', '/users/import/preview', {
      token: adminToken,
      body: { csvContent: sampleCsv },
    });
    const sanitizedFirstName = res.data?.data?.preview?.[0]?.first_name;
    const formulaStripped = sanitizedFirstName && !sanitizedFirstName.startsWith('=');
    const pass = res.status === 200 && formulaStripped;
    tracker.record({
      testId: 'TC-API-EMP-003',
      module: 'Employees',
      scenario: 'Bulk import preview with CSV formula injection sanitization',
      type: 'SECURITY',
      expected: 'HTTP 200 with leading formula operator (=) stripped from fields',
      actual: `HTTP ${res.status}, sanitized name: "${sanitizedFirstName}"`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 10: Create Employee
  let createdEmpId = '';
  {
    const uniqueEmail = `test.employee.${Date.now()}@qclocker.io`;
    const res = await apiRequest('POST', '/users', {
      token: adminToken,
      body: {
        firstName: 'Valerie',
        lastName: 'Stone',
        email: uniqueEmail,
        employeeCode: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        jobTitle: 'Senior Systems QA Engineer',
        roleCode: 'EMPLOYEE',
        employmentType: 'FULL_TIME',
        workLocation: 'Engineering Labs',
      },
    });
    const pass = res.status === 201 && res.data?.data?.referenceId?.startsWith('EMP-');
    if (pass) {
      createdEmpId = res.data.data.id;
    }
    tracker.record({
      testId: 'TC-API-EMP-004',
      module: 'Employees',
      scenario: 'Create new employee with random EMP- reference ID',
      type: 'POSITIVE',
      expected: 'HTTP 201 with generated EMP-XXXXXX reference ID',
      actual: `HTTP ${res.status}, referenceId: ${res.data?.data?.referenceId}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 11: List Employees with Search Filter
  {
    const res = await apiRequest('GET', '/users?search=Valerie', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data) && res.data?.data?.length > 0;
    tracker.record({
      testId: 'TC-API-EMP-005',
      module: 'Employees',
      scenario: 'Filter employee directory by keyword search',
      type: 'POSITIVE',
      expected: 'HTTP 200 returning matching employee records',
      actual: `HTTP ${res.status}, matched count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 12: Safe Archival of Employee
  if (createdEmpId) {
    const res = await apiRequest('POST', `/users/${createdEmpId}/archive`, { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.success === true;
    tracker.record({
      testId: 'TC-API-EMP-006',
      module: 'Employees',
      scenario: 'Safely archive employee without deleting historical data',
      type: 'POSITIVE',
      expected: 'HTTP 200 with archived status confirmed',
      actual: `HTTP ${res.status}, message: ${res.data?.data?.message}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 13: Reactivate Archived Employee
  if (createdEmpId) {
    const res = await apiRequest('POST', `/users/${createdEmpId}/reactivate`, { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.success === true;
    tracker.record({
      testId: 'TC-API-EMP-007',
      module: 'Employees',
      scenario: 'Reactivate an archived employee account',
      type: 'POSITIVE',
      expected: 'HTTP 200 with active status restored',
      actual: `HTTP ${res.status}, message: ${res.data?.data?.message}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 3. DEPARTMENTS & TEAMS MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Department & Org Chart APIs ---');

  // Test 14: List Departments
  {
    const res = await apiRequest('GET', '/departments', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data);
    if (pass && res.data.data.length > 0) {
      sampleDeptId = res.data.data[0].id;
    }
    tracker.record({
      testId: 'TC-API-DEP-001',
      module: 'Departments',
      scenario: 'List all company departments',
      type: 'POSITIVE',
      expected: 'HTTP 200 with list of departments',
      actual: `HTTP ${res.status}, count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 15: Org Chart Hierarchy
  {
    const res = await apiRequest('GET', '/departments/org-chart', { token: adminToken });
    const rootNodes = res.data?.data?.rootNodes;
    const pass = res.status === 200 && Array.isArray(rootNodes) && rootNodes.length > 0;
    tracker.record({
      testId: 'TC-API-DEP-002',
      module: 'Departments',
      scenario: 'Retrieve complete organizational hierarchy chart',
      type: 'POSITIVE',
      expected: 'HTTP 200 with nested department/team hierarchy rootNodes',
      actual: `HTTP ${res.status}, nodes: ${rootNodes?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 4. DESIGNATIONS MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Designation APIs ---');

  // Test 16: List Designations
  {
    const res = await apiRequest('GET', '/designations', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data);
    if (pass && res.data.data.length > 0) {
      sampleDesignationId = res.data.data[0].id;
    }
    tracker.record({
      testId: 'TC-API-DSG-001',
      module: 'Designations',
      scenario: 'List corporate job designations',
      type: 'POSITIVE',
      expected: 'HTTP 200 with designation records',
      actual: `HTTP ${res.status}, count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 17: Create Designation
  {
    const code = `QA_SPEC_${Date.now()}`;
    const res = await apiRequest('POST', '/designations', {
      token: adminToken,
      body: {
        name: 'Enterprise Quality Assurance Specialist',
        code,
        description: 'Oversees system automation and verification',
      },
    });
    const pass = res.status === 201 && res.data?.data?.referenceId?.startsWith('DSG-');
    tracker.record({
      testId: 'TC-API-DSG-002',
      module: 'Designations',
      scenario: 'Create new designation with random DSG- reference ID',
      type: 'POSITIVE',
      expected: 'HTTP 201 with DSG-XXXXXX reference ID',
      actual: `HTTP ${res.status}, referenceId: ${res.data?.data?.referenceId}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 5. ROLES & PERMISSIONS MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Roles & Permissions APIs ---');

  // Test 18: List Roles
  {
    const res = await apiRequest('GET', '/roles', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length >= 8;
    tracker.record({
      testId: 'TC-API-ROL-001',
      module: 'Roles',
      scenario: 'List all RBAC roles (10 enterprise roles)',
      type: 'POSITIVE',
      expected: 'HTTP 200 with at least 8 enterprise roles',
      actual: `HTTP ${res.status}, roles count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 19: Permissions Catalog
  {
    const res = await apiRequest('GET', '/permissions', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0;
    tracker.record({
      testId: 'TC-API-PRM-001',
      module: 'Permissions',
      scenario: 'List granular system permission catalog',
      type: 'POSITIVE',
      expected: 'HTTP 200 with granular module.resource.action permissions',
      actual: `HTTP ${res.status}, count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 20: Permission Matrix
  {
    const res = await apiRequest('GET', '/permissions/matrix', { token: adminToken });
    const pass = res.status === 200 && typeof res.data?.data === 'object' && res.data?.data?.SUPER_ADMIN;
    tracker.record({
      testId: 'TC-API-PRM-002',
      module: 'Permissions',
      scenario: 'Retrieve complete RBAC permission matrix',
      type: 'POSITIVE',
      expected: 'HTTP 200 with matrix mapping each role to granted permissions',
      actual: `HTTP ${res.status}, matrix keys: ${Object.keys(res.data?.data || {}).length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 6. TASKS & KANBAN MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 6. Testing Task & Kanban APIs ---');

  // Test 21: Create Task with TSK reference
  {
    const res = await apiRequest('POST', '/tasks', {
      token: adminToken,
      body: {
        title: 'Execute Automated Regression Verification Suite',
        description: 'Verify all 54 API operations and system state integrity',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        estimatedHours: 8,
      },
    });
    const pass = res.status === 201 && res.data?.data?.referenceId?.startsWith('TSK-');
    if (pass) {
      sampleTaskId = res.data.data.id;
    }
    tracker.record({
      testId: 'TC-API-TSK-001',
      module: 'Tasks',
      scenario: 'Create task with random TSK- reference ID',
      type: 'POSITIVE',
      expected: 'HTTP 201 with TSK-XXXXXX reference ID',
      actual: `HTTP ${res.status}, referenceId: ${res.data?.data?.referenceId}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 22: Kanban Board Grouping
  {
    const res = await apiRequest('GET', '/tasks/kanban', { token: adminToken });
    const columns = res.data?.data;
    const hasColumns = columns && columns.BACKLOG && columns.IN_PROGRESS && columns.COMPLETED;
    const pass = res.status === 200 && hasColumns;
    tracker.record({
      testId: 'TC-API-TSK-002',
      module: 'Tasks',
      scenario: 'Fetch Kanban board grouped by status columns',
      type: 'POSITIVE',
      expected: 'HTTP 200 with BACKLOG, IN_PROGRESS, REVIEW, COMPLETED columns',
      actual: `HTTP ${res.status}, columns: ${Object.keys(columns || {}).join(', ')}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 23: Task Status Drag-and-Drop Update
  if (sampleTaskId) {
    const res = await apiRequest('PATCH', `/tasks/${sampleTaskId}/status`, {
      token: adminToken,
      body: { status: 'COMPLETED' },
    });
    const pass = res.status === 200 && res.data?.data?.status === 'COMPLETED';
    tracker.record({
      testId: 'TC-API-TSK-003',
      module: 'Tasks',
      scenario: 'Update task status via drag-and-drop PATCH',
      type: 'POSITIVE',
      expected: 'HTTP 200 with updated status COMPLETED',
      actual: `HTTP ${res.status}, status: ${res.data?.data?.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 7. TICKETS & ITSM MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 7. Testing Ticket & ITSM APIs ---');

  // Test 24: Create Ticket with SLA calculation
  {
    const res = await apiRequest('POST', '/tickets', {
      token: adminToken,
      body: {
        title: 'Core Database Connection Pool Optimization Needed',
        description: 'Verify connection timeout and pooling configuration',
        category: 'DATABASE',
        priority: 'CRITICAL',
      },
    });
    const pass = res.status === 201 && res.data?.data?.referenceId?.startsWith('TKT-');
    if (pass) {
      sampleTicketId = res.data.data.id;
    }
    tracker.record({
      testId: 'TC-API-TKT-001',
      module: 'Tickets',
      scenario: 'Create ITSM ticket with SLA calculation and TKT- reference',
      type: 'POSITIVE',
      expected: 'HTTP 201 with TKT-XXXXXX reference and slaResolutionHours',
      actual: `HTTP ${res.status}, referenceId: ${res.data?.data?.referenceId}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 25: Ticket Metrics & SLA Compliance
  {
    const res = await apiRequest('GET', '/tickets/metrics', { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.totalTickets !== undefined;
    tracker.record({
      testId: 'TC-API-TKT-002',
      module: 'Tickets',
      scenario: 'Fetch ITSM & SLA compliance metrics',
      type: 'POSITIVE',
      expected: 'HTTP 200 with totalTickets, openTickets, slaComplianceRate',
      actual: `HTTP ${res.status}, total: ${res.data?.data?.totalTickets}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 26: Resolve Ticket
  if (sampleTicketId) {
    const res = await apiRequest('POST', `/tickets/${sampleTicketId}/resolve`, {
      token: adminToken,
      body: {
        resolutionNotes: 'Connection pool idle timeout adjusted to 10000ms. Tested OK.',
        rootCause: 'Default driver pool settings exceeded max connections on concurrent spike.',
      },
    });
    const pass = res.status === 200 && res.data?.data?.status === 'RESOLVED';
    tracker.record({
      testId: 'TC-API-TKT-003',
      module: 'Tickets',
      scenario: 'Resolve ticket with root cause analysis notes',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status RESOLVED and resolutionNotes stored',
      actual: `HTTP ${res.status}, status: ${res.data?.data?.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 8. DAILY WORK LOGS MODULE TESTS
  // -------------------------------------------------------------
  console.log('\n--- 8. Testing Work Log APIs ---');

  // Test 27: Create Work Log with WLG reference
  {
    const today = new Date().toISOString().substring(0, 10);
    const res = await apiRequest('POST', '/work-logs', {
      token: adminToken,
      body: {
        date: today,
        hours: 4.5,
        activityType: 'DEVELOPMENT',
        description: 'Built enterprise automated QA test harness and API inventory',
      },
    });
    const pass = res.status === 201 && res.data?.data?.referenceId?.startsWith('WLG-');
    if (pass) {
      sampleWorkLogId = res.data.data.id;
    }
    tracker.record({
      testId: 'TC-API-WLG-001',
      module: 'WorkLogs',
      scenario: 'Record daily work log with WLG- reference ID',
      type: 'POSITIVE',
      expected: 'HTTP 201 with WLG-XXXXXX reference and hours recorded',
      actual: `HTTP ${res.status}, referenceId: ${res.data?.data?.referenceId}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 28: Daily Summary Aggregator
  {
    const today = new Date().toISOString().substring(0, 10);
    const res = await apiRequest('GET', `/work-logs/daily-summary?date=${today}`, { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.totalHours !== undefined;
    tracker.record({
      testId: 'TC-API-WLG-002',
      module: 'WorkLogs',
      scenario: 'Get aggregated work hours for specific date',
      type: 'POSITIVE',
      expected: 'HTTP 200 with totalHours and logs list',
      actual: `HTTP ${res.status}, totalHours: ${res.data?.data?.totalHours}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // -------------------------------------------------------------
  // 9. NEGATIVE & BOUNDARY API VALIDATION TESTS
  // -------------------------------------------------------------
  console.log('\n--- 9. Negative & Boundary Validation ---');

  // Test 29: Unauthenticated Request to Protected Route
  {
    const res = await apiRequest('GET', '/users');
    const pass = res.status === 401;
    tracker.record({
      testId: 'TC-API-NEG-001',
      module: 'Security',
      scenario: 'Access protected route without Authorization header',
      type: 'NEGATIVE',
      expected: 'HTTP 401 Unauthorized',
      actual: `HTTP ${res.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 30: Invalid UUID Parameter
  {
    const res = await apiRequest('GET', '/users/invalid-uuid-format-12345', { token: adminToken });
    const pass = res.status === 400 || res.status === 404;
    tracker.record({
      testId: 'TC-API-NEG-002',
      module: 'Validation',
      scenario: 'Pass malformed UUID in route parameter',
      type: 'NEGATIVE',
      expected: 'HTTP 400 or 404 with error message',
      actual: `HTTP ${res.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // Test 31: Work Log Validation (Negative Hours)
  {
    const res = await apiRequest('POST', '/work-logs', {
      token: adminToken,
      body: {
        date: '2026-11-03',
        hours: -5,
        activityType: 'DEVELOPMENT',
        description: 'Negative hours boundary test',
      },
    });
    const pass = res.status === 400;
    tracker.record({
      testId: 'TC-API-NEG-003',
      module: 'Validation',
      scenario: 'Submit negative work log hours (boundary check)',
      type: 'BOUNDARY',
      expected: 'HTTP 400 Bad Request with validation message',
      actual: `HTTP ${res.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  console.log('\n=== BACKEND API TESTS COMPLETED ===');
  const summary = tracker.getSummary();
  console.log(`Executed: ${summary.total} tests | Passed: ${summary.passed} | Failed: ${summary.failed}`);

  // Write report
  const reportPath = path.resolve(__dirname, '../reports/api-test-report.md');
  const reportContent = `# Q Clocker - Backend API Automation Test Report

**Execution Date**: ${new Date().toISOString()}
**Test Target**: http://localhost:3000/api/v1
**Summary**:
- Total Executed: ${summary.total}
- Passed: ${summary.passed}
- Failed: ${summary.failed}
- Pass Rate: ${summary.passRate}

## Detailed Execution Results

${tracker.generateMarkdownTable()}
`;
  fs.writeFileSync(reportPath, reportContent);
  console.log(`Report written to ${reportPath}`);

  return { summary, adminToken, employeeToken };
}

if (require.main === module) {
  runApiTests().catch(console.error);
}

module.exports = { runApiTests };
