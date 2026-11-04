import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService, PayslipItem, TaxDeclaration } from '../../core/services/payroll.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-finances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/10">
        <div>
          <div class="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <span class="material-icons text-base">payments</span>
            <span>Self-Service Payroll & Tax Engine</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Finances & Payslips</h1>
          <p class="text-emerald-50 text-sm mt-1 max-w-xl">
            Access cryptographically verified payslips, view your annual CTC distribution, and declare investment deductions.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            *ngIf="canManagePayroll()"
            (click)="activeTab.set('payroll-admin')"
            [class.bg-white]="activeTab() === 'payroll-admin'"
            [class.text-emerald-800]="activeTab() === 'payroll-admin'"
            [class.bg-emerald-700]="activeTab() !== 'payroll-admin'"
            [class.text-white]="activeTab() !== 'payroll-admin'"
            class="px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-2 hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span class="material-icons text-base">upload_file</span>
            <span>Bulk Payroll Processing</span>
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          (click)="activeTab.set('payslips')"
          [class.border-emerald-600]="activeTab() === 'payslips'"
          [class.text-emerald-600]="activeTab() === 'payslips'"
          [class.dark:text-emerald-400]="activeTab() === 'payslips'"
          [class.border-transparent]="activeTab() !== 'payslips'"
          [class.text-slate-500]="activeTab() !== 'payslips'"
          class="px-5 py-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition hover:text-emerald-600"
        >
          <span class="material-icons text-base">receipt_long</span>
          <span>Monthly Payslips</span>
          <span class="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold">
            {{ payslips().length }}
          </span>
        </button>

        <button
          (click)="activeTab.set('tax-declaration')"
          [class.border-emerald-600]="activeTab() === 'tax-declaration'"
          [class.text-emerald-600]="activeTab() === 'tax-declaration'"
          [class.dark:text-emerald-400]="activeTab() === 'tax-declaration'"
          [class.border-transparent]="activeTab() !== 'tax-declaration'"
          [class.text-slate-500]="activeTab() !== 'tax-declaration'"
          class="px-5 py-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition hover:text-emerald-600"
        >
          <span class="material-icons text-base">account_balance</span>
          <span>Tax Declaration (IT Form)</span>
        </button>

        <button
          *ngIf="canManagePayroll()"
          (click)="activeTab.set('payroll-admin')"
          [class.border-emerald-600]="activeTab() === 'payroll-admin'"
          [class.text-emerald-600]="activeTab() === 'payroll-admin'"
          [class.dark:text-emerald-400]="activeTab() === 'payroll-admin'"
          [class.border-transparent]="activeTab() !== 'payroll-admin'"
          [class.text-slate-500]="activeTab() !== 'payroll-admin'"
          class="px-5 py-3 border-b-2 font-semibold text-sm flex items-center gap-2 transition hover:text-emerald-600"
        >
          <span class="material-icons text-base">admin_panel_settings</span>
          <span>Payroll Batch Management</span>
        </button>
      </div>

      <!-- Tab 1: Monthly Payslips View -->
      <div *ngIf="activeTab() === 'payslips'" class="space-y-6">
        <!-- Quick Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Net Salary</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              \${{ latestPayslip()?.netSalary?.toLocaleString() || '0' }}
            </div>
            <div class="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <span class="material-icons text-sm">verified</span> Verified & Disbursed
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Annualized Gross</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              \${{ annualGross().toLocaleString() }}
            </div>
            <div class="text-xs text-slate-500 mt-1">Based on active remuneration</div>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">PF & Social Security YTD</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              \${{ ytdPf().toLocaleString() }}
            </div>
            <div class="text-xs text-slate-500 mt-1">Statutory contributions</div>
          </div>

          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
            <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tax Deducted (TDS YTD)</div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              \${{ ytdTax().toLocaleString() }}
            </div>
            <div class="text-xs text-slate-500 mt-1">Withheld per tax slabs</div>
          </div>
        </div>

        <!-- Payslips Table -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span class="material-icons text-emerald-600 text-lg">history</span>
              Salary Disbursement History
            </h3>
            <span class="text-xs text-slate-400">PDFs contain digital company seal and verification hash</span>
          </div>

          <div *ngIf="isLoading()" class="p-12 text-center text-slate-500">
            <span class="material-icons animate-spin text-3xl text-emerald-600">sync</span>
            <p class="mt-2 text-sm font-medium">Fetching salary records...</p>
          </div>

          <div *ngIf="!isLoading() && payslips().length === 0" class="p-12 text-center text-slate-400">
            <span class="material-icons text-5xl text-slate-300">receipt</span>
            <p class="mt-2 text-base font-semibold text-slate-700 dark:text-slate-300">No payslips found</p>
            <p class="text-xs text-slate-400 mt-1">Payslips generated by HR will appear here automatically.</p>
          </div>

          <div *ngIf="!isLoading() && payslips().length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th class="p-4">Period</th>
                  <th class="p-4">Reference</th>
                  <th class="p-4">Gross Earnings</th>
                  <th class="p-4">Deductions</th>
                  <th class="p-4">Net Disbursed</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <tr *ngFor="let item of payslips()" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td class="p-4 font-semibold text-slate-900 dark:text-white">
                    {{ getMonthName(item.month) }} {{ item.year }}
                  </td>
                  <td class="p-4 font-mono text-slate-500">
                    {{ item.referenceId }}
                  </td>
                  <td class="p-4 font-semibold text-slate-800 dark:text-slate-200">
                    \${{ item.grossEarnings?.toLocaleString() }}
                  </td>
                  <td class="p-4 text-rose-600 font-medium">
                    -\${{ item.totalDeductions?.toLocaleString() }}
                  </td>
                  <td class="p-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    \${{ item.netSalary?.toLocaleString() }}
                  </td>
                  <td class="p-4">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                      {{ item.status || 'PAID' }}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <button
                      (click)="downloadPdf(item)"
                      [disabled]="downloadingId() === item.id"
                      class="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 font-semibold inline-flex items-center gap-1.5 transition text-xs shadow-xs"
                    >
                      <span class="material-icons text-sm" [class.animate-spin]="downloadingId() === item.id">
                        {{ downloadingId() === item.id ? 'sync' : 'picture_as_pdf' }}
                      </span>
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 2: Tax Declaration Form -->
      <div *ngIf="activeTab() === 'tax-declaration'" class="space-y-6">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-icons text-emerald-600">receipt</span>
                Investment Proof & Tax Savings Declaration (FY 2026-27)
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                Declare your eligible deductions to optimize withholding taxes (TDS) under corporate payroll.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold text-slate-400">Current Regime:</span>
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {{ taxDecl.regime }} Regime
              </span>
            </div>
          </div>

          <!-- Form Fields -->
          <form (ngSubmit)="saveTax()" class="space-y-6">
            <!-- Regime Selector -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Tax Regime Selection
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  (click)="taxDecl.regime = 'NEW'"
                  [class.border-emerald-600]="taxDecl.regime === 'NEW'"
                  [class.bg-emerald-50/30]="taxDecl.regime === 'NEW'"
                  class="cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition"
                >
                  <input type="radio" name="regime" value="NEW" [checked]="taxDecl.regime === 'NEW'" class="mt-1" />
                  <div>
                    <div class="font-bold text-sm text-slate-900 dark:text-white">New Tax Regime (Default)</div>
                    <div class="text-xs text-slate-500 mt-0.5">Lower tax rates with standard deduction; minimal exemptions allowed.</div>
                  </div>
                </label>

                <label
                  (click)="taxDecl.regime = 'OLD'"
                  [class.border-emerald-600]="taxDecl.regime === 'OLD'"
                  [class.bg-emerald-50/30]="taxDecl.regime === 'OLD'"
                  class="cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition"
                >
                  <input type="radio" name="regime" value="OLD" [checked]="taxDecl.regime === 'OLD'" class="mt-1" />
                  <div>
                    <div class="font-bold text-sm text-slate-900 dark:text-white">Old Tax Regime</div>
                    <div class="text-xs text-slate-500 mt-0.5">Permits 80C, 80D health insurance, HRA rent exemption and home loan deductions.</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Deductions Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section 80C Investments (PPF, ELSS, EPF, LIC) - Max \${{ (150000).toLocaleString() }}
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">\$</span>
                  <input
                    type="number"
                    [(ngModel)]="taxDecl.section80c"
                    name="section80c"
                    min="0"
                    max="150000"
                    class="w-full pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Section 80D Health Insurance Premium (Self & Parents)
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">\$</span>
                  <input
                    type="number"
                    [(ngModel)]="taxDecl.section80d"
                    name="section80d"
                    min="0"
                    class="w-full pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  House Rent Allowance (HRA) - Annual Rent Paid
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">\$</span>
                  <input
                    type="number"
                    [(ngModel)]="taxDecl.hraRentPaid"
                    name="hraRentPaid"
                    min="0"
                    class="w-full pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Home Loan Interest Deduction (Section 24b)
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">\$</span>
                  <input
                    type="number"
                    [(ngModel)]="taxDecl.homeLoanInterest"
                    name="homeLoanInterest"
                    min="0"
                    class="w-full pl-8 pr-4 py-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            <!-- Success Alert -->
            <div *ngIf="taxSavedAlert()" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <span class="material-icons text-base">check_circle</span>
              Tax declaration successfully synchronized with corporate payroll engine!
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4">
              <button
                type="submit"
                [disabled]="isSavingTax()"
                class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition"
              >
                <span class="material-icons text-base" [class.animate-spin]="isSavingTax()">
                  {{ isSavingTax() ? 'sync' : 'save' }}
                </span>
                <span>Submit Tax Declaration</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Tab 3: HR / Admin Bulk Payroll Processing -->
      <div *ngIf="activeTab() === 'payroll-admin' && canManagePayroll()" class="space-y-6">
        <!-- Actions & Template Download Card -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-icons text-emerald-600">publish</span>
                Bulk Excel Payroll Ingestion
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                Upload enterprise payroll spreadsheet (.xlsx) with salary breakdown. Payslips and cryptographic PDF tokens will be batch generated.
              </p>
            </div>
            <button
              (click)="downloadExcelTemplate()"
              class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition"
            >
              <span class="material-icons text-base text-emerald-600">download</span>
              <span>Download Excel Template (.xlsx)</span>
            </button>
          </div>

          <!-- Drag and Drop Zone -->
          <div
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onFileDrop($event)"
            [class.border-emerald-500]="isDragging"
            [class.bg-emerald-50]="isDragging"
            class="mt-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center transition cursor-pointer hover:border-emerald-500"
            (click)="fileInput.click()"
          >
            <input #fileInput type="file" (change)="onFileSelected($event)" accept=".xlsx,.csv" class="hidden" />
            <span class="material-icons text-5xl text-emerald-600 dark:text-emerald-400">cloud_upload</span>
            <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">
              Drag & Drop payroll file here, or click to browse
            </p>
            <p class="text-xs text-slate-400 mt-1">Supports Microsoft Excel (.xlsx) and CSV files up to 25MB</p>
          </div>

          <!-- Upload Status Indicator -->
          <div *ngIf="isUploadingBatch()" class="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center">
            <span class="material-icons animate-spin text-2xl text-emerald-600">sync</span>
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
              Ingesting rows, validating tax numbers & generating signed PDFs...
            </p>
          </div>

          <!-- Batch Upload Result Notification -->
          <div *ngIf="uploadResult()" class="mt-4 p-4 rounded-xl border" [class.bg-emerald-50]="uploadResult()?.success" [class.border-emerald-200]="uploadResult()?.success" [class.bg-rose-50]="!uploadResult()?.success" [class.border-rose-200]="!uploadResult()?.success">
            <div class="flex items-center gap-2 font-bold text-xs" [class.text-emerald-800]="uploadResult()?.success" [class.text-rose-800]="!uploadResult()?.success">
              <span class="material-icons text-base">{{ uploadResult()?.success ? 'check_circle' : 'error' }}</span>
              <span>{{ uploadResult()?.message }}</span>
            </div>
            <div *ngIf="uploadResult()?.batch" class="mt-2 text-xs text-slate-600 dark:text-slate-400 grid grid-cols-3 gap-2">
              <div>Total Employees: <span class="font-bold text-slate-900 dark:text-white">{{ uploadResult().batch.totalRecords }}</span></div>
              <div>Disbursed: <span class="font-bold text-slate-900 dark:text-white">\${{ uploadResult().batch.totalDisbursed?.toLocaleString() }}</span></div>
              <div>Batch ID: <span class="font-mono text-slate-500">{{ uploadResult().batch.referenceId }}</span></div>
            </div>
          </div>
        </div>

        <!-- Historical Batches -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div class="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span class="material-icons text-emerald-600 text-lg">folder_open</span>
              Disbursed Payroll Batches
            </h3>
          </div>

          <div *ngIf="batches().length === 0" class="p-8 text-center text-slate-400 text-xs">
            No historical batches uploaded yet.
          </div>

          <div *ngIf="batches().length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th class="p-4">Batch Ref</th>
                  <th class="p-4">Period</th>
                  <th class="p-4">Headcount</th>
                  <th class="p-4">Total Disbursed</th>
                  <th class="p-4">Processed By</th>
                  <th class="p-4">Created Date</th>
                  <th class="p-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr *ngFor="let b of batches()" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td class="p-4 font-mono font-bold text-slate-900 dark:text-white">{{ b.referenceId }}</td>
                  <td class="p-4 font-semibold text-slate-700 dark:text-slate-300">{{ getMonthName(b.month) }} {{ b.year }}</td>
                  <td class="p-4">{{ b.totalRecords }} Employees</td>
                  <td class="p-4 font-bold text-emerald-600">\${{ b.totalDisbursed?.toLocaleString() }}</td>
                  <td class="p-4 text-slate-500">{{ b.processedByName || 'System HR' }}</td>
                  <td class="p-4 text-slate-400">{{ b.createdAt | date:'mediumDate' }}</td>
                  <td class="p-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {{ b.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MyFinancesComponent implements OnInit {
  private payrollService = inject(PayrollService);
  private authService = inject(AuthService);

  activeTab = signal<'payslips' | 'tax-declaration' | 'payroll-admin'>('payslips');
  payslips = signal<PayslipItem[]>([]);
  batches = signal<any[]>([]);
  isLoading = signal(true);
  downloadingId = signal<string | null>(null);
  isSavingTax = signal(false);
  taxSavedAlert = signal(false);
  isUploadingBatch = signal(false);
  uploadResult = signal<any | null>(null);
  isDragging = false;

  taxDecl: Partial<TaxDeclaration> = {
    regime: 'NEW',
    section80c: 150000,
    section80d: 25000,
    hraRentPaid: 180000,
    homeLoanInterest: 0,
    financialYear: '2026-2027',
  };

  latestPayslip = computed(() => (this.payslips().length > 0 ? this.payslips()[0] : null));
  annualGross = computed(() => (this.latestPayslip()?.grossEarnings || 0) * 12);
  ytdPf = computed(() => this.payslips().reduce((sum, p) => sum + (p.pfDeduction || 0), 0));
  ytdTax = computed(() => this.payslips().reduce((sum, p) => sum + (p.taxDeduction || 0), 0));

  ngOnInit() {
    this.loadPayslips();
    this.loadTaxDeclaration();
    if (this.canManagePayroll()) {
      this.loadBatches();
    }
  }

  canManagePayroll(): boolean {
    return this.authService.isSuperAdmin() || this.authService.isAdmin() || this.authService.isHR();
  }

  loadPayslips() {
    this.isLoading.set(true);
    this.payrollService.getMyPayslips().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : res?.payslips || [];
        this.payslips.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadTaxDeclaration() {
    this.payrollService.getTaxDeclaration().subscribe({
      next: (res) => {
        if (res) {
          this.taxDecl = { ...this.taxDecl, ...res };
        }
      },
    });
  }

  loadBatches() {
    this.payrollService.getAllBatches().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : res?.batches || [];
        this.batches.set(list);
      },
    });
  }

  saveTax() {
    this.isSavingTax.set(true);
    this.payrollService.saveTaxDeclaration(this.taxDecl).subscribe({
      next: () => {
        this.isSavingTax.set(false);
        this.taxSavedAlert.set(true);
        setTimeout(() => this.taxSavedAlert.set(false), 4000);
      },
      error: () => this.isSavingTax.set(false),
    });
  }

  downloadPdf(payslip: PayslipItem) {
    this.downloadingId.set(payslip.id);
    this.payrollService.downloadPayslipPdf(payslip.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Payslip_${payslip.employeeCode}_${this.getMonthName(payslip.month)}_${payslip.year}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingId.set(null);
      },
      error: () => this.downloadingId.set(null),
    });
  }

  downloadExcelTemplate() {
    this.payrollService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'QClocker_Payroll_Batch_Template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.uploadPayrollFile(file);
    }
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }

  onFileDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      this.uploadPayrollFile(file);
    }
  }

  uploadPayrollFile(file: File) {
    this.isUploadingBatch.set(true);
    this.uploadResult.set(null);
    this.payrollService.uploadBatch(file).subscribe({
      next: (res) => {
        this.isUploadingBatch.set(false);
        this.uploadResult.set({ success: true, message: 'Payroll batch processed successfully', batch: res });
        this.loadBatches();
        this.loadPayslips();
      },
      error: (err) => {
        this.isUploadingBatch.set(false);
        this.uploadResult.set({ success: false, message: err?.error?.message || 'Failed to process payroll spreadsheet' });
      },
    });
  }

  getMonthName(monthNum: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return months[monthNum - 1] || `Month ${monthNum}`;
  }
}
