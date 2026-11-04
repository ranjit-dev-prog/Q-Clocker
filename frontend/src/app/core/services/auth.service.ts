import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/auth';
  private readonly TOKEN_KEY = 'q_clocker_access_token';
  private readonly REFRESH_TOKEN_KEY = 'q_clocker_refresh_token';
  private readonly USER_KEY = 'q_clocker_user';

  // Reactive State Management with Angular Signals
  readonly currentUser = signal<User | null>(this.getInitialUser());
  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly userRole = computed(() => this.currentUser()?.role || null);
  readonly userPermissions = computed(() => this.currentUser()?.permissions || []);

  // Enterprise Role Evaluation
  readonly isSuperAdmin = computed(() => this.userRole() === 'SUPER_ADMIN');
  readonly isAdmin = computed(() =>
    ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR'].includes(this.userRole() || ''),
  );
  readonly isHR = computed(() =>
    ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR', 'HR_EXECUTIVE'].includes(
      this.userRole() || '',
    ),
  );
  readonly isITManager = computed(() =>
    ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'IT_MANAGER'].includes(this.userRole() || ''),
  );
  readonly isTeamLead = computed(() =>
    ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'DEPARTMENT_MANAGER', 'TEAM_LEAD'].includes(
      this.userRole() || '',
    ),
  );
  readonly isAuditor = computed(() =>
    ['SUPER_ADMIN', 'AUDITOR'].includes(this.userRole() || ''),
  );
  readonly isViewer = computed(() =>
    ['READ_ONLY', 'VIEWER'].includes(this.userRole() || ''),
  );

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Enterprise Corporate Login
   * Strictly authenticates with backend and never falls back to mock personas.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const authData: AuthResponse = res.data || res;
        this.setSession(authData);
      }),
    );
  }

  /**
   * Refresh current access token using refresh token rotation
   */
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((res) => {
        const authData: AuthResponse = res.data || res;
        this.setSession(authData);
      }),
    );
  }

  /**
   * Log out user and wipe all credentials from memory and localStorage
   */
  logout(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (this.token()) {
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        error: () => {}, // Best-effort server session revocation
      });
    }

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Request password reset token (Dual-Factor Account Recovery)
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Retrieve security challenge questions for valid reset token
   */
  getResetChallenge(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reset-challenge?token=${encodeURIComponent(token)}`);
  }

  /**
   * Verify answers to recovery challenge questions or recovery passphrase
   */
  verifyResetChallenge(
    token: string,
    answers: { questionId: string; answer: string }[],
    recoveryPassphrase?: string,
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-reset-challenge`, {
      token,
      answers,
      recoveryPassphrase,
    });
  }

  /**
   * Complete password reset with high-entropy credential
   */
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  /**
   * Admin-triggered password reset with temporary token issuance
   */
  adminResetPassword(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/admin-reset-password`, {});
  }

  /**
   * Administrative revocation of all user active sessions
   */
  revokeUserSessions(userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/revoke-sessions`, {});
  }

  /**
   * Check if current user has a specific granular permission
   */
  hasPermission(permission: string): boolean {
    if (this.isSuperAdmin()) return true;
    const perms = this.userPermissions();
    if (perms.includes('*')) return true;
    if (perms.includes(permission)) return true;
    const modulePrefix = permission.split('.')[0] + '.*';
    return perms.includes(modulePrefix);
  }

  /**
   * Check if current user possesses any of the listed roles
   */
  hasRole(roles: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    const current = this.userRole();
    return !!current && roles.includes(current);
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.accessToken);
    if (auth.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, auth.refreshToken);
    }
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
}
