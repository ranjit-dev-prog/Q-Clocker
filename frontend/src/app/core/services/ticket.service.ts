import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface TicketItem {
  id: string;
  referenceId: string;
  ticketNumber: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  subcategory?: string | null;
  status: string;
  dueDate: string;
  slaHours: number;
  slaBreached: boolean;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  resolutionNotes?: string | null;
  requesterId: string;
  requesterName?: string;
  assignedTechnicianId?: string | null;
  technicianName?: string;
  departmentId?: string | null;
  departmentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  slaBreachedCount: number;
  slaComplianceRate: string;
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority?: string;
  category?: string;
  subcategory?: string;
  departmentId?: string;
  assignedTechnicianId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/tickets';

  readonly tickets = signal<TicketItem[]>([]);
  readonly metrics = signal<TicketMetrics | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly selectedTicket = signal<any | null>(null);

  constructor(private http: HttpClient) {
    this.loadTickets().subscribe();
    this.loadMetrics().subscribe();
  }

  loadTickets(filter?: { status?: string; priority?: string; category?: string; search?: string }): Observable<any> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.priority) params = params.set('priority', filter.priority);
    if (filter?.category) params = params.set('category', filter.category);
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

  createTicket(payload: CreateTicketPayload): Observable<any> {
    return this.http.post<{ data: TicketItem }>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  resolveTicket(id: string, resolutionNotes: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/resolve`, { resolutionNotes }).pipe(
      tap(() => {
        this.loadTickets().subscribe();
        this.loadMetrics().subscribe();
      }),
    );
  }

  getTicketDetails(id: string): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        this.selectedTicket.set(res.data);
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
}
