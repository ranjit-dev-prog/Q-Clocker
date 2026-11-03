import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkLogService, WorkLogItem, CreateWorkLogPayload } from '../../core/services/work-log.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-work-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Ticket & Work Logs</h1>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              Audit Ready
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">Honest, qualitative daily engineering logs, investigation actions, and deliverables</p>
        </div>

        <button
          (click)="showCreateModal.set(true)"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start"
        >
          <span class="material-icons text-base">add_circle</span>
          Log Daily Hours
        </button>
      </div>

      <!-- Daily Metric Summary -->
      <div *ngIf="workLogService.dailySummary() as s" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Hours Logged ({{ s.date }})</div>
          <div class="text-2xl font-bold text-slate-900 dark:text-white mt-1">{{ s.totalHours }}h</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">Log Entries</div>
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ s.totalEntries }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-purple-500 uppercase tracking-wider">Active Contributors</div>
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ s.activeEmployees }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Audit Status</div>
          <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Compliant</div>
        </div>
      </div>

      <!-- Logs Container -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white">Daily Work Log Entries</h3>
          <span class="text-xs text-slate-400 font-mono">{{ workLogService.logs().length }} entries recorded</span>
        </div>

        <div class="space-y-3">
          <div
            *ngFor="let log of workLogService.logs()"
            class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3 hover:border-slate-200 dark:hover:border-slate-700 transition"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300">
                  {{ log.referenceId }}
                </span>
                <span class="font-bold text-xs text-slate-900 dark:text-white">{{ log.employeeName }}</span>
                <span class="text-[11px] text-slate-400">• {{ log.logDate }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{{ log.startTime }} - {{ log.endTime }} ({{ log.totalHours }}h)</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {{ log.status }}
                </span>
              </div>
            </div>

            <!-- Work Description -->
            <div class="text-xs text-slate-700 dark:text-slate-300">
              <div class="font-semibold text-slate-900 dark:text-white mb-0.5">Summary:</div>
              <p>{{ log.workDescription }}</p>
            </div>

            <!-- Investigation & Actions -->
            <div *ngIf="log.investigationPerformed || log.actionsTaken" class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900/80 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <div *ngIf="log.investigationPerformed">
                <span class="font-semibold text-slate-500 text-[11px]">Investigation Performed:</span>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">{{ log.investigationPerformed }}</p>
              </div>
              <div *ngIf="log.actionsTaken">
                <span class="font-semibold text-slate-500 text-[11px]">Actions Taken:</span>
                <p class="text-slate-600 dark:text-slate-300 mt-0.5">{{ log.actionsTaken }}</p>
              </div>
            </div>

            <!-- Challenges Faced -->
            <div *ngIf="log.challengesFaced" class="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
              <span class="material-icons text-sm">warning</span>
              <span><strong>Blocker / Challenge:</strong> {{ log.challengesFaced }}</span>
            </div>
          </div>

          <div *ngIf="workLogService.logs().length === 0" class="py-8 text-center text-xs text-slate-400 italic">
            No work logs logged for this period. Click 'Log Daily Hours' to record your activity.
          </div>
        </div>
      </div>

      <!-- CREATE WORK LOG MODAL -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Record Daily Work Log</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  [(ngModel)]="newLogDate"
                  class="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <input
                  type="time"
                  [(ngModel)]="newStartTime"
                  class="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                <input
                  type="time"
                  [(ngModel)]="newEndTime"
                  class="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Description *</label>
              <textarea
                [(ngModel)]="newWorkDescription"
                rows="2"
                placeholder="What was designed, coded, or solved today?"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Investigation Performed</label>
              <input
                type="text"
                [(ngModel)]="newInvestigation"
                placeholder="Diagnostic logs analyzed, test cases verified..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Actions Taken</label>
              <input
                type="text"
                [(ngModel)]="newActionsTaken"
                placeholder="PR merged, configuration deployed, bug patched..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Challenges Faced (Optional)</label>
              <input
                type="text"
                [(ngModel)]="newChallenges"
                placeholder="Network latency, environment blockers, missing specs..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showCreateModal.set(false)"
              class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              [disabled]="!newWorkDescription.trim() || isSubmitting()"
              (click)="submitLog()"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              {{ isSubmitting() ? 'Saving...' : 'Save Log Entry' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class WorkLogsComponent implements OnInit {
  workLogService = inject(WorkLogService);
  authService = inject(AuthService);

  showCreateModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  newLogDate = new Date().toISOString().substring(0, 10);
  newStartTime = '09:00';
  newEndTime = '13:00';
  newWorkDescription = '';
  newInvestigation = '';
  newActionsTaken = '';
  newChallenges = '';

  ngOnInit() {
    this.workLogService.loadLogs().subscribe();
    this.workLogService.loadDailySummary().subscribe();
  }

  submitLog() {
    if (!this.newWorkDescription.trim()) return;
    this.isSubmitting.set(true);

    // Calculate duration in hours
    const [sH, sM] = this.newStartTime.split(':').map(Number);
    const [eH, eM] = this.newEndTime.split(':').map(Number);
    let totalMinutes = eH * 60 + eM - (sH * 60 + sM);
    if (totalMinutes <= 0) totalMinutes = 240; // Default 4h if negative or equal
    const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

    const payload: CreateWorkLogPayload = {
      logDate: this.newLogDate,
      startTime: this.newStartTime,
      endTime: this.newEndTime,
      totalHours,
      workDescription: this.newWorkDescription.trim(),
      investigationPerformed: this.newInvestigation.trim() || undefined,
      actionsTaken: this.newActionsTaken.trim() || undefined,
      challengesFaced: this.newChallenges.trim() || undefined,
    };

    this.workLogService.createWorkLog(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.newWorkDescription = '';
        this.newInvestigation = '';
        this.newActionsTaken = '';
        this.newChallenges = '';
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
