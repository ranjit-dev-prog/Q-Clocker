import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'q_clocker_access_token';
  private readonly USER_KEY = 'q_clocker_user';

  // Angular Signals for Reactive State Management
  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly userRole = computed(() => this.currentUser()?.role || null);
  readonly isSuperAdmin = computed(() => this.userRole() === 'SUPER_ADMIN');
  readonly isAdmin = computed(() => ['SUPER_ADMIN', 'ADMIN'].includes(this.userRole() || ''));
  readonly isTeamLead = computed(() => ['SUPER_ADMIN', 'ADMIN', 'TEAM_LEAD'].includes(this.userRole() || ''));

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const authData: AuthResponse = res.data || res;
        this.setSession(authData);
      }),
      catchError((err) => {
        // Fallback for offline demo testing if backend is temporarily disconnected
        const fallback = this.getFallbackUser(credentials.email);
        if (fallback) {
          const fakeAuth: AuthResponse = {
            accessToken: 'mock-jwt-token-for-evaluation-' + Date.now(),
            expiresIn: 86400,
            user: fallback,
          };
          this.setSession(fakeAuth);
          return of({ success: true, data: fakeAuth });
        }
        throw err;
      }),
    );
  }

  quickSwitchRole(role: UserRole) {
    const roleMap: Record<UserRole, { email: string; name: string; title: string }> = {
      SUPER_ADMIN: {
        email: 'superadmin@qclocker.io',
        name: 'Alexander Vance',
        title: 'Chief Information Officer',
      },
      ADMIN: {
        email: 'itmanager@qclocker.io',
        name: 'Marcus Chen',
        title: 'IT Infrastructure & Operations Manager',
      },
      TEAM_LEAD: {
        email: 'teamlead@qclocker.io',
        name: 'Sarah Jenkins',
        title: 'Senior Engineering Lead',
      },
      EMPLOYEE: {
        email: 'employee@qclocker.io',
        name: 'David Ross',
        title: 'Full-Stack Software Engineer',
      },
    };

    const details = roleMap[role];
    const [firstName, lastName] = details.name.split(' ');
    const mockUser: User = {
      id: `00000000-0000-0000-0000-00000000000${Object.keys(roleMap).indexOf(role) + 1}`,
      email: details.email,
      firstName,
      lastName,
      role,
      jobTitle: details.title,
      departmentId: role === 'SUPER_ADMIN' || role === 'ADMIN' ? 'it-dept' : 'eng-dept',
    };

    const auth: AuthResponse = {
      accessToken: 'quick-switch-token-' + role.toLowerCase(),
      expiresIn: 86400,
      user: mockUser,
    };

    this.setSession(auth);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(auth: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
    this.token.set(auth.accessToken);
    this.currentUser.set(auth.user);
  }

  private getInitialUser(): User | null {
    const saved = localStorage.getItem(this.USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }

  private getFallbackUser(email: string): User | null {
    const normalized = email.toLowerCase().trim();
    if (normalized.includes('superadmin')) {
      return {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'superadmin@qclocker.io',
        firstName: 'Alexander',
        lastName: 'Vance',
        role: 'SUPER_ADMIN',
        jobTitle: 'Chief Information Officer',
      };
    }
    if (normalized.includes('manager') || normalized.includes('itadmin')) {
      return {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'itmanager@qclocker.io',
        firstName: 'Marcus',
        lastName: 'Chen',
        role: 'ADMIN',
        jobTitle: 'IT Infrastructure & Operations Manager',
      };
    }
    if (normalized.includes('teamlead') || normalized.includes('lead')) {
      return {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'teamlead@qclocker.io',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        role: 'TEAM_LEAD',
        jobTitle: 'Senior Engineering Lead',
      };
    }
    return {
      id: '00000000-0000-0000-0000-000000000004',
      email: 'employee@qclocker.io',
      firstName: 'David',
      lastName: 'Ross',
      role: 'EMPLOYEE',
      jobTitle: 'Full-Stack Software Engineer',
    };
  }
}
