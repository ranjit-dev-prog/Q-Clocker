import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import { TaskService } from '../../core/services/task.service';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Welcome back, {{ authService.currentUser()?.firstName }}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 uppercase">
              {{ formatRole(authService.userRole()) }}
            </span>
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time telemetry on organization tasks, IT tickets and employee performance
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live & Monitored
          </div>
          <a
            routerLink="/tasks"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-base">add</span>
            Create Task
          </a>
        </div>
      </div>

      <!-- Top Metric Cards Grid (Dynamic based on Role) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Metric 1: Workforce / Assigned Tasks -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span class="text-xs font-semibold uppercase tracking-wider">
              {{ authService.isAdmin() ? 'Total Workforce' : 'Active Tasks' }}
            </span>
            <span class="material-icons text-primary-500 text-xl">
              {{ authService.isAdmin() ? 'groups' : 'assignment' }}
            </span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ authService.isAdmin() ? (employeeService.employees().length || 9) : (taskService.tasks().length || 4) }}
            </span>
            <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              Active Today
            </span>
          </div>
          <div class="mt-3 text-[11px] text-slate-400">
            Across IT, Software Engineering & HR
          </div>
        </div>

        <!-- Metric 2: Open Tickets -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span class="text-xs font-semibold uppercase tracking-wider">ITSM Tickets</span>
            <span class="material-icons text-amber-500 text-xl">confirmation_number</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ ticketService.metrics()?.openTickets ?? 4 }} Open
            </span>
            <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded">
              {{ ticketService.metrics()?.criticalTickets ?? 1 }} P1 Critical
            </span>
          </div>
          <div class="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-1.5 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <!-- Metric 3: SLA Compliance Rate -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span class="text-xs font-semibold uppercase tracking-wider">SLA Compliance</span>
            <span class="material-icons text-emerald-500 text-xl">verified</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-emerald-600">
              {{ ticketService.metrics()?.slaComplianceRate ?? 98.2 }}%
            </span>
            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              Target: >95%
            </span>
          </div>
          <div class="mt-3 text-[11px] text-slate-400">
            Avg resolution: {{ ticketService.metrics()?.averageResolutionHours ?? 3.4 }}h
          </div>
        </div>

        <!-- Metric 4: Departments / Sprint Health -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span class="text-xs font-semibold uppercase tracking-wider">Departments Active</span>
            <span class="material-icons text-cyan-500 text-xl">corporate_fare</span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ departmentService.departments().length || 4 }} Depts
            </span>
            <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              100% Operational
            </span>
          </div>
          <div class="mt-3 text-[11px] text-slate-400">
            Engineering, IT, HR & Operations
          </div>
        </div>
      </div>

      <!-- Middle Section: Visual Performance Charts & Department Distribution -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Daily Task Completion & Weekly Productivity -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                Weekly Productivity & Task Velocity
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Estimated vs Actual Hours across sprints</p>
            </div>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Current Sprint
            </span>
          </div>

          <div class="space-y-4 pt-2">
            <div *ngFor="let day of weeklyStats" class="space-y-1">
              <div class="flex justify-between text-xs font-medium">
                <span class="text-slate-600 dark:text-slate-300">{{ day.day }}</span>
                <span class="text-slate-400">{{ day.completed }} / {{ day.total }} tasks ({{ day.hours }}h logged)</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div class="bg-primary-600 h-full rounded-l-full" [style.width.%]="(day.completed / day.total) * 100"></div>
                <div class="bg-amber-400 h-full" [style.width.%]="((day.total - day.completed) / day.total) * 100"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Department-Wise Performance -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">
              Department Performance
            </h3>
            <p class="text-xs text-slate-400 mb-4">Quality & timely delivery scores</p>

            <div class="space-y-3.5">
              <div *ngFor="let dept of departments" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div class="text-xs font-bold text-slate-800 dark:text-slate-200">{{ dept.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ dept.code }} • {{ dept.tasks }} active tasks</div>
                </div>
                <div class="text-right">
                  <span class="text-sm font-black text-primary-600 dark:text-primary-400">{{ dept.score }}%</span>
                  <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{{ dept.trend }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <a routerLink="/reports" class="text-xs font-semibold text-primary-600 hover:text-primary-700">
              View Detailed Analytics Report →
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Tables: Recent Activities & Upcoming Deadlines -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Upcoming Deadlines -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
            <a routerLink="/tasks" class="text-xs font-medium text-primary-600 hover:text-primary-700">View All</a>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div *ngFor="let t of upcomingTasks" class="py-3 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {{ t.title }}
                </div>
                <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">{{ t.code }}</span>
                  <span>{{ t.assignee }}</span>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <span class="text-xs font-semibold" [class.text-rose-600]="t.isUrgent" [class.text-amber-600]="!t.isUrgent">
                  {{ t.due }}
                </span>
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5"
                  [class.bg-rose-50]="t.isUrgent"
                  [class.text-rose-700]="t.isUrgent"
                  [class.bg-amber-50]="!t.isUrgent"
                  [class.text-amber-700]="!t.isUrgent"
                >
                  {{ t.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities Feed -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Recent Activities</h3>
            <span class="text-xs text-slate-400">Live Feed</span>
          </div>

          <div class="space-y-3.5">
            <div *ngFor="let act of recentActivities" class="flex items-start gap-3 text-xs">
              <div class="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-primary-600 shrink-0 mt-0.5">
                <span class="material-icons text-sm">{{ act.icon }}</span>
              </div>
              <div class="flex-1">
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ act.user }}</span>
                <span class="text-slate-500 dark:text-slate-400"> {{ act.action }} </span>
                <span class="font-medium text-slate-900 dark:text-white">"{{ act.target }}"</span>
                <div class="text-[10px] text-slate-400 mt-0.5">{{ act.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  ticketService = inject(TicketService);
  taskService = inject(TaskService);
  employeeService = inject(EmployeeService);
  departmentService = inject(DepartmentService);

  weeklyStats = [
    { day: 'Monday', completed: 28, total: 30, hours: 224 },
    { day: 'Tuesday', completed: 32, total: 35, hours: 256 },
    { day: 'Wednesday', completed: 30, total: 32, hours: 240 },
    { day: 'Thursday', completed: 26, total: 30, hours: 215 },
    { day: 'Friday', completed: 24, total: 28, hours: 198 },
  ];

  departments = [
    { name: 'Software Engineering', code: 'ENG', tasks: 18, score: 94.8, trend: '+2.4%' },
    { name: 'Information Technology', code: 'IT', tasks: 12, score: 96.2, trend: '+1.8%' },
    { name: 'Operations & Delivery', code: 'OPS', tasks: 8, score: 91.5, trend: '+0.5%' },
    { name: 'Human Resources', code: 'HR', tasks: 6, score: 93.0, trend: '+1.1%' },
  ];

  upcomingTasks = [
    { code: 'ENG-2026-042', title: 'PostgreSQL Connection Pool Rightsizing', assignee: 'David Ross', due: 'Today, 5:00 PM', priority: 'CRITICAL', isUrgent: true },
    { code: 'IT-2026-018', title: 'Active Directory SSO Certificate Renewal', assignee: 'Marcus Chen', due: 'Tomorrow, 12:00 PM', priority: 'HIGH', isUrgent: false },
    { code: 'OPS-2026-009', title: 'SOC2 Type II Audit Artifact Assembly', assignee: 'Sarah Jenkins', due: 'Nov 6, 2026', priority: 'MEDIUM', isUrgent: false },
  ];

  recentActivities = [
    { user: 'David Ross', action: 'submitted task for review', target: 'Drizzle ORM DDL Migration Script', time: '12 mins ago', icon: 'done_all' },
    { user: 'Marcus Chen', action: 'resolved ticket', target: 'VPN Gateway Timeout in EU Region', time: '45 mins ago', icon: 'check_circle' },
    { user: 'Sarah Jenkins', action: 'approved work log', target: 'Backend API Authentication Endpoints', time: '2 hours ago', icon: 'thumb_up' },
    { user: 'Alexander Vance', action: 'configured department policy', target: 'Q4 Performance Evaluation Metric', time: '3 hours ago', icon: 'settings' },
  ];

  ngOnInit() {
    this.ticketService.loadMetrics().subscribe();
    this.ticketService.loadTickets().subscribe();
    this.taskService.loadTasks();
    this.employeeService.loadEmployees();
    this.departmentService.loadDepartments();
  }

  formatRole(role: any): string {
    if (!role) return 'Employee';
    return String(role).replace(/_/g, ' ');
  }
}
