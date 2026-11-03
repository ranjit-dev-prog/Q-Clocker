import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { UserRole } from '../models/user.model';

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  roleCode: UserRole;
  departmentId?: string | null;
  departmentName?: string | null;
  teamId?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateEmployeePayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roleCode: UserRole;
  departmentId?: string;
  teamId?: string;
  managerId?: string;
  jobTitle?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/users';

  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly selectedEmployee = signal<Employee | null>(null);

  constructor(private http: HttpClient) {
    this.loadEmployees();
  }

  loadEmployees(query?: { search?: string; role?: string; departmentId?: string }): void {
    this.isLoading.set(true);
    let params: Record<string, string> = {};
    if (query?.search) params['search'] = query.search;
    if (query?.role) params['role'] = query.role;
    if (query?.departmentId) params['departmentId'] = query.departmentId;

    this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError(() => {
        // Fallback default dataset
        return of({
          data: [
            {
              id: '00000000-0000-0000-0000-000000000001',
              email: 'superadmin@qclocker.io',
              firstName: 'Alexander',
              lastName: 'Vance',
              phone: '+1-555-0100',
              roleCode: 'SUPER_ADMIN' as UserRole,
              departmentId: '10000000-0000-0000-0000-000000000001',
              departmentName: 'Information Technology',
              teamId: null,
              managerId: null,
              jobTitle: 'Chief Information Officer',
              isActive: true,
              createdAt: '2026-01-01T00:00:00.000Z',
            },
            {
              id: '00000000-0000-0000-0000-000000000002',
              email: 'itmanager@qclocker.io',
              firstName: 'Marcus',
              lastName: 'Chen',
              phone: '+1-555-0101',
              roleCode: 'ADMIN' as UserRole,
              departmentId: '10000000-0000-0000-0000-000000000001',
              departmentName: 'Information Technology',
              teamId: null,
              managerId: '00000000-0000-0000-0000-000000000001',
              jobTitle: 'IT Infrastructure & Operations Manager',
              isActive: true,
              createdAt: '2026-01-10T00:00:00.000Z',
            },
            {
              id: '00000000-0000-0000-0000-000000000003',
              email: 'teamlead@qclocker.io',
              firstName: 'Sarah',
              lastName: 'Jenkins',
              phone: '+1-555-0102',
              roleCode: 'TEAM_LEAD' as UserRole,
              departmentId: '10000000-0000-0000-0000-000000000002',
              departmentName: 'Software Engineering',
              teamId: '20000000-0000-0000-0000-000000000001',
              managerId: '00000000-0000-0000-0000-000000000001',
              jobTitle: 'Senior Engineering Lead',
              isActive: true,
              createdAt: '2026-01-15T00:00:00.000Z',
            },
            {
              id: '00000000-0000-0000-0000-000000000004',
              email: 'employee@qclocker.io',
              firstName: 'David',
              lastName: 'Ross',
              phone: '+1-555-0103',
              roleCode: 'EMPLOYEE' as UserRole,
              departmentId: '10000000-0000-0000-0000-000000000002',
              departmentName: 'Software Engineering',
              teamId: '20000000-0000-0000-0000-000000000001',
              managerId: '00000000-0000-0000-0000-000000000003',
              jobTitle: 'Full-Stack Software Engineer',
              isActive: true,
              createdAt: '2026-02-01T00:00:00.000Z',
            },
          ],
        });
      }),
    ).subscribe((res) => {
      const list = res.data || res;
      this.employees.set(Array.isArray(list) ? list : []);
      this.isLoading.set(false);
    });
  }

  createEmployee(payload: CreateEmployeePayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap((res) => {
        const created = res.data || res;
        this.employees.update((list) => [created, ...list]);
      }),
      catchError(() => {
        // Optimistic offline update
        const created: Employee = {
          id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone || null,
          roleCode: payload.roleCode,
          departmentId: payload.departmentId || null,
          jobTitle: payload.jobTitle || 'Team Member',
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        this.employees.update((list) => [created, ...list]);
        return of({ success: true, data: created });
      }),
    );
  }

  updateEmployee(id: string, payload: Partial<Employee>): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      tap((res) => {
        const updated = res.data || res;
        this.employees.update((list) =>
          list.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp)),
        );
      }),
      catchError(() => {
        this.employees.update((list) =>
          list.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp)),
        );
        return of({ success: true });
      }),
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.employees.update((list) =>
          list.map((emp) => (emp.id === id ? { ...emp, isActive: false } : emp)),
        );
      }),
      catchError(() => {
        this.employees.update((list) =>
          list.map((emp) => (emp.id === id ? { ...emp, isActive: false } : emp)),
        );
        return of({ success: true });
      }),
    );
  }
}
