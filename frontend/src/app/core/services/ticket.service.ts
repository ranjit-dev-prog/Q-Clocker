import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface TicketCommentItem {
  id: string;
  ticketId: string;
  userId: string;
  userName?: string;
  userRole?: string;
  comment: string;
  isInternalNote: boolean;
  createdAt: string;
}

export interface TicketHistoryItem {
  id: string;
  ticketId: string;
  fieldChanged: string;
  oldValue?: string | null;
  newValue?: string | null;
  changedBy?: string;
  changedByName?: string;
  changedAt: string;
}

export interface TicketTimeEntryItem {
  id: string;
  ticketId: string;
  employeeId: string;
  employeeName?: string;
  startedAt: string;
  endedAt?: string | null;
  durationMinutes: number;
  durationSeconds: number;
  isRunning: boolean;
  notes?: string;
  createdAt: string;
}

export interface TicketTaskLinkItem {
  id: string;
  ticketId: string;
  taskId: string;
  taskReferenceId?: string;
  taskTitle?: string;
  taskStatus?: string;
  linkedBy?: string;
  createdAt: string;
}

export interface TicketItem {
  id: string;
  referenceId: string;
  ticketNumber: string;
  title: string;
  description: string;
  ticketType: 'INCIDENT' | 'SERVICE_REQUEST' | 'PROBLEM' | 'CHANGE_REQUEST';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityCode: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  subcategory?: string | null;
  status:
    | 'NEW'
    | 'OPEN'
    | 'ASSIGNED'
    | 'IN_PROGRESS'
    | 'PENDING_USER'
    | 'PENDING_VENDOR'
    | 'ON_HOLD'
    | 'RESOLVED'
    | 'CLOSED'
    | 'REOPENED'
    | 'CANCELLED';
  source?: string;
  dueDate: string;
  firstResponseDueAt?: string | null;
  resolutionDueAt?: string | null;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  reopenedAt?: string | null;
  reopenCount?: number;
  resolutionNotes?: string | null;
  resolutionSummary?: string | null;
  rootCause?: string | null;
  resolutionCategory?: string | null;
  slaHours: number;
  slaStatus: 'WITHIN_SLA' | 'APPROACHING_BREACH' | 'BREACHED' | 'PAUSED' | 'MET';
  slaBreached: boolean;
  slaRemainingMinutes?: number | null;
  slaPercentageElapsed?: number | null;
  slaRemainingFormatted?: string;
  isPaused?: boolean;
  slaPauseDurationSeconds?: number;
  requesterId: string;
  requesterName?: string;
  requesterEmail?: string;
  assignedTechnicianId?: string | null;
  technicianName?: string;
  assignedTeamId?: string | null;
  teamName?: string;
  departmentId?: string | null;
  departmentName?: string;
  escalatedAt?: string | null;
  escalationReason?: string | null;
  escalatedToRole?: string | null;
  comments?: TicketCommentItem[];
  history?: TicketHistoryItem[];
  timeEntries?: TicketTimeEntryItem[];
  linkedTasks?: TicketTaskLinkItem[];
  totalTimeSpentMinutes?: number;
  activeTimer?: TicketTimeEntryItem | null;
  permittedNextStatuses?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubcategoryItem {
  code: string;
  name: string;
  defaultSlaHours: number;
}

export interface TicketCategoryItem {
  code: string;
  name: string;
  description: string;
  subcategories: SubcategoryItem[];
}

export interface TicketMetrics {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  p1CriticalCount: number;
  p2HighCount: number;
  slaBreachedCount: number;
  slaApproachingCount: number;
  slaComplianceRate: string;
  firstResponseComplianceRate: string;
  avgResolutionTimeHours: number;
  reopenedRate: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  ticketType?: string;
  impact?: string;
  urgency?: string;
  priority?: string;
  category: string;
  subcategory?: string;
  departmentId?: string;
  assignedTeamId?: string;
  assignedTechnicianId?: string;
  source?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/tickets';

  readonly tickets = signal<TicketItem[]>([]);
  readonly categories = signal<TicketCategoryItem[]>([]);
  readonly metrics = signal<TicketMetrics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly selectedTicket = signal<TicketItem | null>(null);
  readonly activeRunningTimer = signal<{ ticketId: string; ticketNumber: string; startedAt: string; elapsedSeconds: number } | null>(null);

  constructor(private http: HttpClient) {
    this.loadTickets().subscribe();
    this.loadCategories().subscribe();
    this.loadMetrics().subscribe();
  }

