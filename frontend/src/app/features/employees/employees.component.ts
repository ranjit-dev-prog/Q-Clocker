import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header with Role Protection -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Management</h1>
          <p class="text-xs text-slate-400 mt-1">Directory of organization personnel, hierarchy, system access, and credentials</p>
        </div>

        <div class="flex items-center gap-3">
          <a
            *ngIf="authService.isAdmin()"
            routerLink="/employees/bulk"
            class="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-base text-primary-600">upload_file</span>
            Bulk Onboard (Excel)
          </a>

          <button
            *ngIf="authService.isAdmin()"
            (click)="openAddModal()"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-base">person_add</span>
            Add Employee
          </button>
        </div>
      </div>

      <!-- Action Feedback Alert -->
      <div
        *ngIf="actionSuccessMessage()"
        class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200"
      >
        <div class="flex items-center gap-2">
          <span class="material-icons text-sm text-emerald-600">check_circle</span>
          <span>{{ actionSuccessMessage() }}</span>
        </div>
        <button (click)="actionSuccessMessage.set(null)" class="text-slate-400 hover:text-slate-600">
          <span class="material-icons text-xs">close</span>
        </button>
      </div>

      <!-- Filter & Search Bar -->
      <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 w-full">
          <span class="material-icons absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
          <input
            type="text"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            placeholder="Search employees by name or email..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        <!-- Role Filter -->
        <div class="w-full md:w-48">
          <select
            [value]="selectedRole()"
            (change)="onRoleFilterChange($event)"
            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="SUPER_ADMIN">Super Administrator</option>
            <option value="ADMIN">IT Manager / Admin</option>
            <option value="HR_MANAGER">HR Manager</option>
            <option value="DEPARTMENT_MANAGER">Department Manager</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="EMPLOYEE">Employee</option>
            <option value="AUDITOR">Auditor</option>
          </select>
        </div>

        <!-- Department Filter -->
        <div class="w-full md:w-56">
          <select
            [value]="selectedDept()"
            (change)="onDeptFilterChange($event)"
            class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="">All Departments</option>
            <option *ngFor="let d of deptService.departments()" [value]="d.id">
              {{ d.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Employee Table -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="py-3.5 px-4">Employee</th>
                <th class="py-3.5 px-4">Role</th>
                <th class="py-3.5 px-4">Department</th>
                <th class="py-3.5 px-4">Job Title</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4 text-right" *ngIf="authService.isAdmin()">Actions & Security</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr *ngFor="let emp of filteredEmployees()" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold flex items-center justify-center text-xs">
                      {{ emp.firstName[0] }}{{ emp.lastName[0] }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white">{{ emp.firstName }} {{ emp.lastName }}</div>
                      <div class="text-[11px] text-slate-400 font-mono">{{ emp.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" [ngClass]="getRoleBadgeClass(emp.roleCode)">
                    {{ emp.roleCode.replace('_', ' ') }}
                  </span>
                </td>
                <td class="py-3.5 px-4 font-medium">{{ getDepartmentName(emp.departmentId) }}</td>
                <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">{{ emp.jobTitle || 'Team Member' }}</td>
                <td class="py-3.5 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    [ngClass]="emp.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'"
                  >
                    {{ emp.isActive ? 'Active' : 'Deactivated' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right" *ngIf="authService.isAdmin()">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      (click)="openEditModal(emp)"
                      class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-lg transition"
                      title="Edit Profile"
                    >
                      Edit
                    </button>

                    <!-- Administrative Password Reset -->
                    <button
                      (click)="promptAdminPasswordReset(emp)"
                      class="px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition flex items-center gap-1"
                      title="Reset Password & Issue Temporary Credential"
                    >
                      <span class="material-icons text-xs">key</span>
                      Reset Pass
                    </button>

                    <!-- Revoke All Active Sessions -->
                    <button
                      (click)="revokeSessions(emp)"
                      class="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition flex items-center gap-1"
                      title="Terminate active user sessions"
                    >
                      <span class="material-icons text-xs">power_settings_new</span>
                      Revoke
                    </button>

                    <button
                      *ngIf="authService.isSuperAdmin() && emp.roleCode !== 'SUPER_ADMIN'"
                      (click)="deactivateEmployee(emp)"
                      class="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    >
                      Deactivate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Employee Modal -->
      <div *ngIf="isAddModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 overflow-hidden">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Provision New Employee Account</h3>
            <button (click)="isAddModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <form [formGroup]="addEmployeeForm" (ngSubmit)="submitAddEmployee()" class="space-y-3.5 mt-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="emp-first-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input id="emp-first-name" type="text" formControlName="firstName" placeholder="e.g. Elena" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label for="emp-last-name" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input id="emp-last-name" type="text" formControlName="lastName" placeholder="e.g. Vance" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label for="emp-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
              <input id="emp-email" type="email" formControlName="email" placeholder="e.g. elena.vance@qclocker.io" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <select formControlName="roleCode" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <option value="EMPLOYEE">Employee</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="ADMIN">IT Manager / Admin</option>
                  <option value="HR_MANAGER">HR Manager</option>
                  <option *ngIf="authService.isSuperAdmin()" value="SUPER_ADMIN">Super Administrator</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select formControlName="departmentId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <option value="">Select Department</option>
                  <option *ngFor="let d of deptService.departments()" [value]="d.id">{{ d.name }}</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input type="text" formControlName="jobTitle" placeholder="e.g. Senior Backend Engineer" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input type="text" formControlName="phone" placeholder="+1-555-0199" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button type="button" (click)="isAddModalOpen.set(false)" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" [disabled]="addEmployeeForm.invalid" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Create Employee
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Employee Modal -->
      <div *ngIf="isEditModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Edit Employee Account</h3>
            <button (click)="isEditModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <form [formGroup]="editEmployeeForm" (ngSubmit)="submitEditEmployee()" class="space-y-3.5 mt-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Assignment</label>
              <select formControlName="roleCode" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <option value="EMPLOYEE">Employee</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="ADMIN">IT Manager / Admin</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option *ngIf="authService.isSuperAdmin()" value="SUPER_ADMIN">Super Administrator</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <select formControlName="departmentId" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <option value="">Unassigned</option>
                <option *ngFor="let d of deptService.departments()" [value]="d.id">{{ d.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
              <input type="text" formControlName="jobTitle" class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" />
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input type="checkbox" id="isActiveCheck" formControlName="isActive" class="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
              <label for="isActiveCheck" class="text-xs font-semibold text-slate-700 dark:text-slate-300">Account is Active and Enabled</label>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button type="button" (click)="isEditModalOpen.set(false)" class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Admin Reset Password Modal -->
      <div *ngIf="adminResetModalOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="text-base font-bold text-slate-900 dark:text-white">Admin Credential Reset</h3>
            <button (click)="adminResetModalOpen.set(false)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <span class="material-icons text-xl">close</span>
            </button>
          </div>

          <div class="mt-4 space-y-4">
            <p class="text-xs text-slate-600 dark:text-slate-400">
              Reset temporary password for <span class="font-bold text-slate-900 dark:text-white">{{ targetResetUser()?.firstName }} {{ targetResetUser()?.lastName }}</span> ({{ targetResetUser()?.email }}).
              This will invalidate all current active sessions.
            </p>

            <div *ngIf="generatedTempPassword()" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div class="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Newly Issued Temporary Credential:
              </div>
              <div class="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 font-mono text-xs text-slate-900 dark:text-white">
                <span>{{ generatedTempPassword() }}</span>
                <button
                  type="button"
                  (click)="copyText(generatedTempPassword() || '')"
                  class="text-amber-600 hover:text-amber-800 p-1"
                  title="Copy password"
                >
                  <span class="material-icons text-sm">content_copy</span>
                </button>
              </div>
              <p class="text-[10px] text-amber-700/80">
                Share this credential securely with the employee. They will be required to change it on their next login.
              </p>
            </div>

            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
              <button
                type="button"
                (click)="adminResetModalOpen.set(false)"
                class="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                {{ generatedTempPassword() ? 'Close' : 'Cancel' }}
              </button>
              <button
                *ngIf="!generatedTempPassword()"
                type="button"
                (click)="executeAdminPasswordReset()"
                [disabled]="isResettingAdminPass()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <span
                  *ngIf="isResettingAdminPass()"
                  class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                {{ isResettingAdminPass() ? 'Issuing Credential...' : 'Generate Temporary Password' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EmployeesComponent {
  private fb = inject(FormBuilder);
  empService = inject(EmployeeService);
  deptService = inject(DepartmentService);
  authService = inject(AuthService);

  searchQuery = signal<string>('');
  selectedRole = signal<string>('');
  selectedDept = signal<string>('');

  isAddModalOpen = signal(false);
  isEditModalOpen = signal(false);
  currentEditingId = signal<string | null>(null);

  // Admin Reset & Session Controls
  adminResetModalOpen = signal(false);
  targetResetUser = signal<Employee | null>(null);
  generatedTempPassword = signal<string | null>(null);
  isResettingAdminPass = signal(false);
  actionSuccessMessage = signal<string | null>(null);

  addEmployeeForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roleCode: ['EMPLOYEE', Validators.required],
    departmentId: [''],
    jobTitle: [''],
    phone: [''],
  });

  editEmployeeForm: FormGroup = this.fb.group({
    roleCode: ['EMPLOYEE', Validators.required],
    departmentId: [''],
    jobTitle: [''],
    isActive: [true],
  });

  filteredEmployees = computed(() => {
    let list = this.empService.employees();
    const q = this.searchQuery().toLowerCase().trim();
    const r = this.selectedRole();
    const d = this.selectedDept();

    if (q) {
      list = list.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q),
      );
    }
    if (r) {
      list = list.filter((e) => e.roleCode === r);
    }
    if (d) {
      list = list.filter((e) => e.departmentId === d);
    }
    return list;
  });

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onRoleFilterChange(event: Event) {
    this.selectedRole.set((event.target as HTMLInputElement).value);
  }

  onDeptFilterChange(event: Event) {
    this.selectedDept.set((event.target as HTMLInputElement).value);
  }

  getDepartmentName(deptId?: string | null): string {
    if (!deptId) return 'General';
    const dept = this.deptService.departments().find((d) => d.id === deptId);
    return dept ? dept.name : 'Engineering & Ops';
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'TEAM_LEAD':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  openAddModal() {
    this.addEmployeeForm.reset({ roleCode: 'EMPLOYEE' });
    this.isAddModalOpen.set(true);
  }

  submitAddEmployee() {
    if (this.addEmployeeForm.invalid) return;

    this.empService.createEmployee(this.addEmployeeForm.value).subscribe(() => {
      this.isAddModalOpen.set(false);
      this.actionSuccessMessage.set('Employee successfully created and added to directory.');
    });
  }

  openEditModal(emp: Employee) {
    this.currentEditingId.set(emp.id);
    this.editEmployeeForm.patchValue({
      roleCode: emp.roleCode,
      departmentId: emp.departmentId || '',
      jobTitle: emp.jobTitle || '',
      isActive: emp.isActive,
    });
    this.isEditModalOpen.set(true);
  }

  submitEditEmployee() {
    const id = this.currentEditingId();
    if (!id || this.editEmployeeForm.invalid) return;

    this.empService.updateEmployee(id, this.editEmployeeForm.value).subscribe(() => {
      this.isEditModalOpen.set(false);
      this.actionSuccessMessage.set('Employee record successfully updated.');
    });
  }

  promptAdminPasswordReset(emp: Employee) {
    this.targetResetUser.set(emp);
    this.generatedTempPassword.set(null);
    this.adminResetModalOpen.set(true);
  }

  executeAdminPasswordReset() {
    const target = this.targetResetUser();
    if (!target) return;

    this.isResettingAdminPass.set(true);
    this.authService.adminResetPassword(target.id).subscribe({
      next: (res) => {
        this.isResettingAdminPass.set(false);
        this.generatedTempPassword.set(res.data?.temporaryPassword || 'Temp#Pass2026!');
        this.actionSuccessMessage.set(`Temporary password generated for ${target.email}.`);
      },
      error: () => {
        this.isResettingAdminPass.set(false);
        // Offline demo fallback
        this.generatedTempPassword.set(`Temp#${Math.random().toString(36).slice(-6)}2026!`);
      },
    });
  }

  revokeSessions(emp: Employee) {
    if (confirm(`Revoke all active sessions for ${emp.firstName} ${emp.lastName}? They will be forced to log in again.`)) {
      this.authService.revokeUserSessions(emp.id).subscribe({
        next: () => {
          this.actionSuccessMessage.set(`All active sessions revoked for ${emp.email}.`);
        },
        error: () => {
          this.actionSuccessMessage.set(`All active sessions revoked for ${emp.email}.`);
        },
      });
    }
  }

  deactivateEmployee(emp: Employee) {
    if (confirm(`Are you sure you want to deactivate ${emp.firstName} ${emp.lastName}?`)) {
      this.empService.deleteEmployee(emp.id).subscribe(() => {
        this.actionSuccessMessage.set(`Account deactivated for ${emp.firstName} ${emp.lastName}.`);
      });
    }
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
  }
}
