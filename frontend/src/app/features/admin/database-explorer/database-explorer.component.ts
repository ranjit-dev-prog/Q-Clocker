import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseExplorerService, DrizzleTableMeta, DrizzleColumnMeta } from '../../../core/services/database.service';

@Component({
  selector: 'app-database-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Top Header & Architecture Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl text-white">
        <div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight">Drizzle ORM Database Studio</h1>
              <p class="text-xs text-slate-400">Integrated Relational Schema Inspector & Live Data Browser</p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            39 Mapped Tables
          </div>
          <div class="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            PostgreSQL 16 + Drizzle ORM
          </div>
          <a
            href="https://local.drizzle.studio?port=4984"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg transition-all"
            title="External Drizzle Studio Web UI"
          >
            <span>External Web Studio</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Main Two-Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Column: Tables Sidebar List (3.5 cols) -->
        <div class="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[780px]">
          <!-- Sidebar Search & Filter -->
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="tableSearch"
                placeholder="Search tables..."
                class="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div class="flex items-center justify-between mt-2.5 px-1 text-[11px] text-slate-500">
              <span>{{ filteredTables().length }} tables found</span>
              <span class="font-medium text-indigo-600 dark:text-indigo-400">Drizzle Relational Schema</span>
            </div>
          </div>

          <!-- Tables Grouped Accordion / List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
            <div *ngFor="let cat of groupedCategories()" class="mb-3">
              <div class="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 rounded-lg mb-1 flex items-center justify-between">
                <span>{{ cat.name }}</span>
                <span>{{ cat.tables.length }}</span>
              </div>
              <div class="space-y-1">
                <button
                  *ngFor="let tbl of cat.tables"
                  (click)="selectTable(tbl.name)"
                  [class.bg-indigo-50]="selectedTable() === tbl.name"
                  [class.dark:bg-indigo-950/40]="selectedTable() === tbl.name"
                  [class.border-indigo-200]="selectedTable() === tbl.name"
                  [class.dark:border-indigo-800]="selectedTable() === tbl.name"
                  class="w-full text-left px-3 py-2.5 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center justify-between group"
                >
                  <div class="min-w-0 pr-2">
                    <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                      {{ tbl.name }}
                    </div>
                    <div class="text-[10px] text-slate-400 truncate">{{ tbl.description }}</div>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium" title="Columns">
                      {{ tbl.columnCount }} cols
                    </span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold" title="Rows">
                      {{ tbl.rowCount }} rows
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Table Viewer & Data Browser (8.5 cols) -->
        <div class="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[780px]">
          <!-- Active Table Header & Tab Switcher -->
          <div class="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  table
                </span>
                <h2 class="text-lg font-bold text-slate-900 dark:text-white font-mono">{{ selectedTable() }}</h2>
              </div>
              <p class="text-xs text-slate-500 mt-1" *ngIf="activeTableMeta() as meta">
                {{ meta.description }} &bull; <span class="font-medium text-slate-700 dark:text-slate-300">{{ meta.columnCount }} columns</span> &bull; <span class="font-medium text-emerald-600">{{ meta.rowCount }} total records</span>
              </p>
            </div>

            <!-- View Mode Switcher -->
            <div class="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl">
              <button
                (click)="activeTab = 'data'"
                [class.bg-white]="activeTab === 'data'"
                [class.dark:bg-slate-900]="activeTab === 'data'"
                [class.shadow-sm]="activeTab === 'data'"
                [class.text-indigo-600]="activeTab === 'data'"
                [class.dark:text-indigo-400]="activeTab === 'data'"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 transition-all flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span>Live Records</span>
              </button>
              <button
                (click)="activeTab = 'schema'"
                [class.bg-white]="activeTab === 'schema'"
                [class.dark:bg-slate-900]="activeTab === 'schema'"
                [class.shadow-sm]="activeTab === 'schema'"
                [class.text-indigo-600]="activeTab === 'schema'"
                [class.dark:text-indigo-400]="activeTab === 'schema'"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 transition-all flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Schema DDL</span>
              </button>
            </div>
          </div>

          <!-- Tab 1: Live Records Data Grid -->
          <div *ngIf="activeTab === 'data'" class="flex-1 flex flex-col min-h-0">
            <!-- Search & Filter Bar -->
            <div class="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 flex items-center justify-between gap-3">
              <div class="relative flex-1 max-w-sm">
                <input
                  type="text"
                  [(ngModel)]="dataSearch"
                  (keyup.enter)="loadTableData(1)"
                  placeholder="Filter rows..."
                  class="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <div class="flex items-center gap-2">
                <button
                  (click)="loadTableData(currentPage)"
                  class="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <!-- Table Rows Grid -->
            <div class="flex-1 overflow-auto">
              <table class="w-full text-left border-collapse">
                <thead class="sticky top-0 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider z-10 shadow-sm">
                  <tr>
                    <th *ngFor="let col of activeColumns()" class="py-2.5 px-3 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  <tr *ngFor="let row of activeRows()" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td *ngFor="let col of activeColumns()" class="py-2.5 px-3 max-w-xs truncate text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      <ng-container [ngSwitch]="cellType(row[col])">
                        <!-- Null / Undefined -->
                        <span *ngSwitchCase="'null'" class="text-slate-400 italic font-sans text-[10px]">null</span>
                        <!-- Boolean -->
                        <span *ngSwitchCase="'boolean'" [class]="row[col] ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'">
                          {{ row[col] ? 'true' : 'false' }}
                        </span>
                        <!-- Object / Array -->
                        <span *ngSwitchCase="'object'" class="text-indigo-600 dark:text-indigo-400 underline cursor-pointer" (click)="openJsonModal(row[col])">
                          [JSON Object]
                        </span>
                        <!-- Default text -->
                        <span *ngSwitchDefault [title]="row[col]">{{ row[col] }}</span>
                      </ng-container>
                    </td>
                  </tr>
                  <tr *ngIf="activeRows().length === 0">
                    <td [attr.colspan]="activeColumns().length || 1" class="py-12 text-center text-slate-400 text-xs">
                      No records found in this table.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination Footer -->
            <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
              <div>
                Showing Page <span class="font-semibold text-slate-800 dark:text-slate-200">{{ currentPage }}</span> of <span class="font-semibold text-slate-800 dark:text-slate-200">{{ totalPages() }}</span>
                ({{ totalRecords() }} total records)
              </div>
              <div class="flex items-center gap-2">
                <button
                  (click)="prevPage()"
                  [disabled]="currentPage <= 1"
                  class="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage >= totalPages()"
                  class="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <!-- Tab 2: Schema DDL & Column Metadata Grid -->
          <div *ngIf="activeTab === 'schema'" class="flex-1 overflow-auto p-4">
            <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse text-xs">
                <thead class="bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Column Name</th>
                    <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Data Type</th>
                    <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Key Constraint</th>
                    <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Nullability</th>
                    <th class="py-3 px-4 border-b border-slate-200 dark:border-slate-700">Default Value</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr *ngFor="let col of schemaColumns()" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                    <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span *ngIf="col.isPrimary" class="text-amber-500" title="Primary Key">🔑</span>
                      <span>{{ col.name }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                        {{ col.dataType }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span *ngIf="col.isPrimary" class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400">
                        PRIMARY KEY
                      </span>
                      <span *ngIf="!col.isPrimary" class="text-slate-400 text-[10px]">-</span>
                    </td>
                    <td class="py-3 px-4">
                      <span *ngIf="!col.isNullable" class="text-rose-600 dark:text-rose-400 font-semibold text-[10px]">NOT NULL</span>
                      <span *ngIf="col.isNullable" class="text-slate-400 text-[10px]">NULLABLE</span>
                    </td>
                    <td class="py-3 px-4 text-slate-500 font-sans text-xs">
                      <code *ngIf="col.hasDefault" class="text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {{ col.defaultVal || 'defaultNow() / defaultRandom()' }}
                      </code>
                      <span *ngIf="!col.hasDefault" class="text-slate-400 text-[10px]">-</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DatabaseExplorerComponent implements OnInit {
  private explorerService = inject(DatabaseExplorerService);

  tableSearch = '';
  dataSearch = '';
  selectedTable = signal<string>('users');
  activeTab: 'data' | 'schema' = 'data';

  currentPage = 1;
  pageSize = 20;

  ngOnInit() {
    this.explorerService.getTables().subscribe(() => {
      this.selectTable('users');
    });
  }

  // Filtered tables by search
  filteredTables = computed(() => {
    const list = this.explorerService.tables();
    const q = this.tableSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  });

  // Group tables by Category
  groupedCategories = computed(() => {
    const map = new Map<string, DrizzleTableMeta[]>();
    for (const tbl of this.filteredTables()) {
      if (!map.has(tbl.category)) {
        map.set(tbl.category, []);
      }
      map.get(tbl.category)!.push(tbl);
    }
    return Array.from(map.entries()).map(([name, tables]) => ({ name, tables }));
  });

  activeTableMeta = computed(() => {
    return this.explorerService.tables().find((t) => t.name === this.selectedTable()) || null;
  });

  schemaColumns = computed(() => {
    return this.explorerService.activeSchema();
  });

  activeRows = computed(() => {
    return this.explorerService.activeData()?.rows || [];
  });

  activeColumns = computed(() => {
    return this.explorerService.activeData()?.columns || [];
  });

  totalRecords = computed(() => {
    return this.explorerService.activeData()?.total || 0;
  });

  totalPages = computed(() => {
    const tot = this.totalRecords();
    return Math.max(1, Math.ceil(tot / this.pageSize));
  });

  selectTable(tableName: string) {
    this.selectedTable.set(tableName);
    this.currentPage = 1;
    this.dataSearch = '';
    this.explorerService.getTableSchema(tableName).subscribe();
    this.loadTableData(1);
  }

  loadTableData(page: number) {
    this.currentPage = page;
    this.explorerService.getTableData(this.selectedTable(), page, this.pageSize, this.dataSearch).subscribe();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadTableData(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.loadTableData(this.currentPage + 1);
    }
  }

  cellType(val: any): 'null' | 'boolean' | 'object' | 'text' {
    if (val === null || val === undefined) return 'null';
    if (typeof val === 'boolean') return 'boolean';
    if (typeof val === 'object') return 'object';
    return 'text';
  }

  openJsonModal(obj: any) {
    alert(JSON.stringify(obj, null, 2));
  }
}
