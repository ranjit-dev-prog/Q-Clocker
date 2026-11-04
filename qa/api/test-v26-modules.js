/**
 * Q Clocker Enterprise v2.5.0 / v2.6.0 Feature Expansion Automated Test Suite
 * Tests:
 * 1. Comprehensive System Health (/api/v1/health)
 * 2. Enterprise Payroll Engine (/api/v1/payroll/...)
 * 3. Workforce Lifecycle & Social Events (/api/v1/lifecycle/...)
 * 4. ITSM Universal Queues & Category Catalog (/api/v1/tickets/categories)
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let adminToken = '';
let employeeToken = '';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const payload = data ? JSON.stringify(data) : null;
    if (payload) {
      headers['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(body);
          } catch {
            parsed = body;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('========================================================');
  console.log('Q CLOCKER ENTERPRISE: EXPANSION & INTEGRATION QA TEST');
  console.log('========================================================\n');

  // Step 1: Health Telemetry
  console.log('SECTION 1: System Health Endpoint (/api/v1/health)');
  try {
    const healthRes = await request('GET', '/api/v1/health');
    assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
    assert(healthRes.body.status === 'ok', 'Health status is ok');
    assert(healthRes.body.version === '2.5.0-enterprise', 'Version is 2.5.0-enterprise');
    assert(healthRes.body.components.frontend.url === 'http://localhost:4200', 'Frontend component URL configured');
    assert(healthRes.body.components.backend.status === 'online', 'Backend core status is online');
    assert(healthRes.body.components.drizzleOrm.tablesMapped >= 30, 'Drizzle ORM mapped tables reported');
    assert(healthRes.body.components.payrollEngine.status === 'active', 'Payroll engine status is active');
    assert(healthRes.body.components.lifecycleService.status === 'active', 'Lifecycle service status is active');
  } catch (err) {
    assert(false, `Health test threw error: ${err.message}`);
  }

  // Step 2: Authentication (Admin and Employee)
  console.log('\nSECTION 2: Authentication for Role-Based Tests');
  try {
    const adminLogin = await request('POST', '/api/v1/auth/login', {
      email: 'alexander.vance@qclocker.io',
      password: 'Password123!',
    });
    assert(adminLogin.status === 200 && adminLogin.body.data?.tokens?.accessToken, 'Super Admin logged in successfully');
    adminToken = adminLogin.body.data.tokens.accessToken;

    const empLogin = await request('POST', '/api/v1/auth/login', {
      email: 'david.ross@qclocker.io',
      password: 'Password123!',
    });
    assert(empLogin.status === 200 && empLogin.body.data?.tokens?.accessToken, 'Employee logged in successfully');
    employeeToken = empLogin.body.data.tokens.accessToken;
  } catch (err) {
    assert(false, `Auth threw error: ${err.message}`);
  }

  // Step 3: Payroll Engine Tests
  console.log('\nSECTION 3: Enterprise Bulk Payroll Engine (/api/v1/payroll)');
  try {
    // 3.1 Template download
    const tplRes = await request('GET', '/api/v1/payroll/template', null, adminToken);
    assert(tplRes.status === 200, 'Payroll Excel template download responds HTTP 200');

    // 3.2 List Batches
    const batchesRes = await request('GET', '/api/v1/payroll/batches', null, adminToken);
    assert(batchesRes.status === 200, 'Admin can list all payroll batches');
    assert(Array.isArray(batchesRes.body), 'Batches returned as array');

    // 3.3 Employee My-Payslips
    const payslipsRes = await request('GET', '/api/v1/payroll/my-payslips', null, employeeToken);
    assert(payslipsRes.status === 200, 'Employee can query own payslips');
    assert(Array.isArray(payslipsRes.body), 'Payslips returned as array');
    if (payslipsRes.body.length > 0) {
      const p = payslipsRes.body[0];
      assert(p.grossEarnings > 0 && p.netSalary > 0, `Payslip contains valid numbers (Net: $${p.netSalary})`);

      // 3.4 Download PDF
      const pdfRes = await request('GET', `/api/v1/payroll/payslips/${p.id}/download`, null, employeeToken);
      assert(pdfRes.status === 200, 'PDF payslip generated and downloaded successfully');
      assert(pdfRes.headers['content-type'] === 'application/pdf', 'Response is application/pdf');
    }

    // 3.5 Tax Declaration
    const taxGet = await request('GET', '/api/v1/payroll/tax-declaration', null, employeeToken);
    assert(taxGet.status === 200, 'Employee can retrieve tax declaration');

    const taxSave = await request('POST', '/api/v1/payroll/tax-declaration', {
      regime: 'NEW',
      section80c: 150000,
      section80d: 25000,
      hraRentPaid: 120000,
      homeLoanInterest: 0,
      financialYear: '2026-2027',
    }, employeeToken);
    assert(taxSave.status === 200 || taxSave.status === 201, 'Employee can submit updated tax savings declaration');
  } catch (err) {
    assert(false, `Payroll test threw error: ${err.message}`);
  }

  // Step 4: Workforce Lifecycle & Social Events
  console.log('\nSECTION 4: Workforce Lifecycle & Social Engine (/api/v1/lifecycle)');
  try {
    // 4.1 Celebrations Feed
    const feedRes = await request('GET', '/api/v1/lifecycle/celebrations', null, employeeToken);
    assert(feedRes.status === 200, 'Celebrations feed retrieved successfully');
    assert(Array.isArray(feedRes.body) && feedRes.body.length > 0, 'Feed contains active milestone events');

    // 4.2 1-Click Congratulate
    if (feedRes.body.length > 0) {
      const event = feedRes.body[0];
      const congRes = await request('POST', `/api/v1/lifecycle/events/${event.id}/congratulate`, {}, employeeToken);
      assert(congRes.status === 200, 'Peer 1-click congratulations submitted');
      assert(congRes.body.success === true && congRes.body.count > 0, `Cheers counter incremented (Count: ${congRes.body.count})`);
    }

    // 4.3 HR Reminders
    const remindersRes = await request('GET', '/api/v1/lifecycle/reminders', null, adminToken);
    assert(remindersRes.status === 200, 'HR Admin can access compliance & probation reminders');
    assert(Array.isArray(remindersRes.body) && remindersRes.body.length > 0, 'Reminders list contains tracked deadlines');

    if (remindersRes.body.length > 0) {
      const r = remindersRes.body[0];
      // Notify alert
      const notifyRes = await request('POST', `/api/v1/lifecycle/reminders/${r.id}/notify`, {}, adminToken);
      assert(notifyRes.status === 200, 'Dispatched push notification reminder');

      // Extend probation
      const extRes = await request('POST', `/api/v1/lifecycle/reminders/${r.id}/extend-probation`, {
        newEndDate: '2027-02-15',
        reason: 'Performance evaluation review extension per technical committee',
      }, adminToken);
      assert(extRes.status === 200, 'Extended probation with mandatory audit reason');

      // Resolve reminder
      const resRes = await request('POST', `/api/v1/lifecycle/reminders/${r.id}/resolve`, {}, adminToken);
      assert(resRes.status === 200, 'Compliance reminder marked resolved');
    }
  } catch (err) {
    assert(false, `Lifecycle test threw error: ${err.message}`);
  }

  // Step 5: ITSM Universal Queues & Category Catalog
  console.log('\nSECTION 5: ITSM Universal Categories & Queues (/api/v1/tickets/categories)');
  try {
    const catRes = await request('GET', '/api/v1/tickets/categories', null, employeeToken);
    assert(catRes.status === 200, 'Ticket categories catalog responds HTTP 200');
    assert(Array.isArray(catRes.body), 'Categories catalog is an array');

    const codes = catRes.body.map((c) => c.code);
    assert(codes.includes('IT_SUPPORT'), 'IT Support queue category present');
    assert(codes.includes('HR_SUPPORT'), 'HR Desk queue category present');
    assert(codes.includes('FACILITY_ADMIN'), 'Facility & Admin Desk queue category present');
    assert(codes.includes('CYBERSECURITY'), 'Cybersecurity queue category present');
  } catch (err) {
    assert(false, `ITSM Categories threw error: ${err.message}`);
  }

  // Summary
  console.log('\n========================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED:      ${passedTests}`);
  console.log(`FAILED:      ${failedTests}`);
  console.log(`SUCCESS:     ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('========================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
