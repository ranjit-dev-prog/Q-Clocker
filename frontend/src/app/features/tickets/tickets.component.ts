import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TicketService,
  TicketItem,
  CreateTicketPayload,
  TicketCategoryItem,
  SubcategoryItem,
} from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tickets.component.html',
})
export class TicketsComponent implements OnInit {
  ticketService = inject(TicketService);
  authService = inject(AuthService);
  employeeService = inject(EmployeeService);
  departmentService = inject(DepartmentService);

  // Modals
  showCreateModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  showTransitionModal = signal<boolean>(false);
  showAssignModal = signal<boolean>(false);
  showEscalateModal = signal<boolean>(false);
  showReopenModal = signal<boolean>(false);
  showTaskModal = signal<boolean>(false);
  showLinkTaskModal = signal<boolean>(false);
  showTimeEntryModal = signal<boolean>(false);

  // State
  isSubmitting = signal<boolean>(false);
  activeTab = signal<'overview' | 'comments' | 'timelogs' | 'tasks' | 'history'>('overview');
  selectedTicketDetail = signal<TicketItem | null>(null);

  // Filter state
  searchQuery = '';
  selectedStatus = '';
  selectedPriority = '';
  selectedPriorityCode = '';
  selectedCategory = '';
  selectedSlaStatus = '';
  activeQuickFilter = signal<string>('all');

  // Form: Create Ticket
  newTicketTitle = '';
  newTicketDesc = '';
  newTicketType = 'INCIDENT';
  newTicketImpact = 'MEDIUM';
  newTicketUrgency = 'MEDIUM';
  newTicketCategory = 'IT_SUPPORT';
  newTicketSubcategory = 'LAPTOP_DESKTOP';
  newTicketDepartmentId = '';
  newTicketTechnicianId = '';
  newTicketSource = 'PORTAL';

  // Form: Transition Status
  transitionTargetStatus = '';
  transitionReason = '';
  transitionResolutionNotes = '';
  transitionResolutionSummary = '';
  transitionRootCause = '';
  transitionResolutionCategory = '';

  // Form: Assign
  assignTechnicianId = '';
  assignTeamId = '';
  assignReason = '';

  // Form: Escalate
  escalationReason = '';
  escalationTargetRole = 'IT_MANAGER';

  // Form: Reopen
  reopenReason = '';

  // Form: Comments
  newCommentText = '';
  isInternalComment = false;

  // Form: Time Entry
  manualDurationMinutes = 30;
  manualTimeNotes = '';

  // Form: Task Creation from Ticket
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority = 'MEDIUM';
  newTaskAssignedEmployeeId = '';
  newTaskStartDate = new Date().toISOString().substring(0, 10);
  newTaskDueDate = new Date(Date.now() + 2 * 86400 * 1000).toISOString().substring(0, 10);
  newTaskEstimatedHours = 4;

  // Form: Link Existing Task
  linkTaskIdInput = '';

  // Computed: Available Subcategories based on selected Category
  currentSubcategories = computed(() => {
    const cats = this.ticketService.categories();
    const cat = cats.find((c) => c.code === this.newTicketCategory);
    return cat ? cat.subcategories : [];
  });

