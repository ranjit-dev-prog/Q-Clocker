import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div class="w-full max-w-md">
        <!-- Logo & Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl shadow-xl shadow-primary-500/25 mb-4">
            Q
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Account Recovery
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Self-Service Dual-Factor Identity Verification
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-8">
          <!-- Step 1: Request Email -->
          <div *ngIf="!requestDispatched()">
            <div class="mb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your corporate email address registered in the organization directory. An identity challenge will be initiated to verify your account ownership.
            </div>

            <!-- Error alert -->
            <div
              *ngIf="errorMessage()"
              class="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
            >
              <span class="material-icons text-base mt-0.5">error_outline</span>
              <div class="flex-1">{{ errorMessage() }}</div>
            </div>

            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
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

              <button
                type="submit"
                [disabled]="isLoading() || forgotForm.invalid"
                class="w-full mt-2 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span
                  *ngIf="isLoading()"
                  class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                {{ isLoading() ? 'Dispatching Verification Token...' : 'Initiate Recovery Challenge' }}
              </button>
            </form>
          </div>

          <!-- Step 2: Confirmation & Proceed -->
          <div *ngIf="requestDispatched()" class="space-y-4">
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-3">
              <span class="material-icons text-emerald-600 text-xl mt-0.5">mark_email_read</span>
              <div class="text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                <p class="font-bold">Instructions Dispatched</p>
                <p>
                  {{ dispatchedMessage() }}
                </p>
              </div>
            </div>

            <!-- Token Proceed Box (Displays for zero-friction challenge transition) -->
            <div *ngIf="recoveryToken()" class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Active Verification Token (15-Minute Expiry):
              </div>
              <div class="font-mono text-xs text-primary-600 dark:text-primary-400 break-all select-all p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {{ recoveryToken() }}
              </div>
            </div>

            <button
              type="button"
              (click)="proceedToChallenge()"
              class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Security Challenge
              <span class="material-icons text-sm">arrow_forward</span>
            </button>
          </div>

          <!-- Back to login -->
          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <a
              routerLink="/auth/login"
              class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1.5 transition"
            >
              <span class="material-icons text-sm">arrow_back</span>
              Return to Corporate Sign In
            </a>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-[11px] text-slate-400">
            Self-service recovery enforces dual-factor security challenge validation.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  requestDispatched = signal(false);
  dispatchedMessage = signal('');
  recoveryToken = signal<string | null>(null);

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.requestDispatched.set(true);
        this.dispatchedMessage.set(
          res.message || 'If an account exists for this corporate email address, recovery challenge instructions have been dispatched.',
        );
        if (res.data?.token) {
          this.recoveryToken.set(res.data.token);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to dispatch recovery request. Please try again.');
      },
    });
  }

  proceedToChallenge() {
    const token = this.recoveryToken();
    if (token) {
      this.router.navigate(['/auth/reset-password'], { queryParams: { token } });
    } else {
      this.router.navigate(['/auth/reset-password']);
    }
  }
}

