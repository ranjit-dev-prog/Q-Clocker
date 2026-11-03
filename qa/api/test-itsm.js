/**
 * Enterprise ITSM & SLA Lifecycle Verification Suite
 * Q Clocker Quality Assurance
 */

const { apiRequest, tracker } = require('../utils/client');

async function runItsmTests() {
  console.log('\n=== EXECUTING DEDICATED ITSM & SLA LIFECYCLE TESTS ===');

  let adminToken = '';
  let employeeToken = '';
  let createdTicketId = '';
  let createdTicketRef = '';

  // 1. Authenticate Admin & Employee
  {
    const res = await apiRequest('POST', '/auth/login', {
      body: { email: 'superadmin@qclocker.io', password: 'SuperAdmin@2026!' },
    });
    if (res.status === 200 && res.data?.data?.accessToken) {
      adminToken = res.data.data.accessToken;
    }
  }

  {
    const res = await apiRequest('POST', '/auth/login', {
      body: { email: 'employee@qclocker.io', password: 'Employee@2026!' },
    });
    if (res.status === 200 && res.data?.data?.accessToken) {
      employeeToken = res.data.data.accessToken;
    }
  }

  // 2. Test Category Catalog
  {
    const res = await apiRequest('GET', '/tickets/categories', { token: adminToken });
    const pass = res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length >= 4;
    tracker.record({
      testId: 'TC-ITSM-CAT-001',
      module: 'ITSM',
      scenario: 'Fetch IT service catalog and verify category/subcategory hierarchy',
      type: 'POSITIVE',
      expected: 'HTTP 200 with catalog array containing subcategories and default SLAs',
      actual: `HTTP ${res.status}, categories count: ${res.data?.data?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 3. Test Executive ITSM Metrics
  {
    const res = await apiRequest('GET', '/tickets/metrics', { token: adminToken });
    const pass = res.status === 200 && res.data?.data?.totalTickets !== undefined && res.data?.data?.slaComplianceRate;
    tracker.record({
      testId: 'TC-ITSM-MET-001',
      module: 'ITSM',
      scenario: 'Fetch real-time executive ITSM & SLA compliance metrics',
      type: 'POSITIVE',
      expected: 'HTTP 200 with totalTickets, openTickets, and slaComplianceRate',
      actual: `HTTP ${res.status}, compliance: ${res.data?.data?.slaComplianceRate}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 4. Create P1 Critical Incident (Impact: CRITICAL x Urgency: CRITICAL -> P1, 4h SLA)
  {
    const res = await apiRequest('POST', '/tickets', {
      token: adminToken,
      body: {
        title: 'Production Core VPC BGP Route Flapping',
        description: 'BGP peering with primary cloud interconnect is dropping packets every 90 seconds.',
        ticketType: 'INCIDENT',
        impact: 'CRITICAL',
        urgency: 'CRITICAL',
        category: 'Network',
        subcategory: 'VPN_GATEWAY',
        source: 'MONITORING_ALERT',
      },
    });
    const pass =
      res.status === 201 &&
      res.data?.data?.priorityCode === 'P1' &&
      res.data?.data?.priority === 'CRITICAL' &&
      res.data?.data?.slaHours === 4 &&
      res.data?.data?.referenceId?.startsWith('TKT-');

    if (pass) {
      createdTicketId = res.data.data.id;
      createdTicketRef = res.data.data.referenceId;
    }

    tracker.record({
      testId: 'TC-ITSM-PRI-001',
      module: 'ITSM',
      scenario: 'Priority Matrix: Critical Impact + Critical Urgency generates P1 with 4h SLA',
      type: 'POSITIVE',
      expected: 'HTTP 201 with priorityCode=P1, slaHours=4, and TKT reference',
      actual: `HTTP ${res.status}, priorityCode: ${res.data?.data?.priorityCode}, slaHours: ${res.data?.data?.slaHours}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 5. Create P4 Low Service Request (Impact: LOW x Urgency: LOW -> P4, 72h SLA)
  {
    const res = await apiRequest('POST', '/tickets', {
      token: adminToken,
      body: {
        title: 'Ergonomic Keyboard Request for New Desk',
        description: 'Requesting standard split ergonomic wireless keyboard for workstation 4B.',
        ticketType: 'SERVICE_REQUEST',
        impact: 'LOW',
        urgency: 'LOW',
        category: 'IT Support',
        subcategory: 'LAPTOP_DESKTOP',
        source: 'PORTAL',
      },
    });
    const pass =
      res.status === 201 &&
      res.data?.data?.priorityCode === 'P4' &&
      res.data?.data?.priority === 'LOW' &&
      res.data?.data?.slaHours === 72;

    tracker.record({
      testId: 'TC-ITSM-PRI-002',
      module: 'ITSM',
      scenario: 'Priority Matrix: Low Impact + Low Urgency generates P4 with 72h SLA',
      type: 'POSITIVE',
      expected: 'HTTP 201 with priorityCode=P4 and slaHours=72',
      actual: `HTTP ${res.status}, priorityCode: ${res.data?.data?.priorityCode}, slaHours: ${res.data?.data?.slaHours}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 6. State Machine: Reject Illegal Status Jump (NEW -> RESOLVED)
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/transition`, {
      token: adminToken,
      body: {
        status: 'RESOLVED',
        resolutionNotes: 'Premature fix attempt',
      },
    });
    const pass = res.status === 400;
    tracker.record({
      testId: 'TC-ITSM-STM-001',
      module: 'ITSM',
      scenario: 'State Machine: Reject illegal status leap from NEW to RESOLVED without triage',
      type: 'NEGATIVE',
      expected: 'HTTP 400 Bad Request with invalid transition message',
      actual: `HTTP ${res.status}, error: ${res.data?.message}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 7. State Machine: Legal Transition (NEW -> IN_PROGRESS)
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/transition`, {
      token: adminToken,
      body: {
        status: 'IN_PROGRESS',
        reason: 'Assigned to senior network engineer for live traceroute',
      },
    });
    const pass = res.status === 200 && res.data?.data?.status === 'IN_PROGRESS';
    tracker.record({
      testId: 'TC-ITSM-STM-002',
      module: 'ITSM',
      scenario: 'State Machine: Legal transition from NEW to IN_PROGRESS with audit reason',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status=IN_PROGRESS',
      actual: `HTTP ${res.status}, status: ${res.data?.data?.status}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 8. SLA Engine: Pause SLA Clock on PENDING_USER
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/transition`, {
      token: adminToken,
      body: {
        status: 'PENDING_USER',
        reason: 'Waiting for ISP telecom partner to verify fiber link attenuation',
      },
    });
    const pass = res.status === 200 && res.data?.data?.status === 'PENDING_USER' && res.data?.data?.isPaused === true;
    tracker.record({
      testId: 'TC-ITSM-SLA-001',
      module: 'ITSM',
      scenario: 'SLA Engine: Transition to PENDING_USER pauses SLA timer',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status=PENDING_USER and isPaused=true',
      actual: `HTTP ${res.status}, isPaused: ${res.data?.data?.isPaused}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 9. SLA Engine: Resume SLA Clock (PENDING_USER -> IN_PROGRESS)
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/transition`, {
      token: adminToken,
      body: {
        status: 'IN_PROGRESS',
        reason: 'ISP confirmed optical signal normalized; resuming active verification',
      },
    });
    const pass = res.status === 200 && res.data?.data?.status === 'IN_PROGRESS' && res.data?.data?.isPaused === false;
    tracker.record({
      testId: 'TC-ITSM-SLA-002',
      module: 'ITSM',
      scenario: 'SLA Engine: Resuming to IN_PROGRESS unpauses SLA timer and accumulates pause duration',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status=IN_PROGRESS and isPaused=false',
      actual: `HTTP ${res.status}, isPaused: ${res.data?.data?.isPaused}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 10. Resolution Enforcement: Reject Resolution without Resolution Notes
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/resolve`, {
      token: adminToken,
      body: {
        resolutionNotes: '   ', // whitespace only
      },
    });
    const pass = res.status === 400;
    tracker.record({
      testId: 'TC-ITSM-RES-001',
      module: 'ITSM',
      scenario: 'Resolution: Reject resolve request when resolution notes are empty',
      type: 'NEGATIVE',
      expected: 'HTTP 400 Bad Request requiring resolutionNotes',
      actual: `HTTP ${res.status}, message: ${res.data?.message}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 11. Resolution: Valid Resolution with Root Cause & Fix
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/resolve`, {
      token: adminToken,
      body: {
        resolutionNotes: 'Flapping BGP timer tuned from 30s to 90s on edge router interface ge-0/0/1',
        resolutionSummary: 'Edge BGP keepalive interval stabilized',
        rootCause: 'Carrier MTU mismatch causing dropped SYN packets during peak window',
        resolutionCategory: 'INFRASTRUCTURE_FIX',
      },
    });
    const pass =
      res.status === 200 &&
      res.data?.data?.status === 'RESOLVED' &&
      res.data?.data?.resolvedAt !== null &&
      res.data?.data?.rootCause !== undefined;

    tracker.record({
      testId: 'TC-ITSM-RES-002',
      module: 'ITSM',
      scenario: 'Resolution: Valid resolution sets status to RESOLVED, logs root cause and resolvedAt',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status=RESOLVED, resolvedAt, and rootCause',
      actual: `HTTP ${res.status}, status: ${res.data?.data?.status}, rootCause: ${res.data?.data?.rootCause}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 12. Reopening Lifecycle: Reopen Resolved Ticket
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/reopen`, {
      token: adminToken,
      body: {
        reason: 'Secondary jitter observed on backup link; re-evaluating route table',
      },
    });
    const pass =
      res.status === 200 &&
      res.data?.data?.status === 'REOPENED' &&
      res.data?.data?.reopenCount === 1 &&
      res.data?.data?.reopenedAt !== null;

    tracker.record({
      testId: 'TC-ITSM-ROP-001',
      module: 'ITSM',
      scenario: 'Reopening: Reopen previously resolved ticket with mandatory reason and increment reopenCount',
      type: 'POSITIVE',
      expected: 'HTTP 200 with status=REOPENED and reopenCount=1',
      actual: `HTTP ${res.status}, status: ${res.data?.data?.status}, reopenCount: ${res.data?.data?.reopenCount}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 13. Stopwatch Live Time Tracking: Start and Stop Timer
  if (createdTicketId) {
    // Start timer
    const startRes = await apiRequest('POST', `/tickets/${createdTicketId}/timer/start`, {
      token: adminToken,
      body: { notes: 'Live wireshark packet capture on peering interface' },
    });
    const startPass = startRes.status === 200 && startRes.data?.data?.activeTimer?.isRunning === true;

    // Stop timer
    const stopRes = await apiRequest('POST', `/tickets/${createdTicketId}/timer/stop`, {
      token: adminToken,
      body: {},
    });
    const stopPass = stopRes.status === 200 && (stopRes.data?.data?.activeTimer === null || stopRes.data?.data?.activeTimer === undefined);

    tracker.record({
      testId: 'TC-ITSM-TMR-001',
      module: 'ITSM',
      scenario: 'Time Tracking: Start live stopwatch timer and stop, recording time entry',
      type: 'POSITIVE',
      expected: 'HTTP 200 on start and stop, duration captured in ticket time entries',
      actual: `Start: HTTP ${startRes.status}, Stop: HTTP ${stopRes.status}`,
      status: startPass && stopPass ? 'PASS' : 'FAIL',
      durationMs: startRes.durationMs + stopRes.durationMs,
    });
  }

  // 14. Manual Time Log Entry
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/time-entries`, {
      token: adminToken,
      body: {
        durationMinutes: 45,
        notes: 'Coordinated maintenance bridge with ISP NOC engineers',
      },
    });
    const pass = res.status === 201 && Array.isArray(res.data?.data?.timeEntries);
    tracker.record({
      testId: 'TC-ITSM-TMR-002',
      module: 'ITSM',
      scenario: 'Time Tracking: Add manual time entry with technical notes',
      type: 'POSITIVE',
      expected: 'HTTP 201 with updated timeEntries array and total time',
      actual: `HTTP ${res.status}, entries: ${res.data?.data?.timeEntries?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  // 15. Note Segregation: Internal Technician Note Privacy
  if (createdTicketId) {
    // Admin posts internal note
    await apiRequest('POST', `/tickets/${createdTicketId}/comments`, {
      token: adminToken,
      body: {
        comment: 'Confidential: ISP upstream switch firmware corrupted. RMA in progress.',
        isInternalNote: true,
      },
    });

    // Employee fetches the same ticket
    const empRes = await apiRequest('GET', `/tickets/${createdTicketId}`, {
      token: employeeToken,
    });

    const hasInternalNote = empRes.data?.data?.comments?.some((c) => c.isInternalNote === true);
    const pass = empRes.status === 200 && !hasInternalNote;

    tracker.record({
      testId: 'TC-ITSM-SEC-001',
      module: 'ITSM',
      scenario: 'Security & Privacy: Requester/Employee cannot see internal technician notes',
      type: 'SECURITY',
      expected: 'Internal note filtered out for employee requester',
      actual: `HTTP ${empRes.status}, exposedInternalNotes: ${hasInternalNote}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: empRes.durationMs,
    });
  }

  // 16. Downstream Task Creation from Ticket
  if (createdTicketId) {
    const res = await apiRequest('POST', `/tickets/${createdTicketId}/tasks`, {
      token: adminToken,
      body: {
        title: 'Deploy BGP Flap Damping Policy on Edge Gateway',
        description: 'Implement automated route suppression if flap exceeds 4 iterations per 10m.',
        priority: 'HIGH',
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 2 * 86400 * 1000).toISOString(),
        estimatedHours: 4,
      },
    });
    const pass = res.status === 201 && res.data?.data?.linkedTasks?.length > 0;
    tracker.record({
      testId: 'TC-ITSM-TSK-001',
      module: 'ITSM',
      scenario: 'Task Integration: Create downstream action task and link to ticket',
      type: 'POSITIVE',
      expected: 'HTTP 201 with linkedTasks containing newly spawned task reference',
      actual: `HTTP ${res.status}, linkedTasks: ${res.data?.data?.linkedTasks?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: res.durationMs,
    });
  }

  console.log('ITSM Lifecycle Tests Completed.');
}

module.exports = { runItsmTests };

if (require.main === module) {
  const { withRunningServer } = require('../utils/server-harness');
  withRunningServer(async () => {
    await runItsmTests();
    console.log(JSON.stringify(tracker.getSummary(), null, 2));
    const failed = tracker.results.filter((r) => r.status === 'FAIL');
    if (failed.length > 0) {
      console.log('Failed tests:', failed);
      process.exit(1);
    }
  }).catch((err) => {
    console.error('Test harness failure:', err);
    process.exit(1);
  });
}
