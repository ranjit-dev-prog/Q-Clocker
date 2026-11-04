import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div class="w-full max-w-md">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl shadow-xl shadow-primary-500/25 mb-4">
            Q
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Q Clocker Enterprise
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Zero-Trust Workforce Management & ITSM Platform
          </p>
        </div>

        <!-- Main Login Card -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-8">
          <!-- Error alert -->
          <div
            *ngIf="errorMessage()"
            class="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
          >
            <span class="material-icons text-base mt-0.5">error_outline</span>
            <div class="flex-1 leading-relaxed">
              {{ errorMessage() }}
            </div>
          </div>

          <!-- Account Lockout Alert -->
          <div
            *ngIf="isLockedOut()"
            class="mb-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200"
          >
            <span class="material-icons text-base mt-0.5 text-amber-600">lock_clock</span>
            <div class="flex-1 leading-relaxed">
              <span class="font-bold">Rate Limit Protection:</span>
              Multiple failed authentication attempts detected. This IP or account has been temporarily restricted. Please try again after 15 minutes or initiate
              <a routerLink="/auth/forgot-password" class="font-semibold underline hover:text-amber-900 dark:hover:text-amber-100">Account Recovery</a>.
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span class="material-icons text-sm">alternate_email</span>
                </span>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="user@qclocker.io"
                  class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Password
                </label>
                <a
                  routerLink="/auth/forgot-password"
                  class="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition cursor-pointer"
                >
                  Forgot Password?
                </a>
              </div>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <span class="material-icons text-sm">lock_outline</span>
                </span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••••••"
                  class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <span class="material-icons text-sm">{{ showPassword() ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <!-- Remember me & SSO indicator -->
            <div class="flex items-center justify-between pt-1">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="rememberMe"
                  class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <span class="text-xs text-slate-600 dark:text-slate-400">Remember corporate email</span>
              </label>
              <span class="text-[11px] text-slate-400 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                SSO & MFA Enabled
              </span>
            </div>

            <!-- Anti-Automation Bot Challenge (Appears after consecutive failures) -->
            <div
              *ngIf="showBotChallenge()"
              class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span class="material-icons text-sm text-primary-600">verified_user</span>
                  Bot Defense Challenge
                </span>
                <span class="text-[10px] text-slate-400 font-mono">SecCheck v2.5</span>
              </div>
              <label class="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-primary-500 transition">
                <input
                  type="checkbox"
                  [checked]="botChallengeVerified()"
                  (change)="onBotChallengeToggle($event)"
                  class="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="text-xs text-slate-700 dark:text-slate-300">
                  I confirm I am an authorized corporate operator
                </span>
              </label>
            </div>

            <button
              type="submit"
              [disabled]="isLoading() || loginForm.invalid || (showBotChallenge() && !botChallengeVerified()) || isLockedOut()"
              class="w-full mt-3 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <span
                *ngIf="isLoading()"
                class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></span>
              {{ isLoading() ? 'Authenticating Corporate Session...' : 'Sign In to Workspace' }}
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Need account provisioning?
              <span class="text-slate-700 dark:text-slate-300 font-medium">Contact your System Administrator</span>
            </p>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="mt-6 text-center space-y-1">
          <p class="text-[11px] text-slate-400">
            Protected by Q Clocker Enterprise Security Engine & Sliding-Window Rate Limiter
          </p>
          <p class="text-[10px] text-slate-400 font-mono">
            TLS 1.3 • AES-256-GCM Session Tokens • ISO/IEC 27001 Compliant
          </p>
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
  showPassword = signal(false);
  consecutiveFailures = signal(0);
  showBotChallenge = signal(false);
  botChallengeVerified = signal(false);
  isLockedOut = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  constructor() {
    const savedEmail = localStorage.getItem('q_clocker_remembered_email');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail, rememberMe: true });
    }
  }

  onBotChallengeToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.botChallengeVerified.set(target.checked);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    if (this.showBotChallenge() && !this.botChallengeVerified()) {
      this.errorMessage.set('Please complete the bot defense verification.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('q_clocker_remembered_email', email);
    } else {
      localStorage.removeItem('q_clocker_remembered_email');
    }

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.consecutiveFailures.set(0);
        this.showBotChallenge.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const failures = this.consecutiveFailures() + 1;
        this.consecutiveFailures.set(failures);

        if (failures >= 3) {
          this.showBotChallenge.set(true);
          this.botChallengeVerified.set(false);
        }

        if (err?.status === 429) {
          this.isLockedOut.set(true);
          this.errorMessage.set(err?.error?.message || 'Rate limit exceeded: Account temporarily locked due to consecutive authentication failures.');
        } else {
          this.errorMessage.set(
            err?.error?.message || err?.message || 'Invalid corporate email or password. Please verify and retry.',
          );
        }
      },
    });
  }
}
