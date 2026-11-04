import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div class="w-full max-w-lg">
        <!-- Logo & Title -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-black text-2xl shadow-xl shadow-primary-500/25 mb-3">
            Q
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Q Clocker
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise Task Management & ITSM Performance Hub
          </p>
        </div>

        <!-- Main Login Card -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-8">
          <!-- Error alert -->
          <div
            *ngIf="errorMessage()"
            class="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300"
          >
            <span class="material-icons text-base">error_outline</span>
            <span>{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="name@qclocker.io"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span class="text-[11px] text-slate-400">Enterprise SSO Active</span>
              </div>
              <input
                type="password"
                formControlName="password"
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              [disabled]="isLoading() || loginForm.invalid"
              class="w-full mt-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span
                *ngIf="isLoading()"
                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{ isLoading() ? 'Verifying Corporate Credentials...' : 'Sign In with Corporate Account' }}
            </button>
          </form>

          <!-- Quick One-Click Enterprise Presets (Real Backend Login) -->
          <div class="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Enterprise Role Presets (Real JWT Auth)
              </span>
              <span class="text-[10px] text-slate-400">9 System Roles</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button
                *ngFor="let p of presets"
                type="button"
                (click)="applyPreset(p.email, p.pass)"
                class="flex flex-col items-start p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-500 hover:bg-primary-50/40 dark:hover:bg-slate-800/80 transition text-left group cursor-pointer"
              >
                <span class="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 truncate w-full">
                  {{ p.name }}
                </span>
                <span class="text-[9px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-tight">
                  {{ p.roleLabel }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <p class="text-center text-[11px] text-slate-400 mt-4">
          Secured with SHA-256 Refresh Rotation & Dual-Guard Granular RBAC
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['superadmin@qclocker.io', [Validators.required, Validators.email]],
    password: ['SuperAdmin@2026!', [Validators.required]],
  });

  presets = [
    { roleLabel: 'Super Admin', name: 'Alexander Vance', email: 'superadmin@qclocker.io', pass: 'SuperAdmin@2026!' },
    { roleLabel: 'Sys Admin', name: 'Benjamin Hayes', email: 'sysadmin@qclocker.io', pass: 'SysAdmin@2026!' },
    { roleLabel: 'HR Admin', name: 'Elena Rostova', email: 'hradmin@qclocker.io', pass: 'HrAdmin@2026!' },
    { roleLabel: 'IT Manager', name: 'Marcus Chen', email: 'itmanager@qclocker.io', pass: 'ItManager@2026!' },
    { roleLabel: 'Dept Manager', name: 'Diana Prince', email: 'deptmanager@qclocker.io', pass: 'DeptManager@2026!' },
    { roleLabel: 'Team Lead', name: 'Sarah Jenkins', email: 'teamlead@qclocker.io', pass: 'TeamLead@2026!' },
    { roleLabel: 'Employee', name: 'David Ross', email: 'employee@qclocker.io', pass: 'Employee@2026!' },
    { roleLabel: 'Auditor', name: 'Rachel Adams', email: 'auditor@qclocker.io', pass: 'Auditor@2026!' },
    { roleLabel: 'Viewer', name: 'Victor Stone', email: 'viewer@qclocker.io', pass: 'Viewer@2026!' },
  ];

  applyPreset(email: string, pass: string) {
    this.loginForm.patchValue({ email, password: pass });
    this.onSubmit();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || err?.message || 'Invalid corporate credentials');
      },
    });
  }
}
