import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, TicketItem, CreateTicketPayload } from '../../core/services/ticket.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">IT Service Management & Ticketing</h1>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              SLA Engine
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">Incident lifecycle, automated SLA compliance monitoring, internal notes and audit history</p>
        </div>

        <button
          (click)="showCreateModal.set(true)"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start"
        >
          <span class="material-icons text-base">add</span>
          New Ticket
        </button>
      </div>

      <!-- SLA & Compliance Metrics -->
      <div *ngIf="ticketService.metrics() as m" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Tickets</div>
          <div class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ m.totalTickets }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">Open Incidents</div>
          <div class="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{{ m.openTickets }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">Resolved</div>
          <div class="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ m.resolvedTickets }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">SLA Breached</div>
          <div class="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{{ m.slaBreachedCount }}</div>
        </div>
        <div class="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm">
          <div class="text-[11px] font-semibold text-purple-500 uppercase tracking-wider">SLA Compliance</div>
          <div class="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{{ m.slaComplianceRate }}</div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs">
        <div class="flex flex-wrap items-center gap-2">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="applyFilters()"
            placeholder="Search tickets by ID, subject, or description..."
            class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white w-64 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
          />

          <select
            [(ngModel)]="selectedPriority"
            (ngModelChange)="applyFilters()"
            class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            [(ngModel)]="selectedCategory"
            (ngModelChange)="applyFilters()"
            class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Network">Network</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Access Management">Access Management</option>
            <option value="IT Support">IT Support</option>
          </select>
        </div>

        <button
          (click)="ticketService.loadTickets().subscribe()"
          class="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1"
        >
          <span class="material-icons text-sm">refresh</span>
          Refresh
        </button>
      </div>

      <!-- Tickets Data Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Ticket ID & Subject</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">SLA Deadline</th>
                <th class="py-3 px-4">Technician</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let t of ticketService.tickets()" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-4">
                  <div class="flex items-center gap-2">
                    <span class="font-mono font-bold text-primary-600 dark:text-primary-400">{{ t.referenceId }}</span>
                    <span *ngIf="t.slaBreached" class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-600 text-white animate-pulse">
                      BREACH
                    </span>
                  </div>
                  <div class="font-bold text-slate-900 dark:text-white mt-0.5">{{ t.title }}</div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getPriorityClass(t.priority)">
                    {{ t.priority }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {{ t.category }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [ngClass]="getStatusClass(t.status)">
                    {{ t.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <div [ngClass]="t.slaBreached ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300'">
                    {{ t.dueDate | date:'short' }}
                  </div>
                  <div class="text-[10px] text-slate-400">{{ t.slaHours }}h resolution target</div>
                </td>
                <td class="py-3 px-4">{{ t.technicianName || 'Unassigned' }}</td>
                <td class="py-3 px-4 text-right">
                  <button
                    (click)="openDetails(t)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                  >
                    Manage
                  </button>
                </td>
              </tr>
              <tr *ngIf="ticketService.tickets().length === 0">
                <td colspan="7" class="py-8 text-center text-slate-400 italic">
                  No tickets found matching the selected filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CREATE TICKET MODAL -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Create IT Incident Ticket</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject Line *</label>
              <input
                type="text"
                [(ngModel)]="newTicketTitle"
                placeholder="e.g., Active Directory LDAP Sync Failure"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
              <textarea
                [(ngModel)]="newTicketDesc"
                rows="3"
                placeholder="Observed error codes, impact, steps to reproduce..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  [(ngModel)]="newTicketPriority"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="CRITICAL">Critical (4h SLA)</option>
                  <option value="HIGH">High (8h SLA)</option>
                  <option value="MEDIUM">Medium (24h SLA)</option>
                  <option value="LOW">Low (72h SLA)</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  [(ngModel)]="newTicketCategory"
                  class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Network">Network</option>
                  <option value="Access Management">Access Management</option>
                  <option value="IT Support">IT Support</option>
                  <option value="VAPT">VAPT</option>
                  <option value="Cloud Security">Cloud Security</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Subcategory (Optional)</label>
              <input
                type="text"
                [(ngModel)]="newTicketSubcategory"
                placeholder="e.g., Firewall Policy, IAM, SSL Certificate"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showCreateModal.set(false)"
              class="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              [disabled]="!newTicketTitle.trim() || !newTicketDesc.trim() || isSubmitting()"
              (click)="submitCreateTicket()"
              class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              {{ isSubmitting() ? 'Submitting...' : 'Submit Ticket' }}
            </button>
          </div>
        </div>
      </div>

      <!-- TICKET DETAILS & RESOLUTION MODAL -->
      <div *ngIf="showDetailsModal() && selectedTicketDetail()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{{ selectedTicketDetail().referenceId }}</span>
                <span *ngIf="selectedTicketDetail().slaBreached" class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
                  SLA BREACHED
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{{ selectedTicketDetail().title }}</h3>
            </div>
            <button (click)="showDetailsModal.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <!-- Metadata Badges -->
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-lg font-bold uppercase" [ngClass]="getPriorityClass(selectedTicketDetail().priority)">
              {{ selectedTicketDetail().priority }}
            </span>
            <span class="px-2.5 py-1 rounded-lg font-bold uppercase" [ngClass]="getStatusClass(selectedTicketDetail().status)">
              {{ selectedTicketDetail().status.replace('_', ' ') }}
            </span>
            <span class="px-2.5 py-1 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {{ selectedTicketDetail().category }}
            </span>
            <span class="px-2.5 py-1 rounded-lg font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              Target SLA: {{ selectedTicketDetail().slaHours }} hours
            </span>
          </div>

          <div class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
            <div class="font-semibold text-slate-900 dark:text-white">Incident Description:</div>
            <p>{{ selectedTicketDetail().description }}</p>
          </div>

          <!-- Resolution Summary if Resolved -->
          <div *ngIf="selectedTicketDetail().resolutionNotes" class="text-xs bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1">
            <div class="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <span class="material-icons text-sm">check_circle</span>
              Resolution Summary:
            </div>
            <p class="text-emerald-700 dark:text-emerald-400">{{ selectedTicketDetail().resolutionNotes }}</p>
            <div class="text-[10px] text-emerald-600 dark:text-emerald-500 pt-1">
              Resolved at: {{ selectedTicketDetail().resolvedAt | date:'medium' }}
            </div>
          </div>

          <!-- Resolve Action Form if Open -->
          <div *ngIf="selectedTicketDetail().status !== 'RESOLVED' && selectedTicketDetail().status !== 'CLOSED'" class="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div class="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="material-icons text-sm text-emerald-500">task_alt</span>
              Resolve Incident
            </div>
            <textarea
              [(ngModel)]="resolutionNotesInput"
              rows="2"
              placeholder="State root cause analysis and resolution applied..."
              class="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            ></textarea>
            <div class="flex justify-end">
              <button
                [disabled]="!resolutionNotesInput.trim()"
                (click)="submitResolve()"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition"
              >
                Mark as Resolved
              </button>
            </div>
          </div>

          <!-- Comments & Notes -->
          <div class="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Activity & Comments</h4>

            <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
              <div
                *ngFor="let comment of selectedTicketDetail().comments"
                class="p-3 rounded-xl border text-xs space-y-1"
                [ngClass]="comment.isInternalNote ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-900 dark:text-white">{{ comment.authorFirstName }} {{ comment.authorLastName }}</span>
                    <span *ngIf="comment.isInternalNote" class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Internal Note
                    </span>
                  </div>
                  <span class="text-[10px] text-slate-400">{{ comment.createdAt | date:'short' }}</span>
                </div>
                <p class="text-slate-600 dark:text-slate-300">{{ comment.comment }}</p>
              </div>
              <div *ngIf="!selectedTicketDetail().comments || selectedTicketDetail().comments.length === 0" class="text-xs text-slate-400 italic">
                No activity logs recorded yet.
              </div>
            </div>

            <!-- Add Comment Input -->
            <div class="flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="newTicketComment"
                placeholder="Add technician note or response..."
                class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                (keyup.enter)="submitTicketComment()"
              />
              <label for="ticket-internal-note" class="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                <input id="ticket-internal-note" type="checkbox" aria-label="Internal technician note only" [(ngModel)]="isInternalComment" class="rounded text-primary-600" />
                Internal
              </label>
              <button
                [disabled]="!newTicketComment.trim()"
                (click)="submitTicketComment()"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class TicketsComponent implements OnInit {
  ticketService = inject(TicketService);
  authService = inject(AuthService);

  showCreateModal = signal<boolean>(false);
  showDetailsModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  selectedTicketDetail = signal<any | null>(null);

  // Filters
  searchQuery = '';
  selectedPriority = '';
  selectedCategory = '';

  // Form bindings
  newTicketTitle = '';
  newTicketDesc = '';
  newTicketPriority = 'MEDIUM';
  newTicketCategory = 'IT Support';
  newTicketSubcategory = '';

  newTicketComment = '';
  isInternalComment = false;
  resolutionNotesInput = '';

  ngOnInit() {
    this.ticketService.loadTickets().subscribe();
    this.ticketService.loadMetrics().subscribe();
  }

  applyFilters() {
    this.ticketService
      .loadTickets({
        search: this.searchQuery || undefined,
        priority: this.selectedPriority || undefined,
        category: this.selectedCategory || undefined,
      })
      .subscribe();
  }

  openDetails(ticket: TicketItem) {
    this.ticketService.getTicketDetails(ticket.id).subscribe((res) => {
      this.selectedTicketDetail.set(res.data);
      this.resolutionNotesInput = '';
      this.showDetailsModal.set(true);
    });
  }

  submitCreateTicket() {
    if (!this.newTicketTitle.trim() || !this.newTicketDesc.trim()) return;
    this.isSubmitting.set(true);

    const payload: CreateTicketPayload = {
      title: this.newTicketTitle.trim(),
      description: this.newTicketDesc.trim(),
      priority: this.newTicketPriority,
      category: this.newTicketCategory,
      subcategory: this.newTicketSubcategory.trim() || undefined,
    };

    this.ticketService.createTicket(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showCreateModal.set(false);
        this.newTicketTitle = '';
        this.newTicketDesc = '';
        this.newTicketSubcategory = '';
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  submitTicketComment() {
    if (!this.newTicketComment.trim() || !this.selectedTicketDetail()) return;
    const ticketId = this.selectedTicketDetail().id;
    this.ticketService
      .addComment(ticketId, this.newTicketComment.trim(), this.isInternalComment)
      .subscribe(() => {
        this.newTicketComment = '';
        this.ticketService.getTicketDetails(ticketId).subscribe((res) => {
          this.selectedTicketDetail.set(res.data);
        });
      });
  }

  submitResolve() {
    if (!this.resolutionNotesInput.trim() || !this.selectedTicketDetail()) return;
    const ticketId = this.selectedTicketDetail().id;
    this.ticketService.resolveTicket(ticketId, this.resolutionNotesInput.trim()).subscribe(() => {
      this.ticketService.getTicketDetails(ticketId).subscribe((res) => {
        this.selectedTicketDetail.set(res.data);
      });
    });
  }

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
      case 'RESOLVED':
      case 'CLOSED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
      case 'NEW': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }
}
