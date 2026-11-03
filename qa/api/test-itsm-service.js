/**
 * Enterprise ITSM Service & Domain Logic Automated Test Suite
 * Tests: State Machine, SLA Priority Matrix, Dynamic SLA Evaluation,
 * Lifecycle Transitions, Time Tracking Stopwatch, and Note Privacy.
 */

const { tracker } = require('../utils/client');

async function runItsmDomainTests() {
  console.log('\n=== RUNNING ITSM SERVICE & STATE MACHINE AUTOMATED TESTS ===\n');

  // Load compiled backend services
  const { TicketStateMachineService } = require('../../backend/dist/src/modules/tickets/services/ticket-state-machine.service');
  const { TicketSlaService } = require('../../backend/dist/src/modules/tickets/services/ticket-sla.service');
  const { TicketsService } = require('../../backend/dist/src/modules/tickets/tickets.service');
  const {
    TicketStatus,
    TicketType,
    TicketImpact,
    TicketUrgency,
    TicketPriorityCode,
    Priority,
    SlaStatus,
    UserRole,
  } = require('../../backend/dist/src/common/enums');

  const stateMachine = new TicketStateMachineService();
  const slaService = new TicketSlaService();

  // Mock DatabaseService for TicketsService in-memory operations
  const mockDbService = {
    getDb: () => null,
    getConnectionStatus: () => false,
  };
  const ticketsService = new TicketsService(mockDbService, stateMachine, slaService);

  const technicianUser = {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'marcus.chen@qclocker.io',
    firstName: 'Marcus',
    lastName: 'Chen',
    role: UserRole.IT_MANAGER,
  };

  const employeeUser = {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'david.ross@qclocker.io',
    firstName: 'David',
    lastName: 'Ross',
    role: UserRole.EMPLOYEE,
  };

  // -------------------------------------------------------------
  // TEST GROUP 1: PRIORITY MATRIX & SLA TARGETS
  // -------------------------------------------------------------
  console.log('--- Group 1: Priority Matrix Calculations ---');

  // TC 1: Critical x Critical -> P1
  {
    const start = performance.now();
    const res = slaService.calculatePriority(TicketImpact.CRITICAL, TicketUrgency.CRITICAL);
    const pass = res.priorityCode === TicketPriorityCode.P1 && res.priority === Priority.CRITICAL;
    tracker.record({
      testId: 'TC-ITSM-PRI-001',
      module: 'ITSM Engine',
      scenario: 'Priority Matrix: Critical Impact x Critical Urgency maps to P1 Critical',
      type: 'POSITIVE',
      expected: 'priorityCode=P1, priority=CRITICAL',
      actual: `priorityCode=${res.priorityCode}, priority=${res.priority}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 2: High x Critical -> P2 High
  {
    const start = performance.now();
    const res = slaService.calculatePriority(TicketImpact.HIGH, TicketUrgency.CRITICAL);
    const pass = res.priorityCode === TicketPriorityCode.P2 && res.priority === Priority.HIGH;
    tracker.record({
      testId: 'TC-ITSM-PRI-002',
      module: 'ITSM Engine',
      scenario: 'Priority Matrix: High Impact x Critical Urgency maps to P2 High',
      type: 'POSITIVE',
      expected: 'priorityCode=P2, priority=HIGH',
      actual: `priorityCode=${res.priorityCode}, priority=${res.priority}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 3: Medium x Medium -> P3 Medium
  {
    const start = performance.now();
    const res = slaService.calculatePriority(TicketImpact.MEDIUM, TicketUrgency.MEDIUM);
    const pass = res.priorityCode === TicketPriorityCode.P3 && res.priority === Priority.MEDIUM;
    tracker.record({
      testId: 'TC-ITSM-PRI-003',
      module: 'ITSM Engine',
      scenario: 'Priority Matrix: Medium Impact x Medium Urgency maps to P3 Medium',
      type: 'POSITIVE',
      expected: 'priorityCode=P3, priority=MEDIUM',
      actual: `priorityCode=${res.priorityCode}, priority=${res.priority}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 4: Low x Low -> P4 Low
  {
    const start = performance.now();
    const res = slaService.calculatePriority(TicketImpact.LOW, TicketUrgency.LOW);
    const pass = res.priorityCode === TicketPriorityCode.P4 && res.priority === Priority.LOW;
    tracker.record({
      testId: 'TC-ITSM-PRI-004',
      module: 'ITSM Engine',
      scenario: 'Priority Matrix: Low Impact x Low Urgency maps to P4 Low',
      type: 'POSITIVE',
      expected: 'priorityCode=P4, priority=LOW',
      actual: `priorityCode=${res.priorityCode}, priority=${res.priority}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 5: SLA Target Hours
  {
    const start = performance.now();
    const p1Targets = slaService.getSlaTargets(TicketPriorityCode.P1);
    const p4Targets = slaService.getSlaTargets(TicketPriorityCode.P4);
    const pass =
      p1Targets.resolutionHours === 4 &&
      p1Targets.responseHours === 0.5 &&
      p4Targets.resolutionHours === 72 &&
      p4Targets.responseHours === 8;

    tracker.record({
      testId: 'TC-ITSM-SLA-001',
      module: 'ITSM Engine',
      scenario: 'SLA Targets: P1 (4h resolve, 30m response) vs P4 (72h resolve, 8h response)',
      type: 'POSITIVE',
      expected: 'P1: 4h/0.5h, P4: 72h/8h',
      actual: `P1: ${p1Targets.resolutionHours}h/${p1Targets.responseHours}h, P4: ${p4Targets.resolutionHours}h/${p4Targets.responseHours}h`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // -------------------------------------------------------------
  // TEST GROUP 2: STATE MACHINE TRANSITION RULES
  // -------------------------------------------------------------
  console.log('--- Group 2: State Machine Transition Matrix ---');

  // TC 6: Legal Transition NEW -> ASSIGNED
  {
    const start = performance.now();
    let threw = false;
    try {
      stateMachine.validateTransition({
        fromStatus: TicketStatus.NEW,
        toStatus: TicketStatus.ASSIGNED,
        actorRole: UserRole.IT_MANAGER,
        actorId: technicianUser.id,
      });
    } catch (e) {
      threw = true;
    }
    const canTrans = stateMachine.canTransition(TicketStatus.NEW, TicketStatus.ASSIGNED);
    const pass = !threw && canTrans === true;
    tracker.record({
      testId: 'TC-ITSM-STM-001',
      module: 'State Machine',
      scenario: 'State Transition: Legal transition NEW -> ASSIGNED by IT_MANAGER',
      type: 'POSITIVE',
      expected: 'validateTransition succeeds without error, canTransition=true',
      actual: `threw=${threw}, canTransition=${canTrans}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 7: Illegal Transition NEW -> RESOLVED (must throw BadRequestException)
  {
    const start = performance.now();
    let threw = false;
    let errorMessage = '';
    try {
      stateMachine.validateTransition({
        fromStatus: TicketStatus.NEW,
        toStatus: TicketStatus.RESOLVED,
        actorRole: UserRole.SUPER_ADMIN,
        actorId: technicianUser.id,
      });
    } catch (e) {
      threw = true;
      errorMessage = e.message;
    }
    const pass = threw && errorMessage.includes('Invalid status transition');
    tracker.record({
      testId: 'TC-ITSM-STM-002',
      module: 'State Machine',
      scenario: 'State Transition: Reject illegal jump NEW -> RESOLVED without triage',
      type: 'NEGATIVE',
      expected: 'Throws BadRequestException with invalid transition error',
      actual: `threw=${threw}, message=${errorMessage}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 8: Mandatory Resolution Notes Enforcement
  {
    const start = performance.now();
    let threw = false;
    let errorMessage = '';
    try {
      stateMachine.validateTransition({
        fromStatus: TicketStatus.IN_PROGRESS,
        toStatus: TicketStatus.RESOLVED,
        actorRole: UserRole.IT_MANAGER,
        actorId: technicianUser.id,
        resolutionNotes: '   ', // empty
      });
    } catch (e) {
      threw = true;
      errorMessage = e.message;
    }
    const pass = threw && errorMessage.includes('Resolution notes explaining the root cause');
    tracker.record({
      testId: 'TC-ITSM-STM-003',
      module: 'State Machine',
      scenario: 'Resolution Enforcement: Moving to RESOLVED without resolution notes is rejected',
      type: 'NEGATIVE',
      expected: 'Throws BadRequestException requiring resolution notes',
      actual: `threw=${threw}, message=${errorMessage}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 9: Dynamic SLA Evaluation for Paused States
  {
    const start = performance.now();
    const pausedEval = slaService.evaluateLiveSla({
      createdAt: new Date(Date.now() - 3600 * 1000),
      resolutionDueAt: new Date(Date.now() + 7 * 3600 * 1000),
      status: TicketStatus.PENDING_USER,
      slaPausedAt: new Date(Date.now() - 600 * 1000),
      slaPauseDurationSeconds: 600,
      slaHours: 8,
    });
    const pass = pausedEval.slaStatus === SlaStatus.PAUSED && pausedEval.slaBreached === false;

    tracker.record({
      testId: 'TC-ITSM-STM-004',
      module: 'State Machine',
      scenario: 'Dynamic SLA: Status PENDING_USER sets slaStatus=PAUSED',
      type: 'POSITIVE',
      expected: 'slaStatus=PAUSED, slaBreached=false',
      actual: `slaStatus=${pausedEval.slaStatus}, slaBreached=${pausedEval.slaBreached}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // -------------------------------------------------------------
  // TEST GROUP 3: TICKETS SERVICE WORKFLOWS
  // -------------------------------------------------------------
  console.log('--- Group 3: Tickets Service Workflows ---');

  let testTicket = null;

  // TC 10: Category Catalog
  {
    const start = performance.now();
    const categories = ticketsService.getCategories();
    const pass = Array.isArray(categories) && categories.length >= 4;
    tracker.record({
      testId: 'TC-ITSM-SVC-001',
      module: 'ITSM Service',
      scenario: 'Catalog: Retrieve categorized service taxonomy with subcategories and SLAs',
      type: 'POSITIVE',
      expected: 'Array of categories with length >= 4',
      actual: `Categories returned: ${categories?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 11: Create Incident with Reference ID and Calculated Priority
  {
    const start = performance.now();
    testTicket = await ticketsService.create(
      {
        title: 'Kubernetes Cluster CoreDNS Pod CrashLoopBackOff',
        description: 'CoreDNS replica pods in prod-east-01 failing health check probe.',
        ticketType: TicketType.INCIDENT,
        impact: TicketImpact.CRITICAL,
        urgency: TicketUrgency.CRITICAL,
        category: 'Infrastructure',
        subcategory: 'KUBERNETES_CONTAINERS',
      },
      employeeUser,
    );

    const pass =
      testTicket &&
      testTicket.referenceId?.startsWith('TKT-') &&
      testTicket.priorityCode === TicketPriorityCode.P1 &&
      testTicket.priority === Priority.CRITICAL &&
      testTicket.slaHours === 4 &&
      testTicket.status === TicketStatus.NEW;

    tracker.record({
      testId: 'TC-ITSM-SVC-002',
      module: 'ITSM Service',
      scenario: 'Create Incident: Generates random reference ID, P1 matrix priority, and 4h SLA',
      type: 'POSITIVE',
      expected: 'referenceId=TKT-xxxx, priorityCode=P1, slaHours=4, status=NEW',
      actual: `referenceId=${testTicket.referenceId}, priorityCode=${testTicket.priorityCode}, slaHours=${testTicket.slaHours}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 12: Transition to ASSIGNED then IN_PROGRESS
  {
    const start = performance.now();
    // Move to ASSIGNED
    await ticketsService.transitionStatus(
      testTicket.id,
      {
        status: TicketStatus.ASSIGNED,
        reason: 'Assigned to Marcus Chen for network triage',
      },
      technicianUser,
    );

    // Move to IN_PROGRESS
    const updated = await ticketsService.transitionStatus(
      testTicket.id,
      {
        status: TicketStatus.IN_PROGRESS,
        reason: 'Technician analyzing kubelet container logs',
      },
      technicianUser,
    );

    const pass =
      updated.status === TicketStatus.IN_PROGRESS &&
      updated.history?.some((h) => h.fieldChanged === 'STATUS' && h.newValue === 'IN_PROGRESS');

    testTicket = updated;

    tracker.record({
      testId: 'TC-ITSM-SVC-003',
      module: 'ITSM Service',
      scenario: 'Transition to IN_PROGRESS: Updates status and writes audit log to ticket history',
      type: 'POSITIVE',
      expected: 'status=IN_PROGRESS and history event recorded',
      actual: `status=${updated.status}, historyCount=${updated.history?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 13: Pause SLA Clock on PENDING_USER
  {
    const start = performance.now();
    const updated = await ticketsService.transitionStatus(
      testTicket.id,
      {
        status: TicketStatus.PENDING_USER,
        reason: 'Awaiting cluster operator confirmation of node reboot',
      },
      technicianUser,
    );

    const pass = updated.status === TicketStatus.PENDING_USER && updated.isPaused === true;
    testTicket = updated;

    tracker.record({
      testId: 'TC-ITSM-SVC-004',
      module: 'ITSM Service',
      scenario: 'Pause SLA: Transitioning to PENDING_USER sets isPaused=true',
      type: 'POSITIVE',
      expected: 'status=PENDING_USER and isPaused=true',
      actual: `status=${updated.status}, isPaused=${updated.isPaused}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 14: Resume SLA Clock to IN_PROGRESS
  {
    const start = performance.now();
    const updated = await ticketsService.transitionStatus(
      testTicket.id,
      {
        status: TicketStatus.IN_PROGRESS,
        reason: 'Operator confirmed node online; verifying CoreDNS pods',
      },
      technicianUser,
    );

    const pass = updated.status === TicketStatus.IN_PROGRESS && updated.isPaused === false;
    testTicket = updated;

    tracker.record({
      testId: 'TC-ITSM-SVC-005',
      module: 'ITSM Service',
      scenario: 'Resume SLA: Transitioning back to IN_PROGRESS clears isPaused',
      type: 'POSITIVE',
      expected: 'status=IN_PROGRESS and isPaused=false',
      actual: `status=${updated.status}, isPaused=${updated.isPaused}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 15: Resolve Ticket with Root Cause
  {
    const start = performance.now();
    const updated = await ticketsService.resolve(
      testTicket.id,
      {
        resolutionNotes: 'ConfigMap coredns-custom patched to fix upstream forwarding loop',
        resolutionSummary: 'Patched DNS upstream forward loop',
        rootCause: 'Recursion query loop caused by conflicting resolv.conf nameserver',
        resolutionCategory: 'CONFIGURATION_FIX',
      },
      technicianUser,
    );

    const pass =
      updated.status === TicketStatus.RESOLVED &&
      updated.resolvedAt !== null &&
      updated.rootCause === 'Recursion query loop caused by conflicting resolv.conf nameserver';

    testTicket = updated;

    tracker.record({
      testId: 'TC-ITSM-SVC-006',
      module: 'ITSM Service',
      scenario: 'Resolve Incident: Records resolutionNotes, rootCause, and resolvedAt timestamp',
      type: 'POSITIVE',
      expected: 'status=RESOLVED, resolvedAt!=null, rootCause recorded',
      actual: `status=${updated.status}, rootCause=${updated.rootCause}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 16: Reopen Ticket with Reason
  {
    const start = performance.now();
    const updated = await ticketsService.reopen(
      testTicket.id,
      {
        reason: 'Intermittent query timeout re-occurred on secondary namespace',
      },
      technicianUser,
    );

    const pass =
      updated.status === TicketStatus.REOPENED &&
      updated.reopenCount === 1 &&
      updated.reopenedAt !== null;

    testTicket = updated;

    tracker.record({
      testId: 'TC-ITSM-SVC-007',
      module: 'ITSM Service',
      scenario: 'Reopen Ticket: Increments reopenCount, records reopenedAt and transitions to REOPENED',
      type: 'POSITIVE',
      expected: 'status=REOPENED, reopenCount=1',
      actual: `status=${updated.status}, reopenCount=${updated.reopenCount}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 17: Stopwatch Live Timer Start & Stop
  {
    const start = performance.now();
    const started = await ticketsService.startTimer(testTicket.id, technicianUser, {
      notes: 'Investigating secondary namespace DNS query latency',
    });
    const timerRunning = started.activeTimer && started.activeTimer.isRunning === true;

    const stopped = await ticketsService.stopTimer(testTicket.id, technicianUser);
    const timerStopped = stopped.activeTimer === null && stopped.timeEntries?.length > 0;

    const pass = timerRunning && timerStopped;

    tracker.record({
      testId: 'TC-ITSM-SVC-008',
      module: 'ITSM Time Tracking',
      scenario: 'Stopwatch Timer: Starts live session timer and commits duration entry on stop',
      type: 'POSITIVE',
      expected: 'Timer runs on start, duration entry recorded on stop',
      actual: `running=${timerRunning}, entriesRecorded=${stopped.timeEntries?.length}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 18: Manual Time Entry
  {
    const start = performance.now();
    const updated = await ticketsService.addManualTimeEntry(
      testTicket.id,
      {
        durationMinutes: 45,
        notes: 'Kernel parameter net.ipv4.tcp_tw_reuse enabled on worker nodes',
      },
      technicianUser,
    );

    const pass =
      updated.timeEntries?.some((te) => te.durationMinutes === 45 && te.notes.includes('net.ipv4.tcp_tw_reuse')) &&
      updated.totalTimeSpentMinutes >= 45;

    tracker.record({
      testId: 'TC-ITSM-SVC-009',
      module: 'ITSM Time Tracking',
      scenario: 'Manual Time Log: Persists technician work duration and updates total minutes',
      type: 'POSITIVE',
      expected: '45m entry logged, totalTimeSpentMinutes >= 45',
      actual: `totalTimeSpentMinutes=${updated.totalTimeSpentMinutes}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 19: Note Privacy & Segregation
  {
    const start = performance.now();
    // Post internal note
    await ticketsService.addComment(
      testTicket.id,
      {
        comment: 'Confidential Internal Note: Upstream cloud provider SDN outage reported.',
        isInternalNote: true,
      },
      technicianUser,
    );

    // Requester (employee) fetches ticket
    const requesterView = await ticketsService.findById(testTicket.id, employeeUser);
    const exposedToEmployee = requesterView.comments?.some((c) => c.isInternalNote === true);

    // Technician fetches ticket
    const technicianView = await ticketsService.findById(testTicket.id, technicianUser);
    const visibleToTech = technicianView.comments?.some((c) => c.isInternalNote === true);

    const pass = !exposedToEmployee && visibleToTech;

    tracker.record({
      testId: 'TC-ITSM-SEC-001',
      module: 'ITSM Security',
      scenario: 'Note Privacy: Internal technician notes are hidden from employee requesters',
      type: 'SECURITY',
      expected: 'exposedToEmployee=false, visibleToTech=true',
      actual: `exposedToEmployee=${exposedToEmployee}, visibleToTech=${visibleToTech}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 20: Bi-Directional Downstream Task Creation
  {
    const start = performance.now();
    const updated = await ticketsService.createTaskFromTicket(
      testTicket.id,
      {
        title: 'Apply CoreDNS DaemonSet memory limit upgrade in Helm chart',
        description: 'Update cluster manifest to raise memory limit from 170Mi to 256Mi',
        priority: Priority.HIGH,
        startDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 86400 * 1000).toISOString(),
        estimatedHours: 2,
      },
      technicianUser,
    );

    const pass =
      updated.linkedTasks?.length > 0 &&
      updated.linkedTasks[0].taskTitle.includes('CoreDNS DaemonSet memory limit');

    tracker.record({
      testId: 'TC-ITSM-TSK-001',
      module: 'ITSM Task Integration',
      scenario: 'Task Integration: Create downstream engineering task linked to incident',
      type: 'POSITIVE',
      expected: 'linkedTasks array contains spawned task',
      actual: `linkedTasks count=${updated.linkedTasks?.length}, title=${updated.linkedTasks?.[0]?.taskTitle}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  // TC 21: Executive Metrics Calculation
  {
    const start = performance.now();
    const metrics = await ticketsService.getMetrics();
    const pass =
      metrics.totalTickets > 0 &&
      metrics.slaComplianceRate !== undefined &&
      metrics.avgResolutionTimeHours >= 0;

    tracker.record({
      testId: 'TC-ITSM-MET-001',
      module: 'ITSM Metrics',
      scenario: 'ITSM Metrics: Aggregates total volume, compliance rate, and avg resolution time',
      type: 'POSITIVE',
      expected: 'totalTickets > 0, complianceRate calculated',
      actual: `total=${metrics.totalTickets}, compliance=${metrics.slaComplianceRate}, avgHours=${metrics.avgResolutionTimeHours}`,
      status: pass ? 'PASS' : 'FAIL',
      durationMs: Math.round(performance.now() - start),
    });
  }

  console.log('ITSM Service & State Machine Tests Finished.');
}

module.exports = { runItsmDomainTests };

if (require.main === module) {
  runItsmDomainTests().then(() => {
    console.log('\n--- Test Summary ---');
    console.log(JSON.stringify(tracker.getSummary(), null, 2));
    const failed = tracker.results.filter((r) => r.status === 'FAIL');
    if (failed.length > 0) {
      console.log('Failed scenarios:', failed);
      process.exit(1);
    } else {
      console.log('ALL ITSM SCENARIOS PASSED WITH 100% SUCCESS RATE.');
    }
  });
}
