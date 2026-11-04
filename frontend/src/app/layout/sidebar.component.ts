import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200">
      <!-- App Brand Header -->
      <div class="h-16 flex items-center px-6 gap-3 border-b border-slate-100 dark:border-slate-800/60">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 font-bold text-lg">
          Q
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-1.5">
            Q Clocker
            <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300">Pro</span>
          </span>
          <span class="text-[11px] text-slate-400 font-medium">Enterprise Suite</span>
        </div>
      </div>

      <!-- Navigation Section -->
      <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <!-- Operations & Work -->
        <div>
          <div class="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Operations & Work
          </div>
          <nav class="space-y-1">
            <a
              *ngFor="let item of mainNav"
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 font-semibold"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all group"
            >
              <span class="material-icons text-xl text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.icon }}
              </span>
              <span class="flex-1">{{ item.label }}</span>
              <span
                *ngIf="item.badge"
                class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
              >
                {{ item.badge }}
              </span>
            </a>
          </nav>
        </div>

        <!-- Management Section (Admins/Leads/HR/IT) -->
        <div *ngIf="canAccessManagement()">
          <div class="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Management & Insights
          </div>
          <nav class="space-y-1">
            <a
              *ngFor="let item of filteredManagementNav()"
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 font-semibold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all group"
            >
              <span class="material-icons text-xl text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.icon }}
              </span>
              <span class="flex-1">{{ item.label }}</span>
            </a>
          </nav>
        </div>

        <!-- System Administration & RBAC -->
        <div *ngIf="authService.isAdmin()">
          <div class="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            System & Security
          </div>
          <nav class="space-y-1">
            <a
              *ngFor="let item of adminNav"
              [routerLink]="item.route"
              routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 font-semibold"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white transition-all group"
            >
              <span class="material-icons text-xl text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.icon }}
              </span>
              <span class="flex-1">{{ item.label }}</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- User Role Pill Footer -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {{ userInitials() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}
            </div>
            <div class="text-[10px] font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ formatRole(authService.currentUser()?.role) }}
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  authService = inject(AuthService);

  mainNav: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Daily Tasks', route: '/tasks', icon: 'assignment', badge: 'Active' },
    { label: 'IT Support Tickets', route: '/tickets', icon: 'confirmation_number' },
    { label: 'Timesheet & Work Log', route: '/work-logs', icon: 'access_time' },
    { label: 'My Performance', route: '/performance', icon: 'trending_up' },
    { label: 'My Finances & Payslips', route: '/my-finances', icon: 'payments' },
    { label: 'Notifications', route: '/notifications', icon: 'notifications' },
  ];

  managementNav: NavItem[] = [
    { label: 'Employees', route: '/employees', icon: 'people', roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR', 'TEAM_LEAD', 'AUDITOR'] },
    { label: 'Departments', route: '/departments', icon: 'corporate_fare', roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR', 'TEAM_LEAD', 'AUDITOR'] },
    { label: 'HR Reminders & Lifecycle', route: '/hr/reminders', icon: 'event_repeat', roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'HR_ADMINISTRATOR'] },
    { label: 'Reports & Analytics', route: '/reports', icon: 'insights', roles: ['SUPER_ADMIN', 'ADMIN', 'SYSTEM_ADMINISTRATOR', 'HR_MANAGER', 'IT_MANAGER', 'AUDITOR'] },
  ];

  adminNav: NavItem[] = [
    { label: 'Roles & RBAC', route: '/admin/roles', icon: 'admin_panel_settings' },
    { label: 'System Health & Engine', route: '/admin/system-health', icon: 'monitor_heart' },
    { label: 'Drizzle DB Explorer', route: '/admin/database', icon: 'storage' },
  ];

  canAccessManagement(): boolean {
    return this.authService.isTeamLead() || this.authService.isHR() || this.authService.isITManager() || this.authService.isAuditor();
  }

  filteredManagementNav(): NavItem[] {
    const role = this.authService.userRole() || '';
    if (this.authService.isSuperAdmin()) return this.managementNav;
    return this.managementNav.filter((item) => !item.roles || item.roles.includes(role));
  }

  userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'QC';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  }

  formatRole(role: any): string {
    if (!role) return 'Employee';
    return String(role).replace(/_/g, ' ');
  }
}
