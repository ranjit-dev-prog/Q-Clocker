# Q Clocker - Backend API Automation Test Report

**Execution Date**: 2026-11-03T12:15:10.995Z
**Test Target**: http://localhost:3000/api/v1
**Summary**:
- Total Executed: 31
- Passed: 31
- Failed: 0
- Pass Rate: 100.00%

## Detailed Execution Results

| Test ID | Module | Scenario | Type | Expected | Actual | Status | Latency |
|---|---|---|---|---|---|---|---|
| TC-API-AUTH-001 | Auth | Super Admin login with valid credentials | POSITIVE | HTTP 200 with JWT accessToken and user object | HTTP 200, success: true | **PASS** | 27ms |
| TC-API-AUTH-002 | Auth | Standard Employee login with valid credentials | POSITIVE | HTTP 200 with employee role in token payload | HTTP 200, role: EMPLOYEE | **PASS** | 3ms |
| TC-API-AUTH-003 | Auth | Login with incorrect password | NEGATIVE | HTTP 401 Unauthorized | HTTP 401 | **PASS** | 62ms |
| TC-API-AUTH-004 | Auth | Login with empty payload | NEGATIVE | HTTP 400 Bad Request or 401 Unauthorized | HTTP 400 | **PASS** | 2ms |
| TC-API-AUTH-005 | Auth | Get authenticated user profile via /auth/me | POSITIVE | HTTP 200 with current user profile | HTTP 200, email: superadmin@qclocker.io | **PASS** | 2ms |
| TC-API-AUTH-006 | Auth | List active sessions for current user | POSITIVE | HTTP 200 with array of user sessions | HTTP 200, count: 1 | **PASS** | 1ms |
| TC-API-EMP-001 | Employees | Fetch aggregated enterprise workforce metrics | POSITIVE | HTTP 200 with totalEmployees, roleDistribution, departmentDistribution | HTTP 200, total: 4 | **PASS** | 2ms |
| TC-API-EMP-002 | Employees | Download bulk import CSV template | POSITIVE | HTTP 200 with CSV content-type and valid headers | HTTP 200, contains headers: true | **PASS** | 1ms |
| TC-API-EMP-003 | Employees | Bulk import preview with CSV formula injection sanitization | SECURITY | HTTP 200 with leading formula operator (=) stripped from fields | HTTP 200, sanitized name: "cmd\|' /C calc'!A0" | **PASS** | 2ms |
| TC-API-EMP-004 | Employees | Create new employee with random EMP- reference ID | POSITIVE | HTTP 201 with generated EMP-XXXXXX reference ID | HTTP 201, referenceId: EMP-H2GUCC | **PASS** | 2ms |
| TC-API-EMP-005 | Employees | Filter employee directory by keyword search | POSITIVE | HTTP 200 returning matching employee records | HTTP 200, matched count: 1 | **PASS** | 1ms |
| TC-API-EMP-006 | Employees | Safely archive employee without deleting historical data | POSITIVE | HTTP 200 with archived status confirmed | HTTP 200, message: Employee EMP-H2GUCC safely archived | **PASS** | 1ms |
| TC-API-EMP-007 | Employees | Reactivate an archived employee account | POSITIVE | HTTP 200 with active status restored | HTTP 200, message: Employee EMP-H2GUCC reactivated | **PASS** | 1ms |
| TC-API-DEP-001 | Departments | List all company departments | POSITIVE | HTTP 200 with list of departments | HTTP 200, count: 4 | **PASS** | 1ms |
| TC-API-DEP-002 | Departments | Retrieve complete organizational hierarchy chart | POSITIVE | HTTP 200 with nested department/team hierarchy departments | HTTP 200, nodes: 4 | **PASS** | 1ms |
| TC-API-DSG-001 | Designations | List corporate job designations | POSITIVE | HTTP 200 with designation records | HTTP 200, count: 4 | **PASS** | 1ms |
| TC-API-DSG-002 | Designations | Create new designation with random DSG- reference ID | POSITIVE | HTTP 201 with DSG-XXXXXX reference ID | HTTP 201, referenceId: DSG-CUNLMM | **PASS** | 1ms |
| TC-API-ROL-001 | Roles | List all RBAC roles (10 enterprise roles) | POSITIVE | HTTP 200 with at least 8 enterprise roles | HTTP 200, roles count: 10 | **PASS** | 1ms |
| TC-API-PRM-001 | Permissions | List granular system permission catalog | POSITIVE | HTTP 200 with granular module.resource.action permissions | HTTP 200, count: 41 | **PASS** | 1ms |
| TC-API-PRM-002 | Permissions | Retrieve complete RBAC permission matrix | POSITIVE | HTTP 200 with matrix mapping each role to granted permissions | HTTP 200, matrix roles: 10 | **PASS** | 1ms |
| TC-API-TSK-001 | Tasks | Create task with random TSK- reference ID | POSITIVE | HTTP 201 with TSK-XXXXXX reference ID | HTTP 201, referenceId: TSK-YZDRBS | **PASS** | 2ms |
| TC-API-TSK-002 | Tasks | Fetch Kanban board grouped by status columns | POSITIVE | HTTP 200 with backlog, inProgress, review, completed columns | HTTP 200, columns: backlog, inProgress, review, completed, stats | **PASS** | 1ms |
| TC-API-TSK-003 | Tasks | Update task status via drag-and-drop PATCH | POSITIVE | HTTP 200 with updated status COMPLETED | HTTP 200, status: COMPLETED | **PASS** | 2ms |
| TC-API-TKT-001 | Tickets | Create ITSM ticket with SLA calculation and TKT- reference | POSITIVE | HTTP 201 with TKT-XXXXXX reference and slaResolutionHours | HTTP 201, referenceId: TKT-YSFQ9G | **PASS** | 1ms |
| TC-API-TKT-002 | Tickets | Fetch ITSM & SLA compliance metrics | POSITIVE | HTTP 200 with totalTickets, openTickets, slaComplianceRate | HTTP 200, total: 4 | **PASS** | 1ms |
| TC-API-TKT-003 | Tickets | Resolve ticket with root cause analysis notes | POSITIVE | HTTP 200 with status RESOLVED and resolutionNotes stored | HTTP 200, status: RESOLVED | **PASS** | 1ms |
| TC-API-WLG-001 | WorkLogs | Record daily work log with WLG- reference ID | POSITIVE | HTTP 201 with WLG-XXXXXX reference and hours recorded | HTTP 201, referenceId: WLG-D9F8XC | **PASS** | 1ms |
| TC-API-WLG-002 | WorkLogs | Get aggregated work hours for specific date | POSITIVE | HTTP 200 with totalHours and logs list | HTTP 200, totalHours: 11.50 | **PASS** | 1ms |
| TC-API-NEG-001 | Security | Access protected route without Authorization header | NEGATIVE | HTTP 401 Unauthorized | HTTP 401 | **PASS** | 1ms |
| TC-API-NEG-002 | Validation | Pass malformed UUID in route parameter | NEGATIVE | HTTP 400 or 404 with error message | HTTP 404 | **PASS** | 1ms |
| TC-API-NEG-003 | Validation | Submit negative work log hours (boundary check) | BOUNDARY | HTTP 400 Bad Request with validation message | HTTP 400 | **PASS** | 1ms |

