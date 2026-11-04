import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService } from '../../core/services/performance.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Performance & Appraisal Analytics</span>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950/80 dark:text-primary-300">
              Database Driven
            </span>
          </h1>
          <p class="text-xs text-slate-400 mt-1">Multi-factor performance evaluations based on task complexity, deliverable quality, SLA timeliness, and leadership review</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            Period: {{ perfService.evaluation()?.period || 'Current Evaluation Cycle' }}
          </span>
          <button
            (click)="perfService.loadMyPerformance().subscribe()"
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span class="material-icons text-sm" [class.animate-spin]="perfService.isLoading()">sync</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="perfService.isLoading()" class="p-12 text-center text-slate-500">
        <span class="material-icons animate-spin text-3xl text-primary-600">sync</span>
        <p class="mt-2 text-sm font-medium">Fetching performance appraisal telemetry from database...</p>
      </div>

      <div *ngIf="!perfService.isLoading() && perfService.evaluation() as e" class="space-y-6">
        <!-- Score Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Performance Score</div>
            <div class="text-4xl font-black text-primary-600 dark:text-primary-400 mt-2">{{ e.overallScore }}</div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">{{ e.tierRanking }}</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Complexity Factor</div>
            <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">{{ e.complexityFactor }} / 5.0</div>
            <div class="text-[11px] text-slate-400 mt-1">Based on active deliverables</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Timeliness & Delivery</div>
            <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">{{ e.timelinessRate }}%</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">{{ e.overdueTasksCount }} Overdue Tasks</div>
          </div>

          <div class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Manager Quality Rating</div>
            <div class="text-3xl font-bold text-slate-800 dark:text-white mt-2">{{ e.managerRating }} / 5.0</div>
            <div class="text-[11px] text-slate-400 mt-1">Reviewed by {{ e.reviewerName }}</div>
          </div>
        </div>

        <!-- Detailed Breakdown & Qualitative Feedback -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Quantitative Multi-Factor Breakdown -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-icons text-primary-600 text-lg">insights</span>
              Appraisal Factor Breakdown
            </h3>

            <div class="space-y-4 pt-2">
              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Technical Execution & Architecture</span>
                  <span class="text-primary-600">{{ e.breakdown.technicalExecution }}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-primary-600 h-full rounded-full transition-all" [style.width.%]="e.breakdown.technicalExecution"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Code Quality & Testing Rigor</span>
                  <span class="text-primary-600">{{ e.breakdown.codeQuality }}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-600 h-full rounded-full transition-all" [style.width.%]="e.breakdown.codeQuality"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Cross-Functional Team Collaboration</span>
                  <span class="text-primary-600">{{ e.breakdown.collaboration }}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-teal-600 h-full rounded-full transition-all" [style.width.%]="e.breakdown.collaboration"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>SLA Adherence & Ticket Resolution</span>
                  <span class="text-primary-600">{{ e.breakdown.slaAdherence }}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div class="bg-emerald-600 h-full rounded-full transition-all" [style.width.%]="e.breakdown.slaAdherence"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Manager Feedback Box -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <span class="material-icons text-emerald-600 text-lg">rate_review</span>
                Evaluator Feedback & Recommendations
              </h3>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "{{ e.feedbackNotes }}"
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Reviewed by: <strong class="text-slate-700 dark:text-slate-200">{{ e.reviewerName }}</strong></span>
              <span class="text-emerald-600 font-bold flex items-center gap-1">
                <span class="material-icons text-sm">verified</span> Verified Evaluation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PerformanceComponent implements OnInit {
  perfService = inject(PerformanceService);
  authService = inject(AuthService);

  ngOnInit() {
    this.perfService.loadMyPerformance().subscribe();
  }
}
