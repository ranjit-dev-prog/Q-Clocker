import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-work-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Timesheet & Work Logs</h1>
          <p class="text-xs text-slate-400 mt-1">Honest, transparent daily activity records without invasive surveillance</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start">
          <span class="material-icons text-base">add_circle</span>
          Log Daily Hours
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-4">Today's Timesheet Entry (Nov 3, 2026)</h3>
        <div class="space-y-3">
          <div *ngFor="let log of logs" class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">{{ log.task }}</div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ log.description }}</p>
              <div *ngIf="log.challenges" class="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <span class="material-icons text-xs">warning</span>
                <span>Challenges: {{ log.challenges }}</span>
              </div>
            </div>
            <div class="flex items-center gap-6 shrink-0 text-right">
              <div>
                <div class="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{{ log.time }}</div>
                <div class="text-[11px] text-slate-400">{{ log.hours }} hours logged</div>
              </div>
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {{ log.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class WorkLogsComponent {
  authService = inject(AuthService);

  logs = [
    { task: 'TSK-2026-001 • Drizzle ORM Schema & Relational Models', time: '09:00 - 13:00', hours: 4.0, description: 'Engineered normalized database schemas with proper foreign keys, constraints, and DDL migrations.', challenges: 'Resolving circular relation between departments and manager users.', status: 'APPROVED' },
    { task: 'TSK-2026-002 • Angular Standalone Shell & Tailwind Layout', time: '14:00 - 17:30', hours: 3.5, description: 'Crafted responsive enterprise layout with theme toggling and live role switching.', status: 'SUBMITTED' },
  ];
}

