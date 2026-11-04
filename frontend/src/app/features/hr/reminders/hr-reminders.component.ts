import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LifecycleService, HrReminder } from '../../../core/services/lifecycle.service';

@Component({
  selector: 'app-hr-reminders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/10">
        <div>
          <div class="flex items-center gap-2 text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <span class="material-icons text-base">event_repeat</span>
            <span>Workforce Compliance & Lifecycle Engine</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">HR Reminders & Compliance Tracker</h1>
          <p class="text-amber-50 text-sm mt-1 max-w-xl">
            Proactively track probationary periods, expiring employment contracts, compliance certifications and visa deadlines across all departments.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            (click)="loadReminders()"
            class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white text-amber-800 hover:bg-amber-50 transition shadow-sm flex items-center gap-2"
          >
            <span class="material-icons text-base" [class.animate-spin]="isLoading()">sync</span>
            <span>Refresh Alerts</span>
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div (click)="selectedUrgency.set('ALL')" class="cursor-pointer bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm transition hover:border-amber-400" [class.border-amber-500]="selectedUrgency() === 'ALL'">
          <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Reminders</div>
          <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">{{ reminders().length }}</div>
          <div class="text-xs text-slate-500 mt-1">Pending HR action</div>
        </div>

        <div (click)="selectedUrgency.set('CRITICAL')" class="cursor-pointer bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm transition hover:border-rose-400" [class.border-rose-500]="selectedUrgency() === 'CRITICAL'">
          <div class="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
            <span class="material-icons text-xs">warning</span> Critical (&lt; 7 Days)
          </div>
          <div class="text-2xl font-black text-rose-600 mt-1">{{ criticalCount() }}</div>
          <div class="text-xs text-rose-500/80 mt-1">Immediate action mandatory</div>
        </div>

        <div (click)="selectedUrgency.set('UPCOMING')" class="cursor-pointer bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-sm transition hover:border-amber-400" [class.border-amber-500]="selectedUrgency() === 'UPCOMING'">
          <div class="text-xs font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1">
            <span class="material-icons text-xs">schedule</span> Upcoming (&lt; 30 Days)
          </div>
          <div class="text-2xl font-black text-amber-600 mt-1">{{ upcomingCount() }}</div>
          <div class="text-xs text-amber-500/80 mt-1">Review scheduled</div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div class="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
            <span class="material-icons text-xs">verified</span> Probation Passes
          </div>
          <div class="text-2xl font-black text-emerald-600 mt-1">{{ resolvedCount() }}</div>
          <div class="text-xs text-slate-500 mt-1">Resolved this quarter</div>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div *ngIf="actionToast()" class="p-4 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-2">
          <span class="material-icons text-emerald-400 text-base">check_circle</span>
          <span>{{ actionToast() }}</span>
        </div>
        <button (click)="actionToast.set(null)" class="text-slate-400 hover:text-white">
          <span class="material-icons text-sm">close</span>
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <!-- Urgency Tabs -->
        <div class="flex gap-2">
          <button
            (click)="selectedUrgency.set('ALL')"
            [class.bg-amber-600]="selectedUrgency() === 'ALL'"
            [class.text-white]="selectedUrgency() === 'ALL'"
            [class.bg-slate-100]="selectedUrgency() !== 'ALL'"
            [class.text-slate-700]="selectedUrgency() !== 'ALL'"
            [class.dark:bg-slate-800]="selectedUrgency() !== 'ALL'"
            [class.dark:text-slate-300]="selectedUrgency() !== 'ALL'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition"
          >
            All Reminders
          </button>
          <button
            (click)="selectedUrgency.set('CRITICAL')"
            [class.bg-rose-600]="selectedUrgency() === 'CRITICAL'"
            [class.text-white]="selectedUrgency() === 'CRITICAL'"
            [class.bg-slate-100]="selectedUrgency() !== 'CRITICAL'"
            [class.text-slate-700]="selectedUrgency() !== 'CRITICAL'"
            [class.dark:bg-slate-800]="selectedUrgency() !== 'CRITICAL'"
            [class.dark:text-slate-300]="selectedUrgency() !== 'CRITICAL'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <span class="w-2 h-2 rounded-full bg-rose-300"></span>
            Critical (&lt; 7d)
          </button>
          <button
            (click)="selectedUrgency.set('UPCOMING')"
            [class.bg-amber-600]="selectedUrgency() === 'UPCOMING'"
            [class.text-white]="selectedUrgency() === 'UPCOMING'"
            [class.bg-slate-100]="selectedUrgency() !== 'UPCOMING'"
            [class.text-slate-700]="selectedUrgency() !== 'UPCOMING'"
            [class.dark:bg-slate-800]="selectedUrgency() !== 'UPCOMING'"
            [class.dark:text-slate-300]="selectedUrgency() !== 'UPCOMING'"
            class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
          >
            <span class="w-2 h-2 rounded-full bg-amber-300"></span>
            Upcoming (&lt; 30d)
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full sm:w-72">
          <span class="material-icons absolute left-3 top-2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search employee, dept, code..."
            class="w-full pl-9 pr-4 py-1.5 rounded-lg border text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
          />
        </div>
      </div>

      <!-- Reminders Table -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div *ngIf="isLoading()" class="p-12 text-center text-slate-500">
          <span class="material-icons animate-spin text-3xl text-amber-600">sync</span>
          <p class="mt-2 text-sm font-medium">Loading lifecycle reminders...</p>
        </div>

        <div *ngIf="!isLoading() && filteredReminders().length === 0" class="p-12 text-center text-slate-400">
          <span class="material-icons text-5xl text-slate-300">check_circle_outline</span>
          <p class="mt-2 text-base font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
          <p class="text-xs text-slate-400 mt-1">No pending probation or contract deadlines found in this category.</p>
        </div>

        <div *ngIf="!isLoading() && filteredReminders().length > 0" class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <th class="p-4">Employee</th>
                <th class="p-4">Department</th>
                <th class="p-4">Reminder Type</th>
                <th class="p-4">Due Date</th>
                <th class="p-4">Days Left</th>
                <th class="p-4">Urgency</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let item of filteredReminders()" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td class="p-4">
                  <div class="font-bold text-slate-900 dark:text-white">{{ item.employeeName }}</div>
                  <div class="font-mono text-[10px] text-slate-400">{{ item.employeeCode }}</div>
                </td>
                <td class="p-4 text-slate-600 dark:text-slate-400">
                  {{ item.departmentName }}
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" [ngClass]="getTypeBadgeClass(item.type)">
                    {{ formatType(item.type) }}
                  </span>
                </td>
                <td class="p-4 font-semibold text-slate-800 dark:text-slate-200">
                  {{ item.dueDate | date:'mediumDate' }}
                </td>
                <td class="p-4 font-bold" [class.text-rose-600]="item.daysRemaining <= 7" [class.text-amber-600]="item.daysRemaining > 7 && item.daysRemaining <= 30" [class.text-slate-600]="item.daysRemaining > 30">
                  {{ item.daysRemaining }} days
                </td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" [ngClass]="getUrgencyBadgeClass(item.urgency)">
                    {{ item.urgency }}
                  </span>
                </td>
                <td class="p-4 text-right space-x-2">
                  <!-- Notify Button -->
                  <button
                    (click)="notifyReminder(item)"
                    [disabled]="processingId() === item.id"
                    title="Send instant push notification reminder"
                    class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                  >
                    <span class="material-icons text-xs text-amber-600">notifications_active</span>
                    <span>Alert</span>
                  </button>

                  <!-- Extend Probation Button -->
                  <button
                    *ngIf="item.type === 'PROBATION_END'"
                    (click)="openExtendModal(item)"
                    [disabled]="processingId() === item.id"
                    title="Extend probation period"
                    class="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                  >
                    <span class="material-icons text-xs">schedule</span>
                    <span>Extend</span>
                  </button>

                  <!-- Resolve / Confirm Button -->
                  <button
                    (click)="resolveReminder(item)"
                    [disabled]="processingId() === item.id"
                    title="Confirm clearance and resolve"
                    class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 transition"
                  >
                    <span class="material-icons text-xs">done_all</span>
                    <span>Resolve</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Extend Probation Modal -->
      <div *ngIf="extendingReminder()" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span class="material-icons text-amber-600">schedule</span>
              Extend Probation Period
            </h3>
            <button (click)="extendingReminder.set(null)" class="text-slate-400 hover:text-slate-600">
              <span class="material-icons text-base">close</span>
            </button>
          </div>

          <div class="text-xs text-slate-500">
            Extending probation for <strong class="text-slate-800 dark:text-slate-200">{{ extendingReminder()?.employeeName }}</strong> ({{ extendingReminder()?.employeeCode }}).
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Probation End Date
              </label>
              <input
                type="date"
                [(ngModel)]="newEndDate"
                class="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audit Reason for Extension *
              </label>
              <textarea
                [(ngModel)]="extendReason"
                rows="3"
                placeholder="E.g., Additional 60-day performance review required on project milestones..."
                class="w-full px-3 py-2 border rounded-lg text-xs bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="extendingReminder.set(null)"
              class="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              (click)="submitExtend()"
              [disabled]="!newEndDate || !extendReason || isSubmittingExtend()"
              class="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-md transition disabled:opacity-50"
            >
              {{ isSubmittingExtend() ? 'Saving...' : 'Confirm Extension' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HrRemindersComponent implements OnInit {
  private lifecycleService = inject(LifecycleService);

  reminders = signal<HrReminder[]>([]);
  isLoading = signal(true);
  selectedUrgency = signal<'ALL' | 'CRITICAL' | 'UPCOMING'>('ALL');
  searchQuery = '';
  processingId = signal<string | null>(null);
  actionToast = signal<string | null>(null);
  resolvedSuccessCount = signal(0);

  extendingReminder = signal<HrReminder | null>(null);
  newEndDate = '';
  extendReason = '';
  isSubmittingExtend = signal(false);

  criticalCount = computed(() => this.reminders().filter((r) => r.urgency === 'CRITICAL').length);
  upcomingCount = computed(() => this.reminders().filter((r) => r.urgency === 'UPCOMING').length);
  resolvedCount = computed(() => this.resolvedSuccessCount());

  filteredReminders = computed(() => {
    let list = this.reminders();
    if (this.selectedUrgency() !== 'ALL') {
      list = list.filter((r) => r.urgency === this.selectedUrgency());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.employeeCode.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q),
      );
    }
    return list;
  });

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.isLoading.set(true);
    this.lifecycleService.getReminders().subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : [];
        this.reminders.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  notifyReminder(item: HrReminder) {
    this.processingId.set(item.id);
    this.lifecycleService.notifyReminder(item.id).subscribe({
      next: (res) => {
        this.processingId.set(null);
        this.showToast(res.message || `Dispatched alert notification to ${item.employeeName}`);
      },
      error: () => this.processingId.set(null),
    });
  }

  openExtendModal(item: HrReminder) {
    this.extendingReminder.set(item);
    this.newEndDate = '';
    this.extendReason = '';
  }

  submitExtend() {
    const item = this.extendingReminder();
    if (!item) return;
    this.isSubmittingExtend.set(true);
    this.lifecycleService.extendProbation(item.id, this.newEndDate, this.extendReason).subscribe({
      next: () => {
        this.isSubmittingExtend.set(false);
        this.extendingReminder.set(null);
        this.showToast(`Probation extended for ${item.employeeName} until ${this.newEndDate}`);
        this.loadReminders();
      },
      error: () => this.isSubmittingExtend.set(false),
    });
  }

  resolveReminder(item: HrReminder) {
    this.processingId.set(item.id);
    this.lifecycleService.resolveReminder(item.id).subscribe({
      next: () => {
        this.processingId.set(null);
        this.reminders.update((list) => list.filter((r) => r.id !== item.id));
        this.resolvedSuccessCount.update((c) => c + 1);
        this.showToast(`Resolved reminder for ${item.employeeName}`);
      },
      error: () => this.processingId.set(null),
    });
  }

  showToast(msg: string) {
    this.actionToast.set(msg);
    setTimeout(() => this.actionToast.set(null), 4000);
  }

  formatType(type: string): string {
    return type.replace(/_/g, ' ');
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'PROBATION_END':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300';
      case 'CONTRACT_EXPIRY':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
      case 'VISA_EXPIRY':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  getUrgencyBadgeClass(urgency: string): string {
    switch (urgency) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'UPCOMING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
