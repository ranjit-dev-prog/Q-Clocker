import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { NotificationService, NotificationItem } from '../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between transition-colors duration-200 relative z-30">
      <!-- Left: Context & Search -->
      <div class="flex items-center gap-4">
        <div class="relative w-80">
          <span class="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search tasks, tickets, employees (Press /)..."
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <!-- Right: User Identity Badge, Theme, Notifications & Profile Actions -->
      <div class="flex items-center gap-3">
        <!-- Authenticated User Profile Badge (Real Identity) -->
        <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <div class="w-7 h-7 rounded-lg bg-primary-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            {{ userInitials() }}
          </div>
          <div class="flex flex-col text-left">
            <span class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}
            </span>
            <span class="text-[10px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              {{ formatRole(authService.userRole()) }}
            </span>
          </div>
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

        <!-- Notification Bell & Dropdown -->
        <div class="relative">
          <button
            (click)="toggleNotifications()"
            class="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <span class="material-icons text-xl">notifications_none</span>
            <span
              *ngIf="notificationService.unreadCount() > 0"
              class="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900"
            >
              {{ notificationService.unreadCount() }}
            </span>
          </button>

          <!-- Notification Dropdown Panel -->
          <div
            *ngIf="showNotificationsDropdown()"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <!-- Header -->
            <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span
                  *ngIf="notificationService.unreadCount() > 0"
                  class="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                >
                  {{ notificationService.unreadCount() }} new
                </span>
              </div>
              <button
                *ngIf="notificationService.unreadCount() > 0"
                (click)="markAllAsRead()"
                class="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 cursor-pointer"
              >
                Mark all as read
              </button>
            </div>

            <!-- List -->
            <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              <div
                *ngFor="let n of notificationService.notifications().slice(0, 5)"
                (click)="onNotificationClick(n)"
                [class.bg-slate-50]="!n.isRead"
                [class.dark:bg-slate-800/40]="!n.isRead"
                class="p-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition cursor-pointer flex items-start gap-3"
              >
                <div
                  [ngClass]="getNotificationIconBg(n.type)"
                  class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white"
                >
                  <span class="material-icons text-sm">{{ getNotificationIcon(n.type) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-1 mb-0.5">
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {{ n.title }}
                    </span>
                    <span *ngIf="!n.isRead" class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  </div>
                  <p class="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {{ n.message }}
                  </p>
                  <span class="text-[10px] text-slate-400 mt-1 block">
                    {{ n.createdAt | date: 'shortTime' }}
                  </span>
                </div>
              </div>

              <div
                *ngIf="notificationService.notifications().length === 0"
                class="p-8 text-center text-slate-400"
              >
                <span class="material-icons text-3xl mb-1 text-slate-300 dark:text-slate-600">notifications_off</span>
                <p class="text-xs">No notifications yet</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center">
              <a
                routerLink="/notifications"
                (click)="showNotificationsDropdown.set(false)"
                class="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 block py-1"
              >
                View all notifications →
              </a>
            </div>
          </div>
        </div>

        <div class="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

        <!-- Logout Button -->
        <button
          (click)="authService.logout()"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <span class="material-icons text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);

  showNotificationsDropdown = signal<boolean>(false);

  ngOnInit() {
    this.notificationService.loadNotifications().subscribe();
    this.notificationService.loadUnreadCount().subscribe();
  }

  toggleNotifications() {
    this.showNotificationsDropdown.update((v) => !v);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  onNotificationClick(n: NotificationItem) {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id).subscribe();
    }
  }

  userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'QC';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  }

  formatRole(role: string | null): string {
    if (!role) return 'Employee';
    return role.replace(/_/g, ' ');
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'URGENT':
        return 'warning';
      case 'TICKET':
        return 'confirmation_number';
      case 'TASK':
        return 'assignment';
      case 'SUCCESS':
        return 'check_circle';
      default:
        return 'info';
    }
  }

  getNotificationIconBg(type: string): string {
    switch (type) {
      case 'URGENT':
        return 'bg-rose-500';
      case 'TICKET':
        return 'bg-amber-500';
      case 'TASK':
        return 'bg-indigo-500';
      case 'SUCCESS':
        return 'bg-emerald-500';
      default:
        return 'bg-primary-500';
    }
  }
}