  // Computed: Priority Matrix Preview for Create Ticket
  calculatedPriorityPreview = computed(() => {
    return this.calculatePriorityMatrix(this.newTicketImpact, this.newTicketUrgency);
  });

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.ticketService.loadTickets().subscribe();
    this.ticketService.loadCategories().subscribe();
    this.ticketService.loadMetrics().subscribe();
    this.employeeService.loadEmployees();
    this.departmentService.loadDepartments();
  }

  onCategoryChange() {
    const subs = this.currentSubcategories();
    if (subs.length > 0) {
      this.newTicketSubcategory = subs[0].code;
    } else {
      this.newTicketSubcategory = '';
    }
  }

  setQuickFilter(filter: string) {
    this.activeQuickFilter.set(filter);
    const currentUser = this.authService.currentUser();
    switch (filter) {
      case 'all':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.selectedCategory = '';
        this.applyFilters();
        break;
      case 'my_tickets':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.ticketService.loadTickets({ search: currentUser?.email }).subscribe();
        break;
      case 'assigned_me':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        if (currentUser?.id) {
          this.ticketService.loadTickets({ assignedTechnicianId: currentUser.id }).subscribe();
        }
        break;
      case 'p1_p2':
        this.selectedStatus = '';
        this.selectedPriorityCode = 'P1';
        this.selectedCategory = '';
        this.applyFilters();
        break;
      case 'approaching_breach':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = 'APPROACHING_BREACH';
        this.applyFilters();
        break;
      case 'resolved':
        this.selectedStatus = 'RESOLVED';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.applyFilters();
        break;
      case 'queue_it':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.selectedCategory = 'IT_SUPPORT';
        this.applyFilters();
        break;
      case 'queue_hr':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.selectedCategory = 'HR_SUPPORT';
        this.applyFilters();
        break;
      case 'queue_facility':
        this.selectedStatus = '';
        this.selectedPriorityCode = '';
        this.selectedSlaStatus = '';
        this.selectedCategory = 'FACILITY_ADMIN';
        this.applyFilters();
        break;
    }
  }

  applyFilters() {
    this.ticketService
      .loadTickets({
        search: this.searchQuery || undefined,
        status: this.selectedStatus || undefined,
        priority: this.selectedPriority || undefined,
        priorityCode: this.selectedPriorityCode || undefined,
        category: this.selectedCategory || undefined,
        slaStatus: this.selectedSlaStatus || undefined,
      })
      .subscribe();
  }

  openDetails(ticket: TicketItem) {
    this.ticketService.getTicketDetails(ticket.id).subscribe((res) => {
      this.selectedTicketDetail.set(res.data);
      this.activeTab.set('overview');
      this.showDetailsModal.set(true);
    });
  }

  // --- ACTIONS ---

  openCreateModal() {
    this.newTicketTitle = '';
    this.newTicketDesc = '';
    this.newTicketType = 'INCIDENT';
    this.newTicketImpact = 'MEDIUM';
    this.newTicketUrgency = 'MEDIUM';
    this.newTicketCategory = 'IT_SUPPORT';
    this.newTicketSubcategory = 'LAPTOP_DESKTOP';
    this.newTicketSource = 'PORTAL';
    this.showCreateModal.set(true);
  }

  submitCreateTicket() {
    if (!this.newTicketTitle.trim() || !this.newTicketDesc.trim()) return;
    this.isSubmitting.set(true);

    const payload: CreateTicketPayload = {
      title: this.newTicketTitle.trim(),
      description: this.newTicketDesc.trim(),
      ticketType: this.newTicketType,
      impact: this.newTicketImpact,
      urgency: this.newTicketUrgency,
      category: this.newTicketCategory,
      subcategory: this.newTicketSubcategory || undefined,
      departmentId: this.newTicketDepartmentId || undefined,
      assignedTechnicianId: this.newTicketTechnicianId || undefined,
      source: this.newTicketSource,
    };

    this.ticketService.createTicket(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  openTransitionModal() {
    const ticket = this.selectedTicketDetail();
    if (!ticket) return;
    this.transitionTargetStatus = ticket.permittedNextStatuses?.[0] || '';
    this.transitionReason = '';
    this.transitionResolutionNotes = '';
    this.transitionResolutionSummary = '';
    this.transitionRootCause = '';
    this.transitionResolutionCategory = '';
    this.showTransitionModal.set(true);
  }

  submitTransition() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.transitionTargetStatus) return;

    if (this.transitionTargetStatus === 'RESOLVED' && !this.transitionResolutionNotes.trim()) {
      alert('Resolution notes are mandatory when resolving a ticket.');
      return;
    }

    this.isSubmitting.set(true);
    this.ticketService
      .transitionStatus(ticket.id, {
        status: this.transitionTargetStatus,
        reason: this.transitionReason.trim() || undefined,
        resolutionNotes: this.transitionResolutionNotes.trim() || undefined,
        resolutionSummary: this.transitionResolutionSummary.trim() || undefined,
        rootCause: this.transitionRootCause.trim() || undefined,
        resolutionCategory: this.transitionResolutionCategory.trim() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.showTransitionModal.set(false);
          if (res.data) {
            this.selectedTicketDetail.set(res.data);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          alert(err?.error?.message || 'Failed to transition ticket status.');
        },
      });
  }

  openAssignModal() {
    const ticket = this.selectedTicketDetail();
    if (!ticket) return;
    this.assignTechnicianId = ticket.assignedTechnicianId || '';
    this.assignTeamId = ticket.assignedTeamId || '';
    this.assignReason = '';
    this.showAssignModal.set(true);
  }

  submitAssign() {
    const ticket = this.selectedTicketDetail();
    if (!ticket) return;
    this.isSubmitting.set(true);

    this.ticketService
      .assignTicket(ticket.id, {
        assignedTechnicianId: this.assignTechnicianId || undefined,
        assignedTeamId: this.assignTeamId || undefined,
        reason: this.assignReason.trim() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.showAssignModal.set(false);
          if (res.data) {
            this.selectedTicketDetail.set(res.data);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  openEscalateModal() {
    this.escalationReason = '';
    this.escalationTargetRole = 'IT_MANAGER';
    this.showEscalateModal.set(true);
  }

  submitEscalate() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.escalationReason.trim()) return;
    this.isSubmitting.set(true);

    this.ticketService
      .escalateTicket(ticket.id, {
        escalationReason: this.escalationReason.trim(),
        targetRole: this.escalationTargetRole,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.showEscalateModal.set(false);
          if (res.data) {
            this.selectedTicketDetail.set(res.data);
          }
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  openReopenModal() {
    this.reopenReason = '';
    this.showReopenModal.set(true);
  }

  submitReopen() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.reopenReason.trim()) return;
    this.isSubmitting.set(true);

    this.ticketService.reopenTicket(ticket.id, this.reopenReason.trim()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showReopenModal.set(false);
        if (res.data) {
          this.selectedTicketDetail.set(res.data);
        }
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  toggleTimer() {
    const ticket = this.selectedTicketDetail();
    if (!ticket) return;

    if (ticket.activeTimer?.isRunning) {
      this.ticketService.stopTimer(ticket.id).subscribe((res) => {
        if (res.data) this.selectedTicketDetail.set(res.data);
      });
    } else {
      this.ticketService.startTimer(ticket.id, 'Investigation & triage session').subscribe((res) => {
        if (res.data) this.selectedTicketDetail.set(res.data);
      });
    }
  }

  submitManualTimeEntry() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.manualDurationMinutes) return;
    this.isSubmitting.set(true);

    this.ticketService
      .addManualTimeEntry(ticket.id, {
        durationMinutes: this.manualDurationMinutes,
        notes: this.manualTimeNotes.trim() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.showTimeEntryModal.set(false);
          this.manualDurationMinutes = 30;
          this.manualTimeNotes = '';
          if (res.data) this.selectedTicketDetail.set(res.data);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  submitComment() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.newCommentText.trim()) return;

    this.ticketService
      .addComment(ticket.id, this.newCommentText.trim(), this.isInternalComment)
      .subscribe((res) => {
        this.newCommentText = '';
        if (res.data) this.selectedTicketDetail.set(res.data);
      });
  }

  openCreateTaskModal() {
    const ticket = this.selectedTicketDetail();
    if (!ticket) return;
    this.newTaskTitle = `[Action] Resolve ${ticket.title}`;
    this.newTaskDescription = `Remediation task created from ticket ${ticket.referenceId}:\n${ticket.description}`;
    this.newTaskPriority = ticket.priority || 'MEDIUM';
    this.newTaskAssignedEmployeeId = ticket.assignedTechnicianId || '';
    this.newTaskStartDate = new Date().toISOString().substring(0, 10);
    this.newTaskDueDate = new Date(Date.now() + 2 * 86400 * 1000).toISOString().substring(0, 10);
    this.newTaskEstimatedHours = 4;
    this.showTaskModal.set(true);
  }

  submitCreateTask() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.newTaskTitle.trim()) return;
    this.isSubmitting.set(true);

    this.ticketService
      .createTaskFromTicket(ticket.id, {
        title: this.newTaskTitle.trim(),
        description: this.newTaskDescription.trim() || undefined,
        priority: this.newTaskPriority,
        assignedEmployeeId: this.newTaskAssignedEmployeeId || undefined,
        startDate: new Date(this.newTaskStartDate).toISOString(),
        dueDate: new Date(this.newTaskDueDate).toISOString(),
        estimatedHours: Number(this.newTaskEstimatedHours),
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.showTaskModal.set(false);
          if (res.data) this.selectedTicketDetail.set(res.data);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
  }

  openLinkTaskModal() {
    this.linkTaskIdInput = '';
    this.showLinkTaskModal.set(true);
  }

  submitLinkTask() {
    const ticket = this.selectedTicketDetail();
    if (!ticket || !this.linkTaskIdInput.trim()) return;
    this.isSubmitting.set(true);

    this.ticketService.linkExistingTask(ticket.id, this.linkTaskIdInput.trim()).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showLinkTaskModal.set(false);
        if (res.data) this.selectedTicketDetail.set(res.data);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  // --- HELPER METHODS ---

  calculatePriorityMatrix(impact: string, urgency: string): { code: string; label: string; slaHours: number; colorClass: string } {
    if (impact === 'CRITICAL' && urgency === 'CRITICAL') {
      return { code: 'P1', label: 'P1 - Critical', slaHours: 4, colorClass: 'bg-rose-600 text-white' };
    }
    if (
      (impact === 'CRITICAL' && urgency === 'HIGH') ||
      (impact === 'HIGH' && urgency === 'CRITICAL') ||
      (impact === 'HIGH' && urgency === 'HIGH')
    ) {
      return { code: 'P2', label: 'P2 - High', slaHours: 8, colorClass: 'bg-amber-500 text-white' };
    }
    if (
      (impact === 'LOW' && urgency === 'LOW') ||
      (impact === 'LOW' && urgency === 'MEDIUM') ||
      (impact === 'MEDIUM' && urgency === 'LOW')
    ) {
      return { code: 'P4', label: 'P4 - Low', slaHours: 72, colorClass: 'bg-slate-500 text-white' };
    }
    return { code: 'P3', label: 'P3 - Medium', slaHours: 24, colorClass: 'bg-blue-600 text-white' };
  }

  getPriorityCodeClass(code: string): string {
    switch (code) {
      case 'P1':
        return 'bg-rose-600 text-white font-black';
      case 'P2':
        return 'bg-amber-500 text-white font-bold';
      case 'P3':
        return 'bg-blue-600 text-white font-medium';
      case 'P4':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'NEW':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'OPEN':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800';
      case 'ASSIGNED':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse';
      case 'PENDING_USER':
      case 'PENDING_VENDOR':
      case 'ON_HOLD':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'CLOSED':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
      case 'REOPENED':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
      case 'CANCELLED':
        return 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  getSlaBadgeClass(ticket: TicketItem): string {
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
    }
    if (ticket.isPaused) {
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
    }
    if (ticket.slaBreached) {
      return 'bg-rose-600 text-white font-bold animate-pulse shadow-xs';
    }
    if (ticket.slaStatus === 'APPROACHING_BREACH') {
      return 'bg-orange-500 text-white font-bold animate-pulse';
    }
    return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
  }
}
