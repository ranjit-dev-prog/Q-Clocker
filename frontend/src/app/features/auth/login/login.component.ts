import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div class="w-full max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-black text-2xl shadow-xl shadow-primary-500/25 mb-3">
            Q
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome to Q Clocker
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enterprise Task Management & Performance Hub
          </p>
        </div>

        <!-- Main Card -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-8">
          <!-- Error alert -->
          <div *ngIf="errorMessage()" class="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <span class="material-icons text-base">error_outline</span>
            <span>{{ errorMessage() }}</span>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="name@organization.com"
                class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="javascript:void(0)" class="text-xs font-medium text-primary-600 hover:text-primary-700">Forgot?</a>
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
              [disabled]="isLoading()"
              class="w-full mt-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <span *ngIf="isLoading()" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isLoading() ? 'Signing In...' : 'Sign In to Workspace' }}
            </button>
          </form>

          <!-- Quick Demo Login Presets -->
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div class="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-3 text-center">
              Quick One-Click Demo Logins
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button
                *ngFor="let p of presets"
                type="button"
                (click)="applyPreset(p.role, p.email, p.pass)"
                class="flex flex-col items-start p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 hover:bg-primary-50/40 dark:hover:bg-slate-800/80 transition text-left group"
              >
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600">{{ p.label }}</span>
                <span class="text-[10px] text-slate-400">{{ p.role }}</span>
              </button>
            </div>
          </div>
        </div>
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
    { role: 'SUPER_ADMIN' as UserRole, label: 'Alexander Vance', email: 'superadmin@qclocker.io', pass: 'SuperAdmin@2026!' },
    { role: 'ADMIN' as UserRole, label: 'Marcus Chen', email: 'itmanager@qclocker.io', pass: 'Manager@2026!' },
    { role: 'TEAM_LEAD' as UserRole, label: 'Sarah Jenkins', email: 'teamlead@qclocker.io', pass: 'TeamLead@2026!' },
    { role: 'EMPLOYEE' as UserRole, label: 'David Ross', email: 'employee@qclocker.io', pass: 'Employee@2026!' },
  ];

  applyPreset(role: UserRole, email: string, pass: string) {
    this.loginForm.patchValue({ email, password: pass });
    this.authService.quickSwitchRole(role);
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
        this.errorMessage.set(err?.error?.message || 'Invalid email or password');
      },
    });
  }
}

