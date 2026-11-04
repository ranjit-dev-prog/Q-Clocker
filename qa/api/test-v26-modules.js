/**
 * Q Clocker Enterprise v2.5.0 / v2.6.0 Feature Expansion Automated Test Suite
 * Tests:
 * 1. Comprehensive System Health (/api/v1/health)
 * 2. Enterprise Payroll Engine (/api/v1/payroll/...)
 * 3. Workforce Lifecycle & Social Events (/api/v1/lifecycle/...)
 * 4. ITSM Universal Queues & Category Catalog (/api/v1/tickets/categories)
 */

const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: 3000,
      ...options,
    };
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const rawBuffer = Buffer.concat(chunks);
        let parsed = null;
        try {
          parsed = JSON.parse(rawBuffer.toString('utf-8'));
        } catch {
          parsed = null;
        }

        // Auto-unwrap NestJS TransformInterceptor response envelope { data: ... }
        const payload = parsed && parsed.data !== undefined ? parsed.data : parsed;

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: payload,
          raw: parsed,
          buffer: rawBuffer,
        });
      });
    });
    req.on('error', reject);
    if (body) {
      if (typeof body === 'string') {
        req.write(body);
      } else if (Buffer.isBuffer(body)) {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function run() {
  console.log('================================================================');
  console.log('🧪 Q CLOCKER ENTERPRISE: EXPANSION & INTEGRATION QA TEST');
  console.log('================================================================\n');

  // Step 1: Health Telemetry
  console.log('--- SECTION 1: System Health Endpoint (/api/v1/health) ---');
  try {
    const healthRes = await request({
      path: '/api/v1/health',
      method: 'GET',
    });
    assert(healthRes.statusCode === 200, 'Health endpoint responds with HTTP 200');
    assert(healthRes.data?.status === 'ok', 'Health status is ok');
    assert(healthRes.data?.version === '2.5.0-enterprise', 'Version is 2.5.0-enterprise');
    assert(healthRes.data?.components?.frontend?.url === 'http://localhost:4200', 'Frontend component URL configured');
    assert(healthRes.data?.components?.backend?.status === 'online', 'Backend core status is online');
    assert(healthRes.data?.components?.drizzleOrm?.tablesMapped >= 30, 'Drizzle ORM mapped tables reported');
    assert(healthRes.data?.components?.payrollEngine?.status === 'active', 'Payroll engine status is active');
    assert(healthRes.data?.components?.lifecycleService?.status === 'active', 'Lifecycle service status is active');
  } catch (err) {
    assert(false, `Health test threw error: ${err.message}`);
  }

  // Step 2: Authentication (Super Admin and Employee)
  console.log('\n--- SECTION 2: Authentication for Role-Based Tests ---');
  let adminToken = '';
  let employeeToken = '';
  try {
    const adminLogin = await request(
      {
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'superadmin@qclocker.io', password: 'SuperAdmin@2026!' }
    );
    assert(adminLogin.statusCode === 200 || adminLogin.statusCode === 201, 'Super Admin logged in successfully');
    adminToken = adminLogin.data?.tokens?.accessToken || adminLogin.data?.accessToken;
    assert(!!adminToken, 'Admin token extracted');

    const empLogin = await request(
      {
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'employee@qclocker.io', password: 'Employee@2026!' }
    );
    assert(empLogin.statusCode === 200 || empLogin.statusCode === 201, 'Employee (David Ross) logged in successfully');
    employeeToken = empLogin.data?.tokens?.accessToken || empLogin.data?.accessToken;
    assert(!!employeeToken, 'Employee token extracted');
  } catch (err) {
    assert(false, `Auth threw error: ${err.message}`);
  }

  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  };
  const empHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${employeeToken}`,
  };

  // Step 3: Payroll Engine Tests
  console.log('\n--- SECTION 3: Enterprise Bulk Payroll Engine (/api/v1/payroll) ---');
  try {
    // 3.1 Template download
    const tplRes = await request({
      path: '/api/v1/payroll/template',
      method: 'GET',
      headers: adminHeaders,
    });
    assert(tplRes.statusCode === 200, 'Payroll Excel template download responds HTTP 200');

    // 3.2 List Batches
    const batchesRes = await request({
      path: '/api/v1/payroll/batches',
      method: 'GET',
      headers: adminHeaders,
    });
    assert(batchesRes.statusCode === 200, 'Admin can list all payroll batches');
    assert(Array.isArray(batchesRes.data), 'Batches returned as array');

    // 3.3 Employee My-Payslips
    const payslipsRes = await request({
      path: '/api/v1/payroll/my-payslips',
      method: 'GET',
      headers: empHeaders,
    });
    assert(payslipsRes.statusCode === 200, 'Employee can query own payslips');
    assert(Array.isArray(payslipsRes.data), 'Payslips returned as array');

    if (payslipsRes.data?.length > 0) {
      const p = payslipsRes.data[0];
      assert(p.grossEarnings > 0 && p.netSalary > 0, `Payslip contains valid figures (Net: $${p.netSalary})`);

      // 3.4 Download PDF
      const pdfRes = await request({
        path: `/api/v1/payroll/payslips/${p.id}/download`,
        method: 'GET',
        headers: empHeaders,
      });
      if (pdfRes.statusCode !== 200) {
        console.log('      DEBUG PDF Download failed with:', pdfRes.statusCode, JSON.stringify(pdfRes.data));
      }
      assert(pdfRes.statusCode === 200, 'PDF payslip downloaded successfully');
      assert(pdfRes.headers['content-type'] === 'application/pdf', 'Response header is application/pdf');
    }

    // 3.5 Tax Declaration
    const taxGet = await request({
      path: '/api/v1/payroll/tax-declaration',
      method: 'GET',
      headers: empHeaders,
    });
    assert(taxGet.statusCode === 200, 'Employee can retrieve tax declaration');

    const taxSave = await request(
      {
        path: '/api/v1/payroll/tax-declaration',
        method: 'POST',
        headers: empHeaders,
      },
      {
        regime: 'NEW',
        section80c: 150000,
        section80d: 25000,
        hraRentPaid: 120000,
        homeLoanInterest: 0,
        financialYear: '2026-2027',
      }
    );
    assert(taxSave.statusCode === 200 || taxSave.statusCode === 201, 'Employee can submit updated tax savings declaration');
  } catch (err) {
    assert(false, `Payroll test threw error: ${err.message}`);
  }

  // Step 4: Workforce Lifecycle & Social Events
  console.log('\n--- SECTION 4: Workforce Lifecycle & Social Engine (/api/v1/lifecycle) ---');
  try {
    // 4.1 Celebrations Feed
    const feedRes = await request({
      path: '/api/v1/lifecycle/celebrations',
      method: 'GET',
      headers: empHeaders,
    });
    assert(feedRes.statusCode === 200, 'Celebrations feed retrieved successfully');
    assert(Array.isArray(feedRes.data) && feedRes.data.length > 0, 'Feed contains active milestone events');

    // 4.2 1-Click Congratulate
    if (feedRes.data?.length > 0) {
      const event = feedRes.data[0];
      const congRes = await request(
        {
          path: `/api/v1/lifecycle/events/${event.id}/congratulate`,
          method: 'POST',
          headers: empHeaders,
        },
        {}
      );
      assert(congRes.statusCode === 200, 'Peer 1-click congratulations submitted');
      assert(congRes.data?.success === true && congRes.data?.congratulationsCount > 0, `Cheers counter incremented (Count: ${congRes.data?.congratulationsCount})`);
    }

    // 4.3 HR Reminders
    const remindersRes = await request({
      path: '/api/v1/lifecycle/reminders',
      method: 'GET',
      headers: adminHeaders,
    });
    assert(remindersRes.statusCode === 200, 'HR Admin can access compliance & probation reminders');
    assert(Array.isArray(remindersRes.data) && remindersRes.data.length > 0, 'Reminders list contains tracked deadlines');

    if (remindersRes.data?.length > 0) {
      const r = remindersRes.data[0];
      // Notify alert
      const notifyRes = await request(
        {
          path: `/api/v1/lifecycle/reminders/${r.id}/notify`,
          method: 'POST',
          headers: adminHeaders,
        },
        {}
      );
      assert(notifyRes.statusCode === 200, 'Dispatched push notification reminder');

      // Extend probation
      const extRes = await request(
        {
          path: `/api/v1/lifecycle/reminders/${r.id}/extend-probation`,
          method: 'POST',
          headers: adminHeaders,
        },
        {
          newEndDate: '2027-02-15',
          reason: 'Performance evaluation review extension per technical committee',
        }
      );
      assert(extRes.statusCode === 200, 'Extended probation with mandatory audit reason');

      // Resolve reminder
      const resRes = await request(
        {
          path: `/api/v1/lifecycle/reminders/${r.id}/resolve`,
          method: 'POST',
          headers: adminHeaders,
        },
        {}
      );
      assert(resRes.statusCode === 200, 'Compliance reminder marked resolved');
    }
  } catch (err) {
    assert(false, `Lifecycle test threw error: ${err.message}`);
  }

  // Step 5: ITSM Universal Queues & Category Catalog
  console.log('\n--- SECTION 5: ITSM Universal Categories & Queues (/api/v1/tickets/categories) ---');
  try {
    const catRes = await request({
      path: '/api/v1/tickets/categories',
      method: 'GET',
      headers: empHeaders,
    });
    assert(catRes.statusCode === 200, 'Ticket categories catalog responds HTTP 200');
    assert(Array.isArray(catRes.data), 'Categories catalog is an array');

    const codes = catRes.data?.map((c) => c.code) || [];
    assert(codes.includes('IT_SUPPORT'), 'IT Support queue category present');
    assert(codes.includes('HR_SUPPORT'), 'HR Desk queue category present');
    assert(codes.includes('FACILITY_ADMIN'), 'Facility & Admin Desk queue category present');
    assert(codes.includes('CYBERSECURITY'), 'Cybersecurity queue category present');
  } catch (err) {
    assert(false, `ITSM Categories threw error: ${err.message}`);
  }

  // Summary
  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED:      ${passedTests}`);
  console.log(`FAILED:      ${failedTests}`);
  console.log(`SUCCESS:     ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
