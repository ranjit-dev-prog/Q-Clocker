import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daily Tasks</h1>
          <p class="text-xs text-slate-400 mt-1">Assign, track status and review daily team objectives</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start">
          <span class="material-icons text-base">add</span>
          New Task
        </button>
      </div>

      <!-- Task Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Task ID & Title</th>
                <th class="py-3 px-4">Assignee</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Due Date</th>
                <th class="py-3 px-4">Est / Actual</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let task of sampleTasks" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-4">
                  <div class="font-bold text-slate-900 dark:text-white">{{ task.title }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">{{ task.code }} • {{ task.category }}</div>
                </td>
                <td class="py-3 px-4">{{ task.assignee }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(task.priority)">
                    {{ task.priority }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getStatusClass(task.status)">
                    {{ task.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="py-3 px-4">{{ task.dueDate }}</td>
                <td class="py-3 px-4 font-mono">{{ task.estimated }}h / {{ task.actual }}h</td>
                <td class="py-3 px-4 text-right">
                  <button class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class TasksComponent {
  authService = inject(AuthService);

  sampleTasks = [
    { code: 'TSK-2026-001', title: 'Implement Drizzle ORM Schema & Relational Models', category: 'Backend Architecture', assignee: 'David Ross', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: 'Nov 3, 2026', estimated: 6, actual: 4 },
    { code: 'TSK-2026-002', title: 'Angular Standalone Shell & Tailwind Layout', category: 'Frontend', assignee: 'David Ross', priority: 'CRITICAL', status: 'COMPLETED', dueDate: 'Nov 3, 2026', estimated: 8, actual: 7.5 },
    { code: 'TSK-2026-003', title: 'Audit Log Interceptor & Role-Based Access Guards', category: 'Security', assignee: 'Marcus Chen', priority: 'HIGH', status: 'UNDER_REVIEW', dueDate: 'Nov 4, 2026', estimated: 5, actual: 4 },
    { code: 'TSK-2026-004', title: 'Configure PostgreSQL 16 Docker Compose Service', category: 'DevOps', assignee: 'Alexander Vance', priority: 'MEDIUM', status: 'COMPLETED', dueDate: 'Nov 3, 2026', estimated: 3, actual: 2.5 },
  ];

  getPriorityClass(p: string): string {
    switch (p) {
      case 'CRITICAL': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      case 'HIGH': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'MEDIUM': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  getStatusClass(s: string): string {
    switch (s) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'UNDER_REVIEW': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
