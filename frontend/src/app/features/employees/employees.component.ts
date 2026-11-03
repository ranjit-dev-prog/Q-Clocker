import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Management</h1>
          <p class="text-xs text-slate-400 mt-1">Directory of organization personnel, roles and department affiliations</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start">
          <span class="material-icons text-base">person_add</span>
          Add Employee
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th class="py-3 px-4">Employee</th>
              <th class="py-3 px-4">Role</th>
              <th class="py-3 px-4">Department</th>
              <th class="py-3 px-4">Job Title</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr *ngFor="let emp of employees" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ emp.name }}</div>
                <div class="text-[11px] text-slate-400">{{ emp.email }}</div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {{ emp.role }}
                </span>
              </td>
              <td class="py-3 px-4">{{ emp.dept }}</td>
              <td class="py-3 px-4">{{ emp.title }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 rounded-lg">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class EmployeesComponent {
  authService = inject(AuthService);

  employees = [
    { name: 'Alexander Vance', email: 'superadmin@qclocker.io', role: 'SUPER_ADMIN', dept: 'IT & Executive', title: 'Chief Information Officer' },
    { name: 'Marcus Chen', email: 'itmanager@qclocker.io', role: 'ADMIN', dept: 'Information Technology', title: 'IT Infrastructure & Operations Manager' },
    { name: 'Sarah Jenkins', email: 'teamlead@qclocker.io', role: 'TEAM_LEAD', dept: 'Software Engineering', title: 'Senior Engineering Lead' },
    { name: 'David Ross', email: 'employee@qclocker.io', role: 'EMPLOYEE', dept: 'Software Engineering', title: 'Full-Stack Software Engineer' },
  ];
}

