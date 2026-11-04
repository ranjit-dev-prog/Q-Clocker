import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface SecurityQuestion {
  id: string;
  prompt: string;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div class="w-full max-w-lg">
        <!-- Logo & Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl shadow-xl shadow-primary-500/25 mb-4">
            Q
          </div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dual-Factor Credential Reset
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Zero-Trust Identity Verification & Entropy Enforcement
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-8">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                [ngClass]="currentStep() === 1 ? 'bg-primary-600 text-white' : 'bg-emerald-500 text-white'"
              >
                {{ currentStep() > 1 ? '✓' : '1' }}
              </span>
              <span class="text-xs font-semibold" [ngClass]="currentStep() === 1 ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500'">
                Identity Challenge
              </span>
            </div>
            <div class="flex-1 mx-4 h-0.5 bg-slate-200 dark:bg-slate-800"></div>
            <div class="flex items-center gap-2">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                [ngClass]="currentStep() === 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'"
              >
                2
              </span>
              <span class="text-xs font-semibold" [ngClass]="currentStep() === 2 ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'">
                New Credential
              </span>
            </div>
          </div>

          <!-- Error Alert -->
          <div
            *ngIf="errorMessage()"
            class="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300"
          >
            <span class="material-icons text-base mt-0.5">error_outline</span>
            <div class="flex-1">{{ errorMessage() }}</div>
          </div>

          <!-- Success Alert -->
          <div
            *ngIf="successMessage()"
            class="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300"
          >
            <span class="material-icons text-base mt-0.5">check_circle</span>
            <div class="flex-1 leading-relaxed">
              {{ successMessage() }}
            </div>
          </div>

          <!-- STEP 1: Token & Security Challenge -->
          <div *ngIf="currentStep() === 1">
            <!-- Token Input (if missing from URL) -->
            <div *ngIf="!hasTokenInUrl()" class="mb-5">
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Recovery Challenge Token
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  [(ngModel)]="tokenInput"
                  placeholder="Paste 15-minute verification token"
                  class="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  (click)="loadChallenge(tokenInput)"
                  class="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  Load Challenge
                </button>
              </div>
            </div>

            <div *ngIf="questions().length > 0">
              <div class="mb-4 text-xs text-slate-600 dark:text-slate-400">
                Answer your pre-configured security questions or provide your emergency recovery passphrase to verify identity:
              </div>

              <div class="space-y-4">
                <div *ngFor="let q of questions(); let i = index">
                  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ i + 1 }}. {{ q.prompt }}
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="answers[q.id]"
                    placeholder="Your answer..."
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div class="pt-2">
                  <div class="relative flex py-2 items-center">
                    <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span class="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">OR EMERGENCY PASSPHRASE</span>
                    <div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  </div>

                  <input
                    type="password"
                    [(ngModel)]="recoveryPassphrase"
                    placeholder="Emergency master recovery passphrase"
                    class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="button"
                  (click)="verifyChallenge()"
                  [disabled]="isVerifying()"
                  class="w-full mt-4 py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-primary-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span
                    *ngIf="isVerifying()"
                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  ></span>
                  {{ isVerifying() ? 'Verifying Challenge Answers...' : 'Verify Identity Challenge' }}
                </button>
              </div>
            </div>
          </div>

          <!-- STEP 2: High Entropy Password Reset -->
          <div *ngIf="currentStep() === 2">
            <div class="mb-4 text-xs text-slate-600 dark:text-slate-400">
              Identity verified. Define your new corporate password adhering to strict zero-trust entropy standards:
            </div>

            <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Corporate Password
                </label>
                <input
                  type="password"
                  formControlName="newPassword"
                  placeholder="Min 12 characters, uppercase, symbol..."
                  (input)="evaluatePassword()"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  formControlName="confirmPassword"
                  placeholder="Re-enter password"
                  (input)="evaluatePassword()"
                  class="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-sm rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <!-- Password Policy Checklist -->
              <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                  Enterprise Password Policy
                </span>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().length ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().length ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>Minimum 12 characters length ({{ passwordLength() }}/12)</span>
                </div>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().hasUpper ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one uppercase letter (A-Z)</span>
                </div>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().hasLower ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one lowercase letter (a-z)</span>
                </div>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().hasNumber ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one numeric digit (0-9)</span>
                </div>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().hasSpecial ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>At least one special character (!@#$%^&*...)</span>
                </div>
                <div class="flex items-center gap-2 text-xs" [ngClass]="policy().matchesConfirm ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  <span class="material-icons text-sm">{{ policy().matchesConfirm ? 'check_circle' : 'radio_button_unchecked' }}</span>
                  <span>Passwords match exactly</span>
                </div>
              </div>

              <button
                type="submit"
                [disabled]="isResetting() || !isPolicySatisfied()"
                class="w-full mt-4 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span
                  *ngIf="isResetting()"
                  class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></span>
                {{ isResetting() ? 'Securing Credentials & Revoking Sessions...' : 'Complete Password Reset' }}
              </button>
            </form>
          </div>

          <!-- Return to Login -->
          <div class="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <a
              routerLink="/auth/login"
              class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-1.5 transition"
            >
              <span class="material-icons text-sm">arrow_back</span>
              Cancel and Return to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  currentStep = signal<1 | 2>(1);
  activeToken = signal<string>('');
  tokenInput = '';
  hasTokenInUrl = signal(false);

  questions = signal<SecurityQuestion[]>([]);
  answers: Record<string, string> = {};
  recoveryPassphrase = '';

  isVerifying = signal(false);
  isResetting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  passwordLength = signal(0);
  policy = signal({
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    matchesConfirm: false,
  });

  resetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit() {
    const urlToken = this.route.snapshot.queryParamMap.get('token');
    if (urlToken) {
      this.hasTokenInUrl.set(true);
      this.activeToken.set(urlToken);
      this.loadChallenge(urlToken);
    }
  }

  loadChallenge(token: string) {
    if (!token) {
      this.errorMessage.set('Please provide a valid recovery token.');
      return;
    }

    this.activeToken.set(token);
    this.errorMessage.set(null);

    this.authService.getResetChallenge(token).subscribe({
      next: (res) => {
        if (res.data?.questions) {
          this.questions.set(res.data.questions);
          this.answers = {};
          res.data.questions.forEach((q: SecurityQuestion) => {
            this.answers[q.id] = '';
          });
        }
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Invalid or expired recovery token.');
      },
    });
  }

  verifyChallenge() {
    const token = this.activeToken();
    if (!token) return;

    this.isVerifying.set(true);
    this.errorMessage.set(null);

    const answersList = Object.keys(this.answers).map((id) => ({
      questionId: id,
      answer: this.answers[id],
    }));

    this.authService
      .verifyResetChallenge(token, answersList, this.recoveryPassphrase)
      .subscribe({
        next: () => {
          this.isVerifying.set(false);
          this.currentStep.set(2);
        },
        error: (err) => {
          this.isVerifying.set(false);
          this.errorMessage.set(err?.error?.message || 'Challenge verification failed. Please check your answers.');
        },
      });
  }

  evaluatePassword() {
    const p = this.resetForm.get('newPassword')?.value || '';
    const c = this.resetForm.get('confirmPassword')?.value || '';

    this.passwordLength.set(p.length);
    this.policy.set({
      length: p.length >= 12,
      hasUpper: /[A-Z]/.test(p),
      hasLower: /[a-z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
      matchesConfirm: p.length > 0 && p === c,
    });
  }

  isPolicySatisfied(): boolean {
    const p = this.policy();
    return p.length && p.hasUpper && p.hasLower && p.hasNumber && p.hasSpecial && p.matchesConfirm;
  }

  onResetPassword() {
    if (!this.isPolicySatisfied()) return;

    this.isResetting.set(true);
    this.errorMessage.set(null);

    const token = this.activeToken();
    const newPassword = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword(token, newPassword).subscribe({
      next: (res) => {
        this.isResetting.set(false);
        this.successMessage.set(
          res.message || 'Password successfully updated! All active sessions have been invalidated. Redirecting to login...',
        );
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2500);
      },
      error: (err) => {
        this.isResetting.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to reset password. Please ensure all entropy rules are satisfied.');
      },
    });
  }
}
