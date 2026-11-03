import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Performance Analytics</h1>
          <p class="text-xs text-slate-400 mt-1">Multi-factor performance evaluations based on complexity, quality, timeliness, and manager feedback</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            Period: October - November 2026
          </span>
        </div>
      </div>

      <!-- Score Card -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Performance Score</div>
          <div class="text-4xl font-black text-primary-600 dark:text-primary-400 mt-2">94.2</div>
          <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Top 5% in Department</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Complexity Factor</div>
          <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">4.8 / 5.0</div>
          <div class="text-[11px] text-slate-400 mt-1">Architecture & Infrastructure</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Timeliness & Delivery</div>
          <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">96.5%</div>
          <div class="text-[11px] text-emerald-600 font-semibold mt-1">Zero Overdue Tasks</div>
        </div>

        <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manager Quality Rating</div>
          <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">4.9 / 5.0</div>
          <div class="text-[11px] text-slate-400 mt-1">Reviewed by Marcus Chen</div>
        </div>
      </div>
    </div>
  `,
})
export class PerformanceComponent {
  authService = inject(AuthService);
}

