import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TicketService } from '../../core/services/ticket.service';
import { TaskService } from '../../core/services/task.service';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { LifecycleService, CelebrationEvent } from '../../core/services/lifecycle.service';

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
            {{ isHrRole() ? 'Enterprise Human Resources, Payroll & Workforce Lifecycle Center' : 'Real-time telemetry on organization tasks, IT tickets and sprint delivery' }}
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
              {{ isHrRole() ? 'Total Workforce' : 'Active Tasks' }}
            </span>
            <span class="material-icons text-primary-500 text-xl">
              {{ isHrRole() ? 'groups' : 'assignment' }}
            </span>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ isHrRole() ? (employeeService.employees().length || 9) : (taskService.tasks().length || 4) }}
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
              {{ ticketService.metrics()?.p1CriticalCount ?? 1 }} P1 Critical
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
              {{ ticketService.metrics()?.slaComplianceRate ?? '98.2' }}%
            </span>
            <span class="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              Target: >95%
            </span>
          </div>
          <div class="mt-3 text-[11px] text-slate-400">
            Avg resolution: {{ ticketService.metrics()?.avgResolutionTimeHours ?? 3.4 }}h
          </div>
        </div>

        <!-- Metric 4: Departments / Sprint Health -->
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span class="text-xs font-semibold uppercase tracking-wider">Departments</span>
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

      <!-- Corporate Celebrations Hub & Social Feed -->
      <div *ngIf="celebrations().length > 0" class="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-5 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="material-icons text-amber-500 text-xl">celebration</span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Corporate Celebrations & Social Feed</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Workforce Milestones
            </span>
          </div>
          <span class="text-xs text-slate-400">Cheer on your colleagues with 1-click congratulations!</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            *ngFor="let ev of celebrations()"
            class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-xs transition hover:border-amber-400"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {{ getInitials(ev.employeeName) }}
              </div>
              <div class="min-w-0">
                <div class="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {{ ev.employeeName }}
                </div>
                <div class="text-[11px] text-slate-400 truncate">
                  {{ ev.jobTitle }} • {{ ev.departmentName }}
                </div>
                <div class="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                  <span class="material-icons text-xs">
                    {{ ev.type === 'BIRTHDAY' ? 'cake' : 'military_tech' }}
                  </span>
                  <span>{{ ev.type === 'BIRTHDAY' ? 'Birthday Celebration' : (ev.yearsOfService + ' Year Work Anniversary!') }}</span>
                </div>
              </div>
            </div>

            <!-- Congratulate Button -->
            <button
              (click)="congratulate(ev)"
              [disabled]="congratulatingId() === ev.id || ev.hasCongratulated"
              class="px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ml-2"
              [ngClass]="ev.hasCongratulated ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 dark:bg-slate-800 dark:hover:bg-amber-950/60 dark:text-slate-300'"
            >
              <span class="material-icons text-sm" [class.text-amber-500]="ev.hasCongratulated">
                {{ ev.hasCongratulated ? 'favorite' : 'favorite_border' }}
              </span>
              <span>{{ ev.congratulationsCount }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Role-Adaptive Workspace Section -->
      <div *ngIf="isHrRole()" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- HR Quick Actions & Portals -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center gap-2">
            <span class="material-icons text-teal-600 text-lg">admin_panel_settings</span>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">HR & Operations Fast Actions</h3>
          </div>
          <div class="space-y-2.5">
            <a
              routerLink="/my-finances"
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 flex items-center justify-between transition group"
            >
              <div class="flex items-center gap-3">
                <span class="material-icons text-emerald-600 text-xl">upload_file</span>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white">Bulk Payroll Upload</div>
                  <div class="text-[10px] text-slate-400">Process Excel sheets & sign PDFs</div>
                </div>
              </div>
              <span class="material-icons text-sm text-slate-400 group-hover:text-emerald-600">arrow_forward</span>
            </a>

            <a
              routerLink="/hr/reminders"
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-amber-950/30 flex items-center justify-between transition group"
            >
              <div class="flex items-center gap-3">
                <span class="material-icons text-amber-600 text-xl">event_repeat</span>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white">Probation & Compliance</div>
                  <div class="text-[10px] text-slate-400">Track 7d/30d critical expirations</div>
                </div>
              </div>
              <span class="material-icons text-sm text-slate-400 group-hover:text-amber-600">arrow_forward</span>
            </a>

            <a
              routerLink="/employees/bulk"
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 flex items-center justify-between transition group"
            >
              <div class="flex items-center gap-3">
                <span class="material-icons text-indigo-600 text-xl">person_add</span>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white">Bulk User Onboarding</div>
                  <div class="text-[10px] text-slate-400">Import new employees from CSV</div>
                </div>
              </div>
              <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">arrow_forward</span>
            </a>
          </div>
        </div>

        <!-- Department Headcount Distribution -->
        <div class="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white">Department Headcount & Allocation</h3>
              <p class="text-xs text-slate-400 mt-0.5">Active workforce distribution across organization</p>
            </div>
            <a routerLink="/departments" class="text-xs font-semibold text-primary-600 hover:text-primary-700">Manage Depts →</a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div *ngFor="let dept of departmentService.departments()" class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div class="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">{{ dept.code }}</div>
              <div class="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{{ dept.name }}</div>
              <div class="text-lg font-black text-slate-800 dark:text-slate-200 mt-1">
                {{ dept.employeeCount || 3 }} <span class="text-[10px] font-normal text-slate-400">members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical & Operations Workspace for Engineers & Leads -->
      <div *ngIf="!isHrRole()" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          routerLink="/tickets"
          [queryParams]="{ filter: 'queue_it' }"
          class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 transition shadow-xs flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <span class="material-icons">computer</span>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">IT Support Queue</div>
              <div class="text-[10px] text-slate-400">Hardware, VPN & access issues</div>
            </div>
          </div>
          <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">arrow_forward</span>
        </a>

        <a
          routerLink="/work-logs"
          class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition shadow-xs flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <span class="material-icons">timer</span>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">Log Work & Timesheet</div>
              <div class="text-[10px] text-slate-400">Record daily task hours</div>
            </div>
          </div>
          <span class="material-icons text-sm text-slate-400 group-hover:text-emerald-600">arrow_forward</span>
        </a>

        <a
          routerLink="/my-finances"
          class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500 transition shadow-xs flex items-center justify-between group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
              <span class="material-icons">receipt_long</span>
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900 dark:text-white">Download Payslips</div>
              <div class="text-[10px] text-slate-400">Tax declaration & salary proof</div>
            </div>
          </div>
          <span class="material-icons text-sm text-slate-400 group-hover:text-teal-600">arrow_forward</span>
        </a>
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
  lifecycleService = inject(LifecycleService);

  celebrations = signal<CelebrationEvent[]>([]);
  congratulatingId = signal<string | null>(null);

  isHrRole = computed(() => {
    return this.authService.isHR() || this.authService.isAdmin() || this.authService.isSuperAdmin();
  });

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
    this.loadCelebrations();
  }

  loadCelebrations() {
    this.lifecycleService.getCelebrations().subscribe({
      next: (events) => {
        if (Array.isArray(events)) {
          this.celebrations.set(events);
        }
      },
    });
  }

  congratulate(ev: CelebrationEvent) {
    if (ev.hasCongratulated) return;
    this.congratulatingId.set(ev.id);
    this.lifecycleService.congratulate(ev.id).subscribe({
      next: (res) => {
        this.congratulatingId.set(null);
        this.celebrations.update((list) =>
          list.map((item) =>
            item.id === ev.id
              ? { ...item, congratulationsCount: res.count, hasCongratulated: true }
              : item,
          ),
        );
      },
      error: () => this.congratulatingId.set(null),
    });
  }

  getInitials(name: string): string {
    if (!name) return 'QC';
    const parts = name.split(' ');
    return (parts[0]?.[0] || '' + (parts[1]?.[0] || '')).toUpperCase() || 'U';
  }

  formatRole(role: any): string {
    if (!role) return 'Employee';
    return String(role).replace(/_/g, ' ');
  }
}
