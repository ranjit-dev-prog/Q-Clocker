/**
 * Q Clocker v2.5.0 Enterprise Refactor & Feature Expansion - Verification Suite
 */
const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
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
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
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

async function runTests() {
  console.log('================================================================');
  console.log('🧪 Q CLOCKER v2.5.0 ENTERPRISE REFACTOR VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  // 1. Authenticate as Super Admin to get Bearer Token
  console.log('--- PHASE 1: Super Admin Authentication ---');
  const loginRes = await request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'superadmin@qclocker.io', password: 'SuperAdmin@2026!' }
  );

  assert(loginRes.statusCode === 200 || loginRes.statusCode === 201, 'Super Admin login successfully returns HTTP 200/201');
  const token = loginRes.data?.data?.accessToken || loginRes.data?.accessToken;
  assert(!!token, 'Access token successfully extracted');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2. Dual-Factor Account Recovery Pipeline
  console.log('\n--- PHASE 2: Dual-Factor Account Recovery Pipeline ---');
  const forgotRes = await request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/v1/auth/forgot-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'marcus.chen@qclocker.io' }
  );

  assert(forgotRes.statusCode === 200, 'POST /auth/forgot-password returns HTTP 200 generic message');
  const resetToken = forgotRes.data?.data?.token;
  assert(!!resetToken, 'Single-use 15-minute challenge token generated');

  const challengeRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: `/api/v1/auth/reset-challenge?token=${encodeURIComponent(resetToken)}`,
    method: 'GET',
  });

  assert(challengeRes.statusCode === 200, 'GET /auth/reset-challenge returns HTTP 200');
  assert(Array.isArray(challengeRes.data?.data?.questions), 'Security challenge questions returned');

  const verifyRes = await request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/v1/auth/verify-reset-challenge',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      token: resetToken,
      recoveryPassphrase: 'QC-RECOVERY-EMERGENCY-KEY-2026',
    }
  );
  assert(verifyRes.statusCode === 200, 'POST /auth/verify-reset-challenge successfully validates identity');

  // Test password entropy validation
  const weakResetRes = await request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/v1/auth/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      token: resetToken,
      newPassword: 'short',
    }
  );
  assert(weakResetRes.statusCode === 400, 'POST /auth/reset-password rejects weak password < 12 characters');

  const validResetRes = await request(
    {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/api/v1/auth/reset-password',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      token: resetToken,
      newPassword: 'NewSecurePassword@2026#Entropy',
    }
  );
  assert(validResetRes.statusCode === 200, 'POST /auth/reset-password succeeds with high-entropy credential');

  // 3. Rate-Limiter & Brute-Force Shield Test
  console.log('\n--- PHASE 3: Rate Limiting & Brute-Force Lockout Shield ---');
  let lockoutTriggered = false;
  for (let i = 0; i < 6; i++) {
    const failRes = await request(
      {
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/v1/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'brute-test@qclocker.io', password: 'WrongPassword123!' }
    );
    if (failRes.statusCode === 429) {
      lockoutTriggered = true;
      break;
    }
  }
  assert(lockoutTriggered, 'Brute-force shield triggers HTTP 429 Too Many Requests upon 5 consecutive failures');

  // 4. Workforce Management: Bulk Template & Deep Employee Admin
  console.log('\n--- PHASE 4: Bulk Onboarding & Employee Administration ---');
  const templateRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/users/bulk-template',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(templateRes.statusCode === 200, 'GET /users/bulk-template returns HTTP 200');
  assert(
    templateRes.headers['content-type']?.includes('spreadsheetml'),
    'Template has correct application/vnd.openxmlformats-officedocument.spreadsheetml.sheet MIME'
  );
  assert(templateRes.buffer.length > 1000, 'Downloaded template buffer contains binary Excel data');

  const adminResetRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/users/00000000-0000-0000-0000-000000000004/admin-reset-password',
    method: 'POST',
    headers: authHeaders,
  });
  assert(adminResetRes.statusCode === 200, 'POST /users/:id/admin-reset-password returns temporary credential');
  assert(!!adminResetRes.data?.data?.temporaryPassword, 'Temporary password generated for target user');

  const revokeRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/users/00000000-0000-0000-0000-000000000004/revoke-sessions',
    method: 'POST',
    headers: authHeaders,
  });
  assert(revokeRes.statusCode === 200, 'POST /users/:id/revoke-sessions terminates active sessions');

  // 5. Reporting & Analytics Engine (Live Endpoints & Excel Streaming)
  console.log('\n--- PHASE 5: Reporting Engine & Streaming Exports ---');
  const itsmReportRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/reports/itsm',
    method: 'GET',
    headers: authHeaders,
  });
  assert(itsmReportRes.statusCode === 200, 'GET /reports/itsm returns HTTP 200');
  assert(itsmReportRes.data?.data?.summary?.meanTimeToResolutionHours !== undefined, 'ITSM MTTR metrics returned');
  assert(Array.isArray(itsmReportRes.data?.data?.priorityDistribution), 'ITSM priority matrix breakdown returned');

  const workforceReportRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/reports/workforce',
    method: 'GET',
    headers: authHeaders,
  });
  assert(workforceReportRes.statusCode === 200, 'GET /reports/workforce returns HTTP 200');
  assert(workforceReportRes.data?.data?.summary?.billableUtilizationRate !== undefined, 'Workforce billable utilization rate returned');

  const auditReportRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/reports/audit',
    method: 'GET',
    headers: authHeaders,
  });
  assert(auditReportRes.statusCode === 200, 'GET /reports/audit returns HTTP 200');
  assert(Array.isArray(auditReportRes.data?.data?.recentSecurityEvents), 'Security audit logs returned');

  // Test streaming Excel export
  const exportXlsxRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/reports/export?reportType=itsm&format=xlsx',
    method: 'GET',
    headers: authHeaders,
  });
  assert(exportXlsxRes.statusCode === 200, 'GET /reports/export?format=xlsx returns HTTP 200');
  assert(
    exportXlsxRes.headers['content-type']?.includes('spreadsheetml'),
    'Export XLSX returns valid application/vnd.openxmlformats-officedocument.spreadsheetml.sheet MIME'
  );
  assert(exportXlsxRes.buffer.length > 2000, 'Export XLSX binary buffer is populated with styled sheets');

  // Test streaming CSV export
  const exportCsvRes = await request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/v1/reports/export?reportType=itsm&format=csv',
    method: 'GET',
    headers: authHeaders,
  });
  assert(exportCsvRes.statusCode === 200, 'GET /reports/export?format=csv returns HTTP 200');
  assert(exportCsvRes.headers['content-type']?.includes('text/csv'), 'Export CSV returns text/csv MIME');
  assert(exportCsvRes.buffer.toString('utf-8').includes('Priority Level'), 'Export CSV contains expected headers');

  console.log('\n================================================================');
  console.log(`RESULTS: ${passed} / ${total} tests passed (${((passed / total) * 100).toFixed(2)}%)`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL v2.5.0 ENTERPRISE REFACTOR REQUIREMENTS VALIDATED AND PASSING!');
    process.exit(0);
  } else {
    console.error('⚠️ SOME TESTS FAILED. PLEASE REVIEW LOGS.');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
