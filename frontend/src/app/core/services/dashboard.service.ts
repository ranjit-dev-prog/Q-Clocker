import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface DashboardKpis {
  totalWorkforce: number;
  activeTasks: number;
  openTickets: number;
  p1CriticalCount: number;
  slaComplianceRate: number;
  avgResolutionTimeHours: number;
  totalDepartments: number;
  pendingApprovals: number;
  hoursLoggedToday: number;
}

export interface WeeklyProductivityDay {
  day: string;
  completed: number;
  total: number;
  hours: number;
}

export interface DepartmentDashboardStat {
  id: string;
  name: string;
  code: string;
  tasks: number;
  score: number;
  trend: string;
  memberCount: number;
}

export interface UpcomingTaskItem {
  id: string;
  code: string;
  title: string;
  assignee: string;
  due: string;
  priority: string;
  isUrgent: boolean;
}

export interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  icon: string;
  timestamp: string;
}

export interface DashboardSummaryResponse {
  role: string;
  roleDisplayName: string;
  kpis: DashboardKpis;
  weeklyProductivity: WeeklyProductivityDay[];
  departments: DepartmentDashboardStat[];
  upcomingTasks: UpcomingTaskItem[];
  recentActivities: RecentActivityItem[];
  roleSpecificData: Record<string, any>;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/dashboard';
  private http = inject(HttpClient);

  readonly summary = signal<DashboardSummaryResponse | null>(null);
  readonly isLoading = signal<boolean>(true);

  readonly kpis = computed(() => this.summary()?.kpis ?? null);
  readonly weeklyProductivity = computed(() => this.summary()?.weeklyProductivity ?? []);
  readonly departments = computed(() => this.summary()?.departments ?? []);
  readonly upcomingTasks = computed(() => this.summary()?.upcomingTasks ?? []);
  readonly recentActivities = computed(() => this.summary()?.recentActivities ?? []);
  readonly roleSpecificData = computed(() => this.summary()?.roleSpecificData ?? {});
  readonly roleOverview = computed(() => (this.summary()?.roleSpecificData as any)?.overview ?? 'Live enterprise telemetry calculated from database records');

  loadSummary(): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<{ data: DashboardSummaryResponse }>(`${this.apiUrl}/summary`).pipe(
      tap((res) => {
        const payload = (res as any)?.data || res;
        this.summary.set(payload);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return of(null);
      }),
    );
  }
}
