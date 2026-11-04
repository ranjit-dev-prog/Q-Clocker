import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, NotificationItem } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span class="material-icons text-primary-600 text-2xl">notifications</span>
            Enterprise Notification Center
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time operational alerts, ticket dispatches, task assignments, and system audit events
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            *ngIf="notificationService.unreadCount() > 0"
            (click)="markAllAsRead()"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:hover:bg-primary-900 dark:text-primary-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-sm">done_all</span>
            Mark All as Read
          </button>
          <button
            (click)="refresh()"
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Refresh Feed"
          >
            <span class="material-icons text-lg">refresh</span>
          </button>
        </div>
      </div>

      <!-- Quick KPI Counters -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
            <span class="material-icons">inbox</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ notificationService.notifications().length }}
            </div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Alerts</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <span class="material-icons">mark_email_unread</span>
          </div>
          <div>
            <div class="text-2xl font-black text-rose-600">
              {{ notificationService.unreadCount() }}
            </div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unread Alerts</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <span class="material-icons">confirmation_number</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ ticketCount() }}
            </div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ITSM Tickets</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <span class="material-icons">assignment</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ taskCount() }}
            </div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sprint Tasks</div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          *ngFor="let tab of tabs"
          (click)="activeTab.set(tab.key)"
          [class.bg-slate-900]="activeTab() === tab.key && !isDark()"
          [class.text-white]="activeTab() === tab.key && !isDark()"
          [class.bg-white]="activeTab() === tab.key && isDark()"
          [class.text-slate-900]="activeTab() === tab.key && isDark()"
          [class.text-slate-600]="activeTab() !== tab.key"
          [class.dark:text-slate-400]="activeTab() !== tab.key"
          class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span>{{ tab.label }}</span>
          <span
            *ngIf="tab.count !== undefined"
            class="px-1.5 py-0.2 rounded-full text-[10px]"
            [ngClass]="activeTab() === tab.key ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Notifications List Feed -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
        <div
          *ngFor="let n of filteredNotifications()"
          class="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group"
          [class.bg-slate-50]="!n.isRead"
          [class.dark:bg-slate-800/20]="!n.isRead"
        >
          <div
            [ngClass]="getNotificationIconBg(n.type)"
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5"
          >
            <span class="material-icons text-lg">{{ getNotificationIcon(n.type) }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ n.title }}
                </span>
                <span
                  *ngIf="!n.isRead"
                  class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 uppercase tracking-tight"
                >
                  Unread
                </span>
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight"
                  [ngClass]="getTypeBadgeClass(n.type)"
                >
                  {{ n.type }}
                </span>
              </div>
              <span class="text-xs text-slate-400">
                {{ n.createdAt | date: 'medium' }}
              </span>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {{ n.message }}
            </p>

            <!-- Action buttons for linked items -->
            <div class="mt-3 flex items-center gap-3">
              <a
                *ngIf="n.entityType === 'TICKET'"
                routerLink="/tickets"
                class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                <span class="material-icons text-sm">open_in_new</span>
                View in ITSM Tickets
              </a>
              <a
                *ngIf="n.entityType === 'TASK'"
                routerLink="/tasks"
                class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                <span class="material-icons text-sm">open_in_new</span>
                View in Daily Tasks
              </a>
              <button
                *ngIf="!n.isRead"
                (click)="markAsRead(n.id)"
                class="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <span class="material-icons text-sm">done</span>
                Mark as read
              </button>
            </div>
          </div>
        </div>

        <div
          *ngIf="filteredNotifications().length === 0"
          class="p-12 text-center text-slate-400"
        >
          <span class="material-icons text-4xl mb-2 text-slate-300 dark:text-slate-600">notifications_off</span>
          <p class="text-sm font-semibold">No notifications found in this view</p>
          <p class="text-xs mt-1 text-slate-400">You are all caught up with your operational alerts.</p>
        </div>
      </div>
    </div>
  `,
})
export class NotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);

  activeTab = signal<string>('all');

  tabs = [
    { key: 'all', label: 'All Alerts' },
    { key: 'unread', label: 'Unread' },
    { key: 'ticket', label: 'ITSM Tickets' },
    { key: 'task', label: 'Tasks' },
    { key: 'urgent', label: 'Urgent' },
  ];

  filteredNotifications = computed(() => {
    const list = this.notificationService.notifications();
    const tab = this.activeTab();
    if (tab === 'unread') return list.filter((n) => !n.isRead);
    if (tab === 'ticket') return list.filter((n) => n.entityType === 'TICKET' || n.type === 'TICKET');
    if (tab === 'task') return list.filter((n) => n.entityType === 'TASK' || n.type === 'TASK');
    if (tab === 'urgent') return list.filter((n) => n.type === 'URGENT');
    return list;
  });

  ticketCount = computed(() => {
    return this.notificationService.notifications().filter((n) => n.entityType === 'TICKET' || n.type === 'TICKET').length;
  });

  taskCount = computed(() => {
    return this.notificationService.notifications().filter((n) => n.entityType === 'TASK' || n.type === 'TASK').length;
  });

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.notificationService.loadNotifications().subscribe();
    this.notificationService.loadUnreadCount().subscribe();
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id).subscribe();
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
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

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'URGENT':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
      case 'TICKET':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300';
      case 'TASK':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300';
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
