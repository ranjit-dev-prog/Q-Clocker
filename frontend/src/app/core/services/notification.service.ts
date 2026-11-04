import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'URGENT' | 'TICKET' | 'TASK' | 'SYSTEM';
  entityType?: 'TICKET' | 'TASK' | 'WORK_LOG' | 'SYSTEM';
  entityId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/notifications';

  readonly notifications = signal<NotificationItem[]>([]);
  readonly unreadCount = signal<number>(0);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  loadNotifications(unreadOnly = false): Observable<NotificationItem[]> {
    this.isLoading.set(true);
    const params: Record<string, string> = {};
    if (unreadOnly) params['unreadOnly'] = 'true';

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      tap((res) => {
        this.isLoading.set(false);
        const list: NotificationItem[] = res.data || res || [];
        this.notifications.set(list);
        this.unreadCount.set(list.filter((n) => !n.isRead).length);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of([]);
      }),
    );
  }

  loadUnreadCount(): Observable<{ count: number }> {
    return this.http.get<any>(`${this.apiUrl}/unread-count`).pipe(
      tap((res) => {
        const count = res.data?.count ?? res.count ?? 0;
        this.unreadCount.set(count);
      }),
      catchError(() => of({ count: 0 })),
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.notifications.update((list) =>
          list.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)),
        );
        this.unreadCount.update((c) => Math.max(0, c - 1));
      }),
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        this.notifications.update((list) =>
          list.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
        );
        this.unreadCount.set(0);
      }),
    );
  }
}

