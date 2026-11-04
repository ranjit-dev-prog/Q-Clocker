import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CelebrationEvent {
  id: string;
  type: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'PROMOTION' | 'MILESTONE';
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  departmentName: string;
  avatarUrl?: string;
  eventDate: string;
  yearsOfService?: number;
  congratulationsCount: number;
  hasCongratulated: boolean;
}

export interface HrReminder {
  id: string;
  type: 'PROBATION_END' | 'CONTRACT_EXPIRY' | 'DOCUMENT_EXPIRY' | 'VISA_EXPIRY';
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  managerName?: string;
  dueDate: string;
  daysRemaining: number;
  urgency: 'CRITICAL' | 'UPCOMING' | 'NORMAL';
  status: 'PENDING' | 'RESOLVED' | 'EXTENDED';
  details?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LifecycleService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/lifecycle';
  private http = inject(HttpClient);

  getCelebrations(): Observable<CelebrationEvent[]> {
    return this.http.get<CelebrationEvent[]>(`${this.apiUrl}/celebrations`);
  }

  congratulate(id: string): Observable<{ success: boolean; count: number }> {
    return this.http.post<{ success: boolean; count: number }>(
      `${this.apiUrl}/events/${id}/congratulate`,
      {}
    );
  }

  getReminders(urgency?: string): Observable<HrReminder[]> {
    const url = urgency ? `${this.apiUrl}/reminders?urgency=${urgency}` : `${this.apiUrl}/reminders`;
    return this.http.get<HrReminder[]>(url);
  }

  notifyReminder(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/reminders/${id}/notify`,
      {}
    );
  }

  extendProbation(id: string, newEndDate: string, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reminders/${id}/extend-probation`, {
      newEndDate,
      reason,
    });
  }

  resolveReminder(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reminders/${id}/resolve`, {});
  }
}

