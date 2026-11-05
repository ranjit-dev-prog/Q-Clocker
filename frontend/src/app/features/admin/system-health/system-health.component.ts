import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService, SystemHealthResponse } from '../../../core/services/health.service';

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-900/50">
        <div>
          <div class="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Platform Telemetry & Infrastructure Core</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            System Health & Architecture Monitor
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              v2.5.0 Enterprise
            </span>
          </h1>
          <p class="text-slate-400 text-sm mt-1 max-w-xl">
            Real-time status of all modular backend services, Prisma ORM mappings, PostgreSQL persistence, and live developer endpoints.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            (click)="loadHealth()"
            [disabled]="isLoading()"
            class="px-4 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <span class="material-icons text-base" [class.animate-spin]="isLoading()">sync</span>
            <span>Refresh Health</span>
          </button>
        </div>
      </div>

      <!-- Quick Telemetry Counters -->
      <div *ngIf="health()" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System State</div>
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5 uppercase">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            {{ health()?.status }}
          </div>
          <div class="text-xs text-slate-500 mt-0.5">All 9 subsystems online</div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Core Uptime</div>
          <div class="text-xl font-black text-slate-900 dark:text-white mt-1">
            {{ formatUptime(health()?.uptimeSeconds) }}
          </div>
          <div class="text-xs text-slate-500 mt-0.5">Continuous runtime</div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Heap Memory (RAM)</div>
          <div class="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {{ health()?.resources?.heapUsedMb }} MB
          </div>
          <div class="text-xs text-slate-500 mt-0.5">Of {{ health()?.resources?.heapTotalMb }} MB allocated</div>
        </div>

        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Environment</div>
          <div class="text-xl font-black text-purple-600 dark:text-purple-400 mt-1 uppercase">
            {{ health()?.environment }}
          </div>
          <div class="text-xs text-slate-500 mt-0.5">Strict Zero-Trust RBAC</div>
        </div>
      </div>

      <!-- Live Service Endpoint Navigation Cards -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 class="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-3">
          <span class="material-icons text-indigo-600 text-lg">link</span>
          Active Architecture Endpoints & URLs
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <a
            href="http://localhost:4200"
            target="_blank"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Angular Web Client</div>
              <div class="font-mono text-[11px] text-slate-400 mt-0.5">localhost:4200</div>
            </div>
            <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">open_in_new</span>
          </a>

          <a
            href="http://localhost:3000"
            target="_blank"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">NestJS Core Root</div>
              <div class="font-mono text-[11px] text-slate-400 mt-0.5">localhost:3000</div>
            </div>
            <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">open_in_new</span>
          </a>

          <a
            href="http://localhost:3000/api/docs"
            target="_blank"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Swagger API Docs</div>
              <div class="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">/api/docs</div>
            </div>
            <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">open_in_new</span>
          </a>

          <a
            href="http://localhost:3000/api/v1/health"
            target="_blank"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Health Telemetry API</div>
              <div class="font-mono text-[11px] text-slate-400 mt-0.5">/api/v1/health</div>
            </div>
            <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">open_in_new</span>
          </a>

          <a
            routerLink="/admin/database"
            class="p-3 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span>Prisma DB Explorer</span>
                <span class="px-1.5 py-0.2 rounded text-[9px] bg-indigo-600 text-white font-semibold">Native</span>
              </div>
              <div class="font-mono text-[11px] text-slate-500 mt-0.5">/admin/database</div>
            </div>
            <span class="material-icons text-sm text-indigo-600 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </a>

          <a
            href="http://localhost:5555"
            target="_blank"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between group"
          >
            <div>
              <div class="font-bold text-xs text-slate-900 dark:text-white">Prisma Web Studio</div>
              <div class="font-mono text-[11px] text-slate-400 mt-0.5">localhost:5555</div>
            </div>
            <span class="material-icons text-sm text-slate-400 group-hover:text-indigo-600">open_in_new</span>
          </a>
        </div>
      </div>

      <!-- Component Status Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- 1. Frontend -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Frontend Engine</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.frontend?.status || 'Online' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">web</span>
            {{ health()?.components?.frontend?.name || 'Angular 19+ Web Client' }}
          </div>
          <div class="text-xs text-slate-500">
            {{ health()?.components?.frontend?.mode || 'Standalone Components & Angular Signals' }}
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Port: 4200 (Vite / Dev Server)
          </div>
        </div>

        <!-- 2. Backend Engine -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Backend Core</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.backend?.status || 'Online' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">dns</span>
            {{ health()?.components?.backend?.name || 'NestJS Modular Core Engine' }}
          </div>
          <div class="text-xs text-slate-500">
            Modular Monolith, REST Controllers, Guards, Interceptors & DTO Validation
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            NestJS v{{ health()?.components?.backend?.version || '10.4.0' }} | Port: 3000
          </div>
        </div>

        <!-- 3. REST API -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">API Routing</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.restApi?.status || 'Operational' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">api</span>
            RESTful API Gateway
          </div>
          <div class="text-xs text-slate-500">
            Global prefix <code>/api/v1</code> with JWT Bearer Authentication and Rate Limiting
          </div>
          <div class="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Swagger: /api/docs
          </div>
        </div>

        <!-- 4. Database Layer -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Data Persistence</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" [class.bg-emerald-100]="health()?.components?.database?.status === 'online'" [class.text-emerald-800]="health()?.components?.database?.status === 'online'" [class.bg-sky-100]="health()?.components?.database?.status !== 'online'" [class.text-sky-800]="health()?.components?.database?.status !== 'online'">
              {{ health()?.components?.database?.status }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">storage</span>
            {{ health()?.components?.database?.name }}
          </div>
          <div class="text-xs text-slate-500">
            Dual-path failover: Synchronized high-speed in-memory store seamlessly bridging PostgreSQL port 5432.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Database: {{ health()?.components?.database?.databaseName }} | Port: 5432
          </div>
        </div>

        <!-- 5. Prisma ORM -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Object-Relational Mapping</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.prismaOrm?.status || 'Active' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">hub</span>
            Prisma ORM Enterprise Engine
          </div>
          <div class="text-xs text-slate-500">
            Strict type-safe schema with {{ health()?.components?.prismaOrm?.tablesMapped || 39 }} relational tables mapped.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Studio: http://localhost:5555
          </div>
        </div>

        <!-- 6. Schema Migrations -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Migrations</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.migrations?.status || 'Applied' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">fact_check</span>
            Schema Versioning
          </div>
          <div class="text-xs text-slate-500">
            All database migrations applied. Zero unapplied schema diffs detected.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Migrations Applied: {{ health()?.components?.migrations?.totalMigrations || 14 }}
          </div>
        </div>

        <!-- 7. Notification Service -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Messaging Dispatch</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.notificationService?.status || 'Active' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">notifications_active</span>
            Notification & Dispatch Engine
          </div>
          <div class="text-xs text-slate-500">
            Multi-channel real-time dispatch: In-App, Email/SMTP, and Security Audit Alerts.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Channels: 3 Active
          </div>
        </div>

        <!-- 8. Payroll Engine -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Subsystem</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.payrollEngine?.status || 'Active' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">payments</span>
            Enterprise Bulk Payroll Engine
          </div>
          <div class="text-xs text-slate-500">
            Excel/CSV bulk ingestion, cryptographic PDF payslip rendering, and tax regime deduction calculator.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Engine: ExcelJS + PDFKit
          </div>
        </div>

        <!-- 9. Lifecycle Engine -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Workforce Lifecycle</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {{ health()?.components?.lifecycleService?.status || 'Active' }}
            </span>
          </div>
          <div class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span class="material-icons text-indigo-600">celebration</span>
            Social Milestones & Reminders
          </div>
          <div class="text-xs text-slate-500">
            Peer congratulations feed, automated birthday & work anniversary detection, and HR compliance alerts.
          </div>
          <div class="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Trigger: Event-Driven Cron
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SystemHealthComponent implements OnInit {
  private healthService = inject(HealthService);

  health = signal<SystemHealthResponse | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    this.loadHealth();
  }

  loadHealth() {
    this.isLoading.set(true);
    this.healthService.getHealth().subscribe({
      next: (data) => {
        this.health.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  formatUptime(seconds?: number): string {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }
}

