import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface TaskItem {
  id: string;
  referenceId: string;
  taskNumber: string;
  title: string;
  description?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  category: string;
  status: string;
  completionPercentage: number;
  startDate: string;
  dueDate: string;
  estimatedHours: string | number;
  actualHours: string | number;
  createdById: string;
  createdByName?: string;
  reviewedById?: string | null;
  departmentId?: string | null;
  departmentName?: string;
  assignedEmployeeId?: string | null;
  assignedEmployeeName?: string;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanBoardData {
  backlog: TaskItem[];
  inProgress: TaskItem[];
  review: TaskItem[];
  completed: TaskItem[];
  stats: {
    total: number;
    backlogCount: number;
    inProgressCount: number;
    reviewCount: number;
    completedCount: number;
    overdueCount: number;
  };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  departmentId?: string;
  teamId?: string;
  projectId?: string;
  priority?: string;
  category?: string;
  assignedEmployeeId?: string;
  reviewerId?: string;
  startDate: string;
  dueDate: string;
  estimatedHours?: number;
  status?: string;
  dependsOnTaskId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/tasks';

  readonly tasks = signal<TaskItem[]>([]);
  readonly kanban = signal<KanbanBoardData | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly selectedTask = signal<any | null>(null);

  constructor(private http: HttpClient) {
    this.loadKanban();
  }

  loadTasks(filter?: { status?: string; priority?: string; search?: string }): Observable<any> {
    this.isLoading.set(true);
    let params = new HttpParams();
    if (filter?.status) params = params.set('status', filter.status);
    if (filter?.priority) params = params.set('priority', filter.priority);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<{ data: TaskItem[] }>(this.apiUrl, { params }).pipe(
      tap((res) => {
        this.tasks.set(res.data || []);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return of({ data: [] });
      }),
    );
  }

  loadKanban(): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<{ data: KanbanBoardData }>(`${this.apiUrl}/kanban`).pipe(
      tap((res) => {
        if (res.data) {
          this.kanban.set(res.data);
          // Also sync flat task list
          const all = [
            ...(res.data.backlog || []),
            ...(res.data.inProgress || []),
            ...(res.data.review || []),
            ...(res.data.completed || []),
          ];
          this.tasks.set(all);
        }
        this.isLoading.set(false);
      }),
      catchError((err) => {
        this.isLoading.set(false);
        return of({ data: null });
      }),
    );
  }

  createTask(payload: CreateTaskPayload): Observable<any> {
    return this.http.post<{ data: TaskItem }>(this.apiUrl, payload).pipe(
      tap(() => {
        this.loadKanban().subscribe();
      }),
    );
  }

  updateTaskStatus(id: string, status: string, completionPercentage?: number): Observable<any> {
    return this.http
      .patch<{ data: TaskItem }>(`${this.apiUrl}/${id}/status`, {
        status,
        completionPercentage,
      })
      .pipe(
        tap(() => {
          this.loadKanban().subscribe();
        }),
      );
  }

  getTaskDetails(id: string): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        this.selectedTask.set(res.data);
      }),
    );
  }

  addComment(taskId: string, comment: string, isInternal: boolean = false): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${taskId}/comments`, { comment, isInternal })
      .pipe(
        tap(() => {
          this.getTaskDetails(taskId).subscribe();
        }),
      );
  }
}
