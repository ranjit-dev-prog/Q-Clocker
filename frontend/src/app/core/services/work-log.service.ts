import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface WorkLogItem {
  id: string;
  referenceId: string;
  employeeId: string;
  employeeName?: string;
  taskId?: string | null;
  taskTitle?: string | null;
  taskReference?: string | null;
  ticketId?: string | null;
  ticketTitle?: string | null;
  ticketReference?: string | null;
  logDate: string;
  startTime: string;
  endTime: string;
  totalHours: string | number;
  workDescription: string;
  investigationPerformed?: string | null;
  actionsTaken?: string | null;
  challengesFaced?: string | null;
  status: string;
  createdAt: string;
}

export interface CreateWorkLogPayload {
  logDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  workDescription: string;
  investigationPerformed?: string;
  actionsTaken?: string;
  challengesFaced?: string;
  taskId?: string;
  ticketId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkLogService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/work-logs';

  readonly logs = signal<WorkLogItem[]>([]);
  readonly dailySummary = signal<any | null>(null);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadLogs().subscribe();
    this.loadDailySummary().subscribe();
  }

  loadLogs(filter?: { date?: string; employeeId?: string }): Observable<any> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (filter?.date) params = params.set('logDate', filter.date);
    if (filter?.employeeId) params = params.set('employeeId', filter.employeeId);

    return this.http.get<{ data: WorkLogItem[] }>(this.apiUrl, { params }).pipe(
      tap((res) => {
        this.logs.set(res.data || []);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of({ data: [] });
      }),
    );
  }

  loadDailySummary(date?: string): Observable<any> {
    const targetDate = date || new Date().toISOString().substring(0, 10);
    return this.http.get<{ data: any }>(`${this.apiUrl}/daily-summary?date=${targetDate}`).pipe(
      tap((res) => {
        if (res.data) {
          this.dailySummary.set(res.data);
        }
      }),
      catchError(() => of({ data: null })),
    );
  }

  createWorkLog(payload: CreateWorkLogPayload): Observable<any> {
    return this.http.post<{ data: WorkLogItem }>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadLogs().subscribe();
        this.loadDailySummary().subscribe();
      }),
    );
  }
}
