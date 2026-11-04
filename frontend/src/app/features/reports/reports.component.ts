import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header & Export Toolbar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reports & Executive Intelligence
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-400">
              Live Telemetry
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Real-time cross-departmental analytics, ITSM SLA metrics, workforce utilization, and ISO 27001 audit logs.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Time Range Selector -->
          <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              *ngFor="let p of periods"
              type="button"
              (click)="selectPeriod(p.key)"
              [ngClass]="activePeriod() === p.key ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'"
              class="px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            >
              {{ p.label }}
            </button>
          </div>

          <!-- Real Export Buttons -->
          <button
            type="button"
            (click)="exportCurrentReport('csv')"
            [disabled]="isExporting()"
            class="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-base text-emerald-600">grid_on</span>
            Export CSV
          </button>

          <button
            type="button"
            (click)="exportCurrentReport('xlsx')"
            [disabled]="isExporting()"
            class="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-primary-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span
              *ngIf="isExporting()"
              class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            <span *ngIf="!isExporting()" class="material-icons text-base">file_download</span>
            {{ isExporting() ? 'Streaming Excel...' : 'Export Excel (.xlsx)' }}
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-px">
        <button
          type="button"
          (click)="switchTab('itsm')"
          [ngClass]="activeTab() === 'itsm' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'"
          class="px-4 py-2.5 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <span class="material-icons text-base">support_agent</span>
          ITSM Service Desk
        </button>

        <button
          type="button"
          (click)="switchTab('workforce')"
          [ngClass]="activeTab() === 'workforce' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'"
          class="px-4 py-2.5 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <span class="material-icons text-base">group_work</span>
          Workforce & Utilization
        </button>

        <button
          type="button"
          (click)="switchTab('audit')"
          [ngClass]="activeTab() === 'audit' ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium'"
          class="px-4 py-2.5 border-b-2 text-xs flex items-center gap-2 transition cursor-pointer"
        >
          <span class="material-icons text-base">verified_user</span>
          Security & Audit Trail
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading()" class="py-16 text-center text-slate-400">
        <span class="inline-block w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mb-3"></span>
        <p class="text-xs font-semibold">Aggregating Cross-Enterprise Telemetry...</p>
      </div>

      <!-- TAB 1: ITSM SERVICE DESK -->
      <div *ngIf="!isLoading() && activeTab() === 'itsm' && itsmData()" class="space-y-6">
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Tickets</span>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {{ itsmData().summary.totalTickets }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">
              {{ itsmData().summary.resolvedTickets }} resolved ({{ itsmData().summary.openTickets }} in queue)
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">SLA Achievement</span>
            <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {{ itsmData().summary.slaAchievementRate }}%
            </div>
            <div class="text-[10px] text-emerald-600/80 mt-0.5">
              {{ itsmData().summary.breachedCount }} SLA breaches recorded
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">Mean Time to Resolve</span>
            <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {{ itsmData().summary.meanTimeToResolutionHours }} hrs
            </div>
            <div class="text-[10px] text-blue-600/80 mt-0.5">
              Avg first response: {{ itsmData().summary.averageFirstResponseMinutes }}m
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">First Response SLA</span>
            <div class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {{ itsmData().summary.firstResponseComplianceRate }}%
            </div>
            <div class="text-[10px] text-purple-600/80 mt-0.5">Target: 95.0% threshold</div>
          </div>
        </div>

        <!-- Priority Matrix & Category Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Priority Distribution Table -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
              Severity Distribution & MTTR
            </div>
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/50 dark:bg-slate-800/40 text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th class="py-2.5 px-4">Priority</th>
                  <th class="py-2.5 px-4">Tickets</th>
                  <th class="py-2.5 px-4">Resolved</th>
                  <th class="py-2.5 px-4">Breached</th>
                  <th class="py-2.5 px-4">MTTR</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                <tr *ngFor="let p of itsmData().priorityDistribution" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                    {{ p.label }}
                  </td>
                  <td class="py-2.5 px-4">{{ p.count }}</td>
                  <td class="py-2.5 px-4 text-emerald-600 font-semibold">{{ p.resolved }}</td>
                  <td class="py-2.5 px-4" [ngClass]="p.slaBreached > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'">
                    {{ p.slaBreached }}
                  </td>
                  <td class="py-2.5 px-4 font-mono font-semibold">{{ p.avgResolutionHours }}h</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Category Breakdown List -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3">
            <div class="font-bold text-xs text-slate-800 dark:text-slate-200 mb-2">
              Incidents by Domain / Service Area
            </div>
            <div *ngFor="let cat of itsmData().categoryBreakdown" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-slate-700 dark:text-slate-300">{{ cat.category }}</span>
                <span class="text-slate-400 font-mono text-[11px]">{{ cat.count }} tickets ({{ cat.percentage }}%)</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div
                  class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  [style.width.%]="cat.percentage"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Technician Leaderboard -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
            Support Operations Leaderboard
          </div>
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/50 dark:bg-slate-800/40 text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="py-2.5 px-4">Technician</th>
                <th class="py-2.5 px-4">Role</th>
                <th class="py-2.5 px-4">Assigned</th>
                <th class="py-2.5 px-4">Resolved</th>
                <th class="py-2.5 px-4">Avg MTTR</th>
                <th class="py-2.5 px-4">CSAT Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              <tr *ngFor="let t of itsmData().technicianLeaderboard" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{{ t.name }}</td>
                <td class="py-2.5 px-4 text-slate-500">{{ t.role }}</td>
                <td class="py-2.5 px-4">{{ t.assigned }}</td>
                <td class="py-2.5 px-4 font-bold text-emerald-600">{{ t.resolved }}</td>
                <td class="py-2.5 px-4 font-mono">{{ t.avgResolutionHours }} hrs</td>
                <td class="py-2.5 px-4 flex items-center gap-1 text-amber-500 font-bold">
                  <span class="material-icons text-xs">star</span>
                  {{ t.satisfactionScore }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: WORKFORCE & PRODUCTIVITY -->
      <div *ngIf="!isLoading() && activeTab() === 'workforce' && workforceData()" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Logged Hours</span>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {{ workforceData().summary.totalLoggedHours }}h
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Across {{ workforceData().summary.activeLoggers }} active team members</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Billable Ratio</span>
            <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {{ workforceData().summary.billableUtilizationRate }}%
            </div>
            <div class="text-[10px] text-emerald-600/80 mt-0.5">{{ workforceData().summary.billableHours }}h client billable</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">Tasks Delivered</span>
            <div class="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {{ workforceData().summary.tasksCompleted }}
            </div>
            <div class="text-[10px] text-blue-600/80 mt-0.5">Closed in sprint cycle</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-purple-200 dark:border-purple-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">Daily Avg / Person</span>
            <div class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {{ workforceData().summary.averageHoursPerDay }}h
            </div>
            <div class="text-[10px] text-purple-600/80 mt-0.5">Target: 8.0h threshold</div>
          </div>
        </div>

        <!-- Department Utilization & Top Contributors -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
              Department Utilization Breakdown
            </div>
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/50 dark:bg-slate-800/40 text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th class="py-2.5 px-4">Department</th>
                  <th class="py-2.5 px-4">Headcount</th>
                  <th class="py-2.5 px-4">Hours</th>
                  <th class="py-2.5 px-4">Billable %</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                <tr *ngFor="let d of workforceData().departmentUtilization" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{{ d.department }}</td>
                  <td class="py-2.5 px-4">{{ d.headCount }}</td>
                  <td class="py-2.5 px-4 font-mono font-semibold">{{ d.totalHours }}h</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600">{{ d.billableRate }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
              Top Engineering & Ops Contributors
            </div>
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100/50 dark:bg-slate-800/40 text-[10px] text-slate-500 uppercase tracking-wider">
                <tr>
                  <th class="py-2.5 px-4">Employee</th>
                  <th class="py-2.5 px-4">Department</th>
                  <th class="py-2.5 px-4">Logged</th>
                  <th class="py-2.5 px-4">Tasks</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                <tr *ngFor="let c of workforceData().topContributors" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">{{ c.name }}</td>
                  <td class="py-2.5 px-4 text-slate-500">{{ c.department }}</td>
                  <td class="py-2.5 px-4 font-mono font-semibold text-primary-600">{{ c.hoursLogged }}h</td>
                  <td class="py-2.5 px-4 font-bold text-emerald-600">{{ c.tasksClosed }} closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 3: SECURITY & AUDIT TRAIL -->
      <div *ngIf="!isLoading() && activeTab() === 'audit' && auditData()" class="space-y-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Audit Events</span>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {{ auditData().summary.totalAuditEvents }}
            </div>
            <div class="text-[10px] text-slate-400 mt-0.5">Immutable activity entries</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-rose-600 dark:text-rose-400 tracking-wider">Failed Logins</span>
            <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {{ auditData().summary.failedLogins }}
            </div>
            <div class="text-[10px] text-rose-600/80 mt-0.5">{{ auditData().summary.rateLimitLockouts }} rate-limit blocks</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">Credential Resets</span>
            <div class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {{ auditData().summary.passwordResets }}
            </div>
            <div class="text-[10px] text-amber-600/80 mt-0.5">{{ auditData().summary.sessionRevocations }} sessions revoked</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/40 shadow-sm">
            <span class="text-[11px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Privilege Elevations</span>
            <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {{ auditData().summary.roleElevations }}
            </div>
            <div class="text-[10px] text-indigo-600/80 mt-0.5">{{ auditData().summary.bulkExports }} exports audited</div>
          </div>
        </div>

        <!-- Audit Trail Table -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200">
            Recent Security & Identity Governance Events
          </div>
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100/50 dark:bg-slate-800/40 text-[10px] text-slate-500 uppercase tracking-wider">
              <tr>
                <th class="py-2.5 px-4">Timestamp</th>
                <th class="py-2.5 px-4">Event</th>
                <th class="py-2.5 px-4">Actor</th>
                <th class="py-2.5 px-4">IP</th>
                <th class="py-2.5 px-4">Severity</th>
                <th class="py-2.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              <tr *ngFor="let ev of auditData().recentSecurityEvents" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono">
                <td class="py-2.5 px-4 text-slate-400 text-[10px]">
                  {{ ev.timestamp | date:'short' }}
                </td>
                <td class="py-2.5 px-4 font-bold text-slate-900 dark:text-white">
                  {{ ev.eventType }}
                </td>
                <td class="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                  {{ ev.actorEmail }}
                </td>
                <td class="py-2.5 px-4 text-slate-500">
                  {{ ev.ipAddress }}
                </td>
                <td class="py-2.5 px-4 font-sans">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    [ngClass]="getSeverityClass(ev.severity)"
                  >
                    {{ ev.severity }}
                  </span>
                </td>
                <td class="py-2.5 px-4 font-sans text-slate-700 dark:text-slate-300">
                  {{ ev.details }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent implements OnInit {
  reportService = inject(ReportService);
  authService = inject(AuthService);

  activeTab = signal<'itsm' | 'workforce' | 'audit'>('itsm');
  activePeriod = signal<string>('30d');
  isLoading = signal(false);
  isExporting = signal(false);

  itsmData = signal<any | null>(null);
  workforceData = signal<any | null>(null);
  auditData = signal<any | null>(null);

  periods = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: 'all', label: 'All-Time' },
  ];

  ngOnInit() {
    this.loadCurrentTab();
  }

  selectPeriod(p: string) {
    this.activePeriod.set(p);
    this.loadCurrentTab();
  }

  switchTab(tab: 'itsm' | 'workforce' | 'audit') {
    this.activeTab.set(tab);
    this.loadCurrentTab();
  }

  loadCurrentTab() {
    this.isLoading.set(true);
    const tab = this.activeTab();

    if (tab === 'itsm') {
      this.reportService.getItsmReport().subscribe({
        next: (res) => {
          this.itsmData.set(res.data || res);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    } else if (tab === 'workforce') {
      this.reportService.getWorkforceReport().subscribe({
        next: (res) => {
          this.workforceData.set(res.data || res);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    } else {
      this.reportService.getAuditReport().subscribe({
        next: (res) => {
          this.auditData.set(res.data || res);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  exportCurrentReport(format: 'xlsx' | 'csv') {
    this.isExporting.set(true);
    const tab = this.activeTab();

    this.reportService.exportReport(tab, format).subscribe({
      next: (blob) => {
        this.isExporting.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `q_clocker_${tab}_report.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.isExporting.set(false);
        alert('Export failed. Please check backend connection.');
      },
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
