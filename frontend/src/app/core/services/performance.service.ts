import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface PerformanceEvaluation {
  overallScore: number;
  complexityFactor: number;
  timelinessRate: number;
  managerRating: number;
  period: string;
  reviewerName: string;
  tierRanking: string;
  overdueTasksCount: number;
  completedTasksCount: number;
  qualityScore: number;
  feedbackNotes: string;
  breakdown: {
    technicalExecution: number;
    codeQuality: number;
    collaboration: number;
    slaAdherence: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/performance';
  private http = inject(HttpClient);

  readonly evaluation = signal<PerformanceEvaluation | null>(null);
  readonly isLoading = signal<boolean>(true);

  loadMyPerformance(): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<{ data: PerformanceEvaluation }>(`${this.apiUrl}/me`).pipe(
      tap((res) => {
        const payload = (res as any)?.data || res;
        this.evaluation.set(payload);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of(null);
      }),
    );
  }
}

