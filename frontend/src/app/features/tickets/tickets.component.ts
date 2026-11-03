import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">IT Ticketing System</h1>
          <p class="text-xs text-slate-400 mt-1">Enterprise incident tracking, SLA monitoring and resolution workflows</p>
        </div>
        <button class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start">
          <span class="material-icons text-base">add</span>
          New Ticket
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Ticket ID</th>
                <th class="py-3 px-4">Subject</th>
                <th class="py-3 px-4">Requester</th>
                <th class="py-3 px-4">Assigned Tech</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">SLA Status</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let t of sampleTickets" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-4 font-mono font-bold text-primary-600">{{ t.id }}</td>
                <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">{{ t.title }}</td>
                <td class="py-3 px-4">{{ t.requester }}</td>
                <td class="py-3 px-4">{{ t.tech }}</td>
                <td class="py-3 px-4">{{ t.category }}</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {{ t.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {{ t.sla }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <button class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 rounded-lg">
                    Manage
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
export class TicketsComponent {
  authService = inject(AuthService);

  sampleTickets = [
    { id: 'TC-2026-001', title: 'VPN Certificate Renewal for Development Cluster', requester: 'David Ross', tech: 'Marcus Chen', category: 'Network', status: 'IN_PROGRESS', sla: 'Within SLA (18h left)' },
    { id: 'TC-2026-002', title: 'Active Directory User Access Permission for Staging Database', requester: 'Sarah Jenkins', tech: 'Marcus Chen', category: 'Access Management', status: 'RESOLVED', sla: 'Resolved in 2.1h' },
    { id: 'TC-2026-003', title: 'Primary Database Replica Latency Alert in US-East', requester: 'Marcus Chen', tech: 'Alexander Vance', category: 'Server', status: 'OPEN', sla: 'Within SLA (22h left)' },
  ];
}

