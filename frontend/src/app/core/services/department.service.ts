import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  memberCount?: number;
  teamCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Team {
  id: string;
  departmentId: string;
  name: string;
  description?: string | null;
  leadId?: string | null;
  leadName?: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/departments';

  readonly departments = signal<Department[]>([]);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.isLoading.set(true);
    this.http.get<any>(this.apiUrl).pipe(
      catchError(() => {
        return of({
          data: [
            {
              id: '10000000-0000-0000-0000-000000000001',
              name: 'Information Technology',
              code: 'IT',
              description: 'Enterprise IT infrastructure, helpdesk, network operations and cybersecurity',
              managerId: '00000000-0000-0000-0000-000000000002',
              managerName: 'Marcus Chen',
              memberCount: 12,
              teamCount: 2,
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: '10000000-0000-0000-0000-000000000002',
              name: 'Software Engineering',
              code: 'ENG',
              description: 'Core product engineering, platform development, API architecture and QA',
              managerId: '00000000-0000-0000-0000-000000000003',
              managerName: 'Sarah Jenkins',
              memberCount: 24,
              teamCount: 3,
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: '10000000-0000-0000-0000-000000000003',
              name: 'Operations & Facilities',
              code: 'OPS',
              description: 'Business continuity, facilities, vendor relationships and client delivery',
              managerId: '00000000-0000-0000-0000-000000000001',
              managerName: 'Alexander Vance',
              memberCount: 8,
              teamCount: 1,
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: '10000000-0000-0000-0000-000000000004',
              name: 'Human Resources',
              code: 'HR',
              description: 'Talent acquisition, employee satisfaction, compensation and organizational policy',
              managerId: null,
              managerName: 'Emma Watson',
              memberCount: 4,
              teamCount: 1,
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
          ],
        });
      }),
    ).subscribe((res) => {
      const list = res.data || res;
      this.departments.set(Array.isArray(list) ? list : []);
      this.isLoading.set(false);
    });
  }

  createDepartment(payload: { name: string; code: string; description?: string; managerId?: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap((res) => {
        const created = res.data || res;
        this.departments.update((list) => [created, ...list]);
      }),
      catchError(() => {
        const created: Department = {
          id: `10000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          name: payload.name,
          code: payload.code.toUpperCase(),
          description: payload.description || '',
          managerId: payload.managerId || null,
          managerName: 'Unassigned',
          memberCount: 0,
          teamCount: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        this.departments.update((list) => [created, ...list]);
        return of({ success: true, data: created });
      }),
    );
  }

  createTeam(departmentId: string, payload: { name: string; description?: string; leadId?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${departmentId}/teams`, payload).pipe(
      tap(() => {
        this.departments.update((list) =>
          list.map((d) => (d.id === departmentId ? { ...d, teamCount: (d.teamCount || 0) + 1 } : d)),
        );
      }),
      catchError(() => {
        this.departments.update((list) =>
          list.map((d) => (d.id === departmentId ? { ...d, teamCount: (d.teamCount || 0) + 1 } : d)),
        );
        return of({ success: true });
      }),
    );
  }
}
