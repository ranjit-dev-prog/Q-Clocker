import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Organizational Analytics</h1>
          <p class="text-xs text-slate-400 mt-1">Exportable audit and productivity data across all divisions</p>
        </div>
        <!-- Export Actions -->
        <div class="flex items-center gap-2">
          <button (click)="exportReport('CSV')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5">
            <span class="material-icons text-sm">grid_on</span> Export CSV
          </button>
          <button (click)="exportReport('Excel')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5">
            <span class="material-icons text-sm">table_view</span> Export Excel
          </button>
          <button (click)="exportReport('PDF')" class="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5">
            <span class="material-icons text-sm">picture_as_pdf</span> Export PDF
          </button>
        </div>
      </div>

      <!-- Report Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div *ngFor="let rep of reportTemplates" class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center mb-3">
              <span class="material-icons text-lg">{{ rep.icon }}</span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white">{{ rep.title }}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ rep.description }}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">{{ rep.cadence }}</span>
            <button (click)="exportReport(rep.title)" class="text-xs font-semibold text-primary-600 hover:text-primary-700">Generate Report →</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReportsComponent {
  authService = inject(AuthService);

  reportTemplates = [
    { title: 'Daily Employee Task Reports', description: 'Complete breakdown of tasks assigned, in progress, and closed daily.', icon: 'today', cadence: 'Daily refresh' },
    { title: 'Department-Wise Performance', description: 'Productivity velocities, completion rates, and average resolution hours.', icon: 'corporate_fare', cadence: 'Weekly rollup' },
    { title: 'IT SLA & Resolution Audits', description: 'Ticket life-cycles, breach occurrences, and technician workload distributions.', icon: 'verified_user', cadence: 'Real-time telemetry' },
    { title: 'Overdue Task & Escalations', description: 'Root-cause tracking for overdue assignments and bottlenecks.', icon: 'alarm_on', cadence: 'Continuous monitoring' },
    { title: 'Employee Timesheet Summaries', description: 'Aggregated work hours, challenges reported, and output reviews.', icon: 'schedule', cadence: 'Monthly payroll aligned' },
  ];

  exportReport(formatOrName: string) {
    alert(`Export initiated for ${formatOrName}. Your download is being prepared.`);
  }
}

