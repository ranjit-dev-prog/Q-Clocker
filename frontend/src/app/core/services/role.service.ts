import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface SystemRole {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionCount?: number;
  userCount?: number;
  permissions?: string[];
}

export interface PermissionMatrixItem {
  code: string;
  name: string;
  module: string;
  description?: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly apiUrl = 'http://localhost:3000/api/v1';

  readonly roles = signal<SystemRole[]>([]);
  readonly permissionMatrix = signal<PermissionMatrixItem[]>([]);
  readonly isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  loadRoles(): Observable<SystemRole[]> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}/roles`).pipe(
      tap((res) => {
        this.isLoading.set(false);
        const list: SystemRole[] = res.data || res || [];
        this.roles.set(list);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of([]);
      }),
    );
  }

  loadPermissionMatrix(): Observable<PermissionMatrixItem[]> {
    return this.http.get<any>(`${this.apiUrl}/permissions/matrix`).pipe(
      tap((res) => {
        const matrix: PermissionMatrixItem[] = res.data || res || [];
        this.permissionMatrix.set(matrix);
      }),
      catchError(() => of([])),
    );
  }

  createRole(payload: { name: string; code: string; description?: string; permissions?: string[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/roles`, payload).pipe(
      tap(() => {
        this.loadRoles().subscribe();
      }),
    );
  }

  assignUserRole(userId: string, roleCode: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}`, { roleCode });
  }
}

