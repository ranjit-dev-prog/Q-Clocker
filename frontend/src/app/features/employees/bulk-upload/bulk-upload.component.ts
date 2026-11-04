import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';

interface IngestionReport {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: Array<{ rowNumber: number; email?: string; error: string }>;
  insertedUsers: Array<{ id: string; email: string; employeeCode: string; temporaryPassword?: string }>;
}

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumb & Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/employees" class="hover:text-primary-600 transition">Employees</a>
            <span>/</span>
            <span class="text-slate-800 dark:text-slate-200 font-medium">Bulk Onboarding</span>
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bulk Employee Onboarding
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ingest and provision enterprise workforce batches via Excel (.xlsx) or CSV with automatic validation and temporary credential generation.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="downloadTemplate()"
            [disabled]="isDownloadingTemplate()"
            class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span class="material-icons text-base text-primary-600">file_download</span>
            {{ isDownloadingTemplate() ? 'Generating...' : 'Download .xlsx Template' }}
          </button>

          <a
            routerLink="/employees"
            class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <span class="material-icons text-base">arrow_back</span>
            Employee Directory
          </a>
        </div>
      </div>

      <!-- Main Ingestion Panel -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upload & Settings Panel (Left 1 Col) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h2 class="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Select Batch File
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Supported formats: .xlsx (Excel) or .csv (UTF-8). Maximum 1,000 records per upload batch.
            </p>
          </div>

          <!-- Drag and Drop Zone -->
          <div
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
            [ngClass]="isDragging() ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'"
            class="border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[180px]"
            (click)="fileInput.click()"
          >
            <input
              #fileInput
              type="file"
              accept=".xlsx,.xls,.csv"
              (change)="onFileSelected($event)"
              class="hidden"
            />
            <div class="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3">
              <span class="material-icons text-2xl">cloud_upload</span>
            </div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop spreadsheet here
            </div>
            <p class="text-[11px] text-slate-400 mt-1">or browse from your local device</p>
          </div>

          <!-- Selected File Card -->
          <div
            *ngIf="selectedFile()"
            class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <span class="material-icons text-lg">description</span>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {{ selectedFile()?.name }}
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ formatFileSize(selectedFile()?.size || 0) }}
                </div>
              </div>
            </div>
            <button
              type="button"
              (click)="clearSelectedFile()"
              class="text-slate-400 hover:text-rose-500 p-1 rounded transition"
            >
              <span class="material-icons text-sm">close</span>
            </button>
          </div>

          <!-- Error Alert -->
          <div
            *ngIf="uploadError()"
            class="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300"
          >
            <span class="material-icons text-sm mt-0.5">error_outline</span>
            <div class="flex-1">{{ uploadError() }}</div>
          </div>

          <!-- Commit Button -->
          <button
            type="button"
            (click)="commitUpload()"
            [disabled]="!selectedFile() || isUploading()"
            class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span
              *ngIf="isUploading()"
              class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></span>
            {{ isUploading() ? 'Processing & Ingesting Workforce...' : 'Execute Bulk Onboarding' }}
          </button>
        </div>

        <!-- Ingestion Status & Results Panel (Right 2 Cols) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Summary Cards (Shown after upload) -->
          <div *ngIf="report()" class="grid grid-cols-3 gap-4">
            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Total Rows
              </div>
              <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {{ report()?.totalRows }}
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">Evaluated records</div>
            </div>

            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Valid & Created
              </div>
              <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {{ report()?.validRows }}
              </div>
              <div class="text-[10px] text-emerald-600/70 mt-0.5">Accounts provisioned</div>
            </div>

            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 shadow-sm">
              <div class="text-[11px] font-bold uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                Rejected Rows
              </div>
              <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                {{ report()?.invalidRows }}
              </div>
              <div class="text-[10px] text-rose-600/70 mt-0.5">Validation failures</div>
            </div>
          </div>

          <!-- Placeholder when no report yet -->
          <div
            *ngIf="!report()"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm"
          >
            <div class="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <span class="material-icons text-3xl">fact_check</span>
            </div>
            <h3 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              Ready for Workforce Ingestion
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Download the template above, fill out the employee profiles, and upload your spreadsheet to preview validation and create accounts atomically.
            </p>
          </div>

          <!-- Successfully Created Users Table -->
          <div
            *ngIf="report() && (report()?.insertedUsers?.length || 0) > 0"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            <div class="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Provisioned Employees ({{ report()?.insertedUsers?.length }})
                </span>
              </div>
              <span class="text-[10px] text-slate-400">Temporary passwords must be changed upon first login</span>
            </div>

            <div class="overflow-x-auto max-h-72">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-100/60 dark:bg-slate-800/40 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="py-2.5 px-4">Code</th>
                    <th class="py-2.5 px-4">Corporate Email</th>
                    <th class="py-2.5 px-4">Generated Temporary Password</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  <tr *ngFor="let u of report()?.insertedUsers" class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td class="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {{ u.employeeCode }}
                    </td>
                    <td class="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {{ u.email }}
                    </td>
                    <td class="py-2.5 px-4 flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                        {{ u.temporaryPassword }}
                      </span>
                      <button
                        type="button"
                        (click)="copyText(u.temporaryPassword || '')"
                        class="text-slate-400 hover:text-primary-600 transition p-1"
                        title="Copy password"
                      >
                        <span class="material-icons text-xs">content_copy</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Invalidation & Errors Table -->
          <div
            *ngIf="report() && (report()?.errors?.length || 0) > 0"
            class="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/40 overflow-hidden shadow-sm"
          >
            <div class="p-4 bg-rose-50/50 dark:bg-rose-950/20 border-b border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span class="text-xs font-bold text-rose-800 dark:text-rose-200">
                  Validation Rejections ({{ report()?.errors?.length }})
                </span>
              </div>
              <span class="text-[10px] text-rose-600/80">Correct these rows in your spreadsheet and retry</span>
            </div>

            <div class="overflow-x-auto max-h-72">
              <table class="w-full text-left text-xs">
                <thead class="bg-rose-100/40 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th class="py-2.5 px-4 w-20">Row #</th>
                    <th class="py-2.5 px-4">Identifier / Email</th>
                    <th class="py-2.5 px-4">Rejection Reason</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-rose-100 dark:divide-rose-900/20 text-[11px]">
                  <tr *ngFor="let e of report()?.errors" class="hover:bg-rose-50/40 dark:hover:bg-rose-950/30 transition">
                    <td class="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      Line {{ e.rowNumber }}
                    </td>
                    <td class="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {{ e.email || 'N/A' }}
                    </td>
                    <td class="py-2.5 px-4 text-rose-600 dark:text-rose-300 font-medium">
                      {{ e.error }}
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
export class BulkUploadComponent {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  isUploading = signal(false);
  isDownloadingTemplate = signal(false);
  uploadError = signal<string | null>(null);
  report = signal<IngestionReport | null>(null);

  downloadTemplate() {
    this.isDownloadingTemplate.set(true);
    this.employeeService.downloadBulkTemplate().subscribe({
      next: (blob) => {
        this.isDownloadingTemplate.set(false);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'q_clocker_bulk_onboarding_template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.isDownloadingTemplate.set(false);
        this.uploadError.set('Failed to download template. Please check backend connection.');
      },
    });
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    const validExts = ['.xlsx', '.xls', '.csv'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExts.some((ext) => lowerName.endsWith(ext));
    if (!isValid) {
      this.uploadError.set('Please select a valid .xlsx or .csv spreadsheet.');
      return;
    }
    this.uploadError.set(null);
    this.selectedFile.set(file);
    this.report.set(null);
  }

  clearSelectedFile() {
    this.selectedFile.set(null);
    this.uploadError.set(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  commitUpload() {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.uploadError.set(null);

    this.employeeService.uploadBulk(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        const reportData: IngestionReport = res.data || res;
        this.report.set(reportData);
        // Reload employee directory
        this.employeeService.loadEmployees();
      },
      error: (err) => {
        this.isUploading.set(false);
        this.uploadError.set(err?.error?.message || 'Bulk upload failed. Please verify spreadsheet columns.');
      },
    });
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
  }
}

