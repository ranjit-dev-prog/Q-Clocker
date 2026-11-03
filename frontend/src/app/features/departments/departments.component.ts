import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Departments & Teams</h1>
          <p class="text-xs text-slate-400 mt-1">Organizational units, cost centers and management hierarchy</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start">
          <span class="material-icons text-base">add_business</span>
          Add Department
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div *ngFor="let dept of departments" class="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="font-bold text-sm text-slate-900 dark:text-white">{{ dept.name }}</div>
            <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {{ dept.code }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ dept.description }}</p>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-400">Head: <span class="font-semibold text-slate-700 dark:text-slate-300">{{ dept.manager }}</span></span>
            <span class="text-primary-600 font-semibold">{{ dept.members }} Members</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DepartmentsComponent {
  authService = inject(AuthService);

  departments = [
    { name: 'Information Technology', code: 'IT', description: 'Enterprise IT infrastructure, helpdesk, network operations and cybersecurity', manager: 'Marcus Chen', members: 12 },
    { name: 'Software Engineering', code: 'ENG', description: 'Core product engineering, platform development, API architecture and QA', manager: 'Sarah Jenkins', members: 24 },
    { name: 'Operations', code: 'OPS', description: 'Business continuity, facilities, vendor relationships and client delivery', manager: 'Alexander Vance', members: 8 },
    { name: 'Human Resources', code: 'HR', description: 'Talent acquisition, employee satisfaction, compensation and organizational policy', manager: 'Emma Watson', members: 4 },
  ];
}

