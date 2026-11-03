import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { UserRole } from '../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between transition-colors duration-200">
      <!-- Left: Context & Search -->
      <div class="flex items-center gap-4">
        <div class="relative w-72">
          <span class="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search tasks, tickets, employees (Press /)..."
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <!-- Right: Role Switcher, Theme & Profile Actions -->
      <div class="flex items-center gap-3">
        <!-- Live Role Switcher (Quick Testing Tool) -->
        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/80 dark:border-slate-700">
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
            <span class="material-icons text-sm">badge</span> Role:
          </span>
          <button
            *ngFor="let r of roles"
            (click)="switchRole(r.key)"
            [ngClass]="authService.userRole() === r.key ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-700 dark:text-primary-300 font-bold' : ''"
            class="px-2.5 py-1 text-xs rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 transition-all cursor-pointer"
          >
            {{ r.label }}
          </button>
        </div>

        <!-- Theme Toggle -->
        <button
          (click)="themeService.toggleTheme()"
          class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle light/dark mode"
        >
          <span class="material-icons text-xl">
            {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- Notification Bell -->
        <div class="relative">
          <button class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
            <span class="material-icons text-xl">notifications_none</span>
            <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white dark:ring-slate-900"></span>
          </button>
        </div>

        <div class="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

        <!-- Logout Button -->
        <button
          (click)="authService.logout()"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
        >
          <span class="material-icons text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  roles: { key: UserRole; label: string }[] = [
    { key: 'SUPER_ADMIN', label: 'Super Admin' },
    { key: 'ADMIN', label: 'IT Manager' },
    { key: 'TEAM_LEAD', label: 'Lead' },
    { key: 'EMPLOYEE', label: 'Employee' },
  ];

  switchRole(role: UserRole) {
    this.authService.quickSwitchRole(role);
  }
}

