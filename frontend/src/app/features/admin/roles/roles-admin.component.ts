import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService, SystemRole, PermissionMatrixItem } from '../../../core/services/role.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';

@Component({
  selector: 'app-roles-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span class="material-icons text-primary-600 text-2xl">admin_panel_settings</span>
            Roles & Access Control (RBAC)
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise role definitions, dual-guard permission boundaries, and workforce role assignment
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            (click)="openAssignModal()"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-sm">manage_accounts</span>
            Assign User Role
          </button>
          <button
            (click)="showCreateModal.set(true)"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-sm">add</span>
            Create Custom Role
          </button>
        </div>
      </div>

      <!-- Overview Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
            <span class="material-icons">badge</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ roleService.roles().length }}</div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Configured Roles</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <span class="material-icons">verified_user</span>
          </div>
          <div>
            <div class="text-2xl font-black text-emerald-600">9</div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Core System Roles</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <span class="material-icons">security</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">38</div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Granular Permissions</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <span class="material-icons">people</span>
          </div>
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">{{ employeeService.employees().length }}</div>
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Managed Users</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs: Roles Registry vs Permission Matrix -->
      <div class="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          (click)="activeTab.set('roles')"
          [ngClass]="activeTab() === 'roles' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <span class="material-icons text-base">format_list_bulleted</span>
          Enterprise Roles Registry
        </button>
        <button
          (click)="activeTab.set('matrix')"
          [ngClass]="activeTab() === 'matrix' ? 'bg-primary-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
          class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
        >
          <span class="material-icons text-base">grid_view</span>
          Permissions Matrix
        </button>
      </div>

      <!-- TAB 1: Roles Registry Table -->
      <div *ngIf="activeTab() === 'roles'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Role Code</th>
                <th class="py-3 px-4">Role Name</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Type</th>
                <th class="py-3 px-4 text-center">Permissions</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let r of roleService.roles()" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td class="py-3.5 px-4 font-mono font-bold text-primary-600 dark:text-primary-400">
                  {{ r.code }}
                </td>
                <td class="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {{ r.name }}
                </td>
                <td class="py-3.5 px-4 text-slate-600 dark:text-slate-400 max-w-md truncate">
                  {{ r.description }}
                </td>
                <td class="py-3.5 px-4">
                  <span
                    [ngClass]="r.isSystem ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'"
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase"
                  >
                    {{ r.isSystem ? 'System Built-in' : 'Custom' }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                  {{ r.permissionCount ?? (r.code === 'SUPER_ADMIN' ? 'All (*)' : 'Defined') }}
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    (click)="openAssignModalWithRole(r.code)"
                    class="px-2.5 py-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-lg transition cursor-pointer"
                  >
                    Assign to User
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: Permissions Matrix -->
      <div *ngIf="activeTab() === 'matrix'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300">
            System Permission Boundaries by Role
          </div>
          <span class="text-[11px] text-slate-400">Green checkmark indicates authorized capability</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th class="py-3 px-4">Permission</th>
                <th class="py-3 px-3">Module</th>
                <th class="py-3 px-2 text-center">Super Admin</th>
                <th class="py-3 px-2 text-center">Sys Admin</th>
                <th class="py-3 px-2 text-center">IT Mgr</th>
                <th class="py-3 px-2 text-center">HR Mgr</th>
                <th class="py-3 px-2 text-center">Team Lead</th>
                <th class="py-3 px-2 text-center">Employee</th>
                <th class="py-3 px-2 text-center">Auditor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let p of permissionsList" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                <td class="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {{ p.code }}
                </td>
                <td class="py-3 px-3">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                    {{ p.module }}
                  </span>
                </td>
                <td class="py-3 px-2 text-center text-emerald-600 font-bold">
                  <span class="material-icons text-base">check_circle</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('ADMIN')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('ADMIN')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('IT_MANAGER')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('IT_MANAGER')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('HR_MANAGER')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('HR_MANAGER')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('TEAM_LEAD')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('TEAM_LEAD')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('EMPLOYEE')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('EMPLOYEE')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
                <td class="py-3 px-2 text-center">
                  <span *ngIf="p.roles.includes('AUDITOR')" class="material-icons text-base text-emerald-600">check_circle</span>
                  <span *ngIf="!p.roles.includes('AUDITOR')" class="material-icons text-base text-slate-300 dark:text-slate-700">remove</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL: Assign User Role -->
      <div *ngIf="showAssignModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Assign User Role</h3>
            <button (click)="showAssignModal.set(false)" class="text-slate-400 hover:text-slate-600">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Employee</label>
              <select
                [(ngModel)]="selectedUserId"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">-- Choose Employee --</option>
                <option *ngFor="let emp of employeeService.employees()" [value]="emp.id">
                  {{ emp.firstName }} {{ emp.lastName }} ({{ emp.email }} - Current: {{ emp.roleCode }})
                </option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">New Role Code</label>
              <select
                [(ngModel)]="targetRoleCode"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option *ngFor="let r of roleService.roles()" [value]="r.code">
                  {{ r.name }} ({{ r.code }})
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showAssignModal.set(false)"
              class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              [disabled]="!selectedUserId || !targetRoleCode || isSaving()"
              (click)="submitRoleAssignment()"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition disabled:opacity-50 cursor-pointer"
            >
              {{ isSaving() ? 'Assigning...' : 'Save Role Assignment' }}
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL: Create Custom Role -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Create Custom RBAC Role</h3>
            <button (click)="showCreateModal.set(false)" class="text-slate-400 hover:text-slate-600">
              <span class="material-icons text-lg">close</span>
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Role Name</label>
              <input
                type="text"
                [(ngModel)]="newRoleName"
                placeholder="e.g. Operations Coordinator"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Role Code</label>
              <input
                type="text"
                [(ngModel)]="newRoleCode"
                placeholder="e.g. OPERATIONS_COORDINATOR"
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description</label>
              <textarea
                rows="2"
                [(ngModel)]="newRoleDescription"
                placeholder="Responsibilities and access scope..."
                class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              (click)="showCreateModal.set(false)"
              class="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              [disabled]="!newRoleName || !newRoleCode || isSaving()"
              (click)="submitCreateRole()"
              class="px-4 py-2 text-xs font-semibold rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition disabled:opacity-50 cursor-pointer"
            >
              {{ isSaving() ? 'Creating...' : 'Create Role' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RolesAdminComponent implements OnInit {
  roleService = inject(RoleService);
  employeeService = inject(EmployeeService);

  activeTab = signal<'roles' | 'matrix'>('roles');
  showAssignModal = signal<boolean>(false);
  showCreateModal = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  selectedUserId = '';
  targetRoleCode = 'EMPLOYEE';

  newRoleName = '';
  newRoleCode = '';
  newRoleDescription = '';

  permissionsList = [
    { code: 'employees.create', module: 'Employees', roles: ['ADMIN', 'HR_MANAGER'] },
    { code: 'employees.read', module: 'Employees', roles: ['ADMIN', 'HR_MANAGER', 'IT_MANAGER', 'TEAM_LEAD', 'AUDITOR'] },
    { code: 'employees.update', module: 'Employees', roles: ['ADMIN', 'HR_MANAGER'] },
    { code: 'employees.archive', module: 'Employees', roles: ['ADMIN', 'HR_MANAGER'] },
    { code: 'departments.create', module: 'Departments', roles: ['ADMIN'] },
    { code: 'departments.read', module: 'Departments', roles: ['ADMIN', 'HR_MANAGER', 'IT_MANAGER', 'TEAM_LEAD', 'AUDITOR'] },
    { code: 'roles.read', module: 'RBAC', roles: ['ADMIN', 'AUDITOR'] },
    { code: 'roles.assign', module: 'RBAC', roles: ['ADMIN'] },
    { code: 'tasks.create', module: 'Tasks', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD'] },
    { code: 'tasks.read', module: 'Tasks', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD', 'EMPLOYEE', 'AUDITOR'] },
    { code: 'tasks.update', module: 'Tasks', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { code: 'tasks.assign', module: 'Tasks', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD'] },
    { code: 'tickets.create', module: 'ITSM', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { code: 'tickets.read', module: 'ITSM', roles: ['ADMIN', 'IT_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { code: 'tickets.update', module: 'ITSM', roles: ['ADMIN', 'IT_MANAGER'] },
    { code: 'tickets.assign', module: 'ITSM', roles: ['ADMIN', 'IT_MANAGER'] },
    { code: 'tickets.close', module: 'ITSM', roles: ['ADMIN', 'IT_MANAGER'] },
    { code: 'attendance.read', module: 'Attendance', roles: ['ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { code: 'attendance.approve', module: 'Attendance', roles: ['ADMIN', 'HR_MANAGER', 'TEAM_LEAD'] },
    { code: 'timesheets.read', module: 'Timesheets', roles: ['ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'] },
    { code: 'timesheets.approve', module: 'Timesheets', roles: ['ADMIN', 'HR_MANAGER', 'TEAM_LEAD'] },
    { code: 'reports.read', module: 'Reports', roles: ['ADMIN', 'HR_MANAGER', 'IT_MANAGER', 'AUDITOR'] },
    { code: 'reports.export', module: 'Reports', roles: ['ADMIN', 'HR_MANAGER', 'IT_MANAGER', 'AUDITOR'] },
    { code: 'audit_logs.read', module: 'Security', roles: ['ADMIN', 'AUDITOR'] },
  ];

  ngOnInit() {
    this.roleService.loadRoles().subscribe();
    this.employeeService.loadEmployees();
  }

  openAssignModal() {
    this.selectedUserId = '';
    this.targetRoleCode = 'EMPLOYEE';
    this.showAssignModal.set(true);
  }

  openAssignModalWithRole(code: string) {
    this.targetRoleCode = code;
    this.selectedUserId = '';
    this.showAssignModal.set(true);
  }

  submitRoleAssignment() {
    if (!this.selectedUserId || !this.targetRoleCode) return;
    this.isSaving.set(true);
    this.roleService.assignUserRole(this.selectedUserId, this.targetRoleCode).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showAssignModal.set(false);
        this.employeeService.loadEmployees();
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  submitCreateRole() {
    if (!this.newRoleName || !this.newRoleCode) return;
    this.isSaving.set(true);
    this.roleService
      .createRole({
        name: this.newRoleName.trim(),
        code: this.newRoleCode.trim().toUpperCase(),
        description: this.newRoleDescription.trim(),
      })
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showCreateModal.set(false);
          this.newRoleName = '';
          this.newRoleCode = '';
          this.newRoleDescription = '';
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
  }
}