  loadTickets(filter?: {
    status?: string;
    priority?: string;
    priorityCode?: string;
    category?: string;
    slaStatus?: string;
    assignedTechnicianId?: string;
    assignedTeamId?: string;
    search?: string;
  }): Observable<any> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.priority) params = params.set('priority', filter.priority);
    if (filter?.priorityCode) params = params.set('priorityCode', filter.priorityCode);
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.slaStatus) params = params.set('slaStatus', filter.slaStatus);
    if (filter?.assignedTechnicianId) params = params.set('assignedTechnicianId', filter.assignedTechnicianId);
    if (filter?.assignedTeamId) params = params.set('assignedTeamId', filter.assignedTeamId);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<{ data: TicketItem[] }>(this.apiUrl, { params }).pipe(
      tap((res) => {
        this.tickets.set(res.data || []);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of({ data: [] });
      }),
    );
  }

  loadCategories(): Observable<any> {
    return this.http.get<{ data: TicketCategoryItem[] }>(`${this.apiUrl}/categories`).pipe(
      tap((res) => {
        if (res.data) {
          this.categories.set(res.data);
        }
      }),
      catchError(() => of({ data: [] })),
    );
  }

  loadMetrics(): Observable<any> {
    return this.http.get<{ data: TicketMetrics }>(`${this.apiUrl}/metrics`).pipe(
      tap((res) => {
        if (res.data) {
          this.metrics.set(res.data);
        }
      }),
      catchError(() => of({ data: null })),
    );
  }

  getTicketDetails(id: string): Observable<any> {
    return this.http.get<{ data: TicketItem }>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        if (res.data) {
          this.selectedTicket.set(res.data);
          if (res.data.activeTimer) {
            this.activeRunningTimer.set({
              ticketId: res.data.id,
              ticketNumber: res.data.ticketNumber,
              startedAt: res.data.activeTimer.startedAt,
              elapsedSeconds: res.data.activeTimer.durationSeconds || 0,
            });
          }
        }
      }),
    );
  }

  createTicket(payload: CreateTicketPayload): Observable<any> {
    return this.http.post<{ data: TicketItem }>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  transitionStatus(
    id: string,
    payload: {
      status: string;
      reason?: string;
      resolutionNotes?: string;
      resolutionSummary?: string;
      rootCause?: string;
      resolutionCategory?: string;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/transition`, payload).pipe(
      tap(() => {
        this.getTicketDetails(id).subscribe();
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  assignTicket(
    id: string,
    payload: {
      assignedTechnicianId?: string;
      assignedTeamId?: string;
      reason?: string;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/assign`, payload).pipe(
      tap(() => {
        this.getTicketDetails(id).subscribe();
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  escalateTicket(
    id: string,
    payload: {
      escalationReason: string;
      targetRole?: string;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/escalate`, payload).pipe(
      tap(() => {
        this.getTicketDetails(id).subscribe();
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  resolveTicket(
    id: string,
    payload: {
      resolutionNotes: string;
      resolutionSummary?: string;
      rootCause?: string;
      resolutionCategory?: string;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/resolve`, payload).pipe(
      tap(() => {
        this.getTicketDetails(id).subscribe();
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  reopenTicket(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reopen`, { reason }).pipe(
      tap(() => {
        this.getTicketDetails(id).subscribe();
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  addComment(ticketId: string, comment: string, isInternalNote: boolean = false): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/comments`, { comment, isInternalNote }).pipe(
      tap(() => {
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }

  startTimer(ticketId: string, notes?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/timer/start`, { notes }).pipe(
      tap(() => {
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }

  stopTimer(ticketId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/timer/stop`, {}).pipe(
      tap(() => {
        this.activeRunningTimer.set(null);
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }

  addManualTimeEntry(
    ticketId: string,
    payload: {
      durationMinutes: number;
      notes?: string;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/time-entries`, payload).pipe(
      tap(() => {
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }

  createTaskFromTicket(
    ticketId: string,
    payload: {
      title: string;
      description?: string;
      priority?: string;
      assignedEmployeeId?: string;
      startDate: string;
      dueDate: string;
      estimatedHours?: number;
    },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/tasks`, payload).pipe(
      tap(() => {
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }

  linkExistingTask(ticketId: string, taskId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/link-task`, { taskId }).pipe(
      tap(() => {
        this.getTicketDetails(ticketId).subscribe();
      }),
    );
  }
}
