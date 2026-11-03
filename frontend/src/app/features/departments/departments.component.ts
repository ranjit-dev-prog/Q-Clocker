import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService, Department } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Departments & Teams</h1>
          <p class="text-xs text-slate-400 mt-1">Organizational cost centers, management structure, and squad hierarchy</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            *ngIf="authService.isSuperAdmin()"
            (click)="openAddDeptModal()"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-base">add_business</span>
            Add Department
          </button>
        </div>
      </div>

      <!-- Department Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        <div
          *ngFor="let dept of deptService.departments()"
          class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-primary-300 dark:hover:border-primary-900 transition"
        >
          <div>
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">{{ dept.name }}</h3>
                <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 inline-block mt-1">
                  {{ dept.code }}
                </span>
              </div>
              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                [ngClass]="dept.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'"
              >
                {{ dept.isActive ? 'Active' : 'Archived' }}
              </span>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
              {{ dept.description || 'No description provided.' }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div class="text-[11px] text-slate-400">Department Head:</div>
              <div class="font-semibold text-slate-800 dark:text-slate-200">
                {{ dept.managerName || 'Unassigned' }}
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                {{ dept.memberCount || 0 }} Members
              </span>

              <button
                *ngIf="authService.isAdmin()"
                (click)="openAddTeamModal(dept)"
                class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-lg transition"
              >
                + Add Squad
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Department Modal -->
      <div *ngIf="isAddDeptModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Create New Department</h3>
            <button (click)="isAddDeptModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <form [formGroup]="addDeptForm" (ngSubmit)="submitAddDepartment()" class="space-y-3.5 mt-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
              <input type="text" formControlName="name" placeholder="e.g. Quality Engineering" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department Code</label>
              <input type="text" formControlName="code" placeholder="e.g. QE" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department Description</label>
              <textarea formControlName="description" rows="3" placeholder="Brief mandate and responsibilities..." class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Designated Manager</label>
              <select formControlName="managerId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <option value="">Select Manager</option>
                <option *ngFor="let emp of empService.employees()" [value]="emp.id">
                  {{ emp.firstName }} {{ emp.lastName }} ({{ emp.roleCode }})
                </option>
              </select>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button type="button" (click)="isAddDeptModalOpen.set(false)" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" [disabled]="addDeptForm.invalid" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Create Department
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Add Team Modal -->
      <div *ngIf="isAddTeamModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              Add Squad to {{ selectedDepartment()?.name }}
            </h3>
            <button (click)="isAddTeamModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <form [formGroup]="addTeamForm" (ngSubmit)="submitAddTeam()" class="space-y-3.5 mt-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad Name</label>
              <input type="text" formControlName="name" placeholder="e.g. SRE & Cloud Reliability" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Team Lead</label>
              <select formControlName="leadId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <option value="">Select Team Lead</option>
                <option *ngFor="let emp of empService.employees()" [value]="emp.id">
                  {{ emp.firstName }} {{ emp.lastName }} ({{ emp.roleCode }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad Focus</label>
              <textarea formControlName="description" rows="2" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"></textarea>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button type="button" (click)="isAddTeamModalOpen.set(false)" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" [disabled]="addTeamForm.invalid" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Add Squad
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class DepartmentsComponent {
  private fb = inject(FormBuilder);
  deptService = inject(DepartmentService);
  empService = inject(EmployeeService);
  authService = inject(AuthService);

  isAddDeptModalOpen = signal(false);
  isAddTeamModalOpen = signal(false);
  selectedDepartment = signal<Department | null>(null);

  addDeptForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.maxLength(20)]],
    description: [''],
    managerId: [''],
  });

  addTeamForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    leadId: [''],
    description: [''],
  });

  openAddDeptModal() {
    this.addDeptForm.reset();
    this.isAddDeptModalOpen.set(true);
  }

  submitAddDepartment() {
    if (this.addDeptForm.invalid) return;

    this.deptService.createDepartment(this.addDeptForm.value).subscribe(() => {
      this.isAddDeptModalOpen.set(false);
    });
  }

  openAddTeamModal(dept: Department) {
    this.selectedDepartment.set(dept);
    this.addTeamForm.reset();
    this.isAddTeamModalOpen.set(true);
  }

  submitAddTeam() {
    const dept = this.selectedDepartment();
    if (!dept || this.addTeamForm.invalid) return;

    this.deptService.createTeam(dept.id, this.addTeamForm.value).subscribe(() => {
      this.isAddTeamModalOpen.set(false);
    });
  }
}
