import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface DrizzleTableMeta {
  name: string;
  key: string;
  category: string;
  columnCount: number;
  rowCount: number;
  description: string;
}

export interface DrizzleColumnMeta {
  name: string;
  dataType: string;
  isPrimary: boolean;
  isNullable: boolean;
  hasDefault: boolean;
  defaultVal?: string;
}

export interface DrizzleTableDataResponse {
  tableName: string;
  total: number;
  page: number;
  limit: number;
  columns: string[];
  rows: any[];
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseExplorerService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/database';
  private http = inject(HttpClient);

  // Reactive Signals
  tables = signal<DrizzleTableMeta[]>([]);
  activeTable = signal<string>('users');
  activeSchema = signal<DrizzleColumnMeta[]>([]);
  activeData = signal<DrizzleTableDataResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getTables(): Observable<DrizzleTableMeta[]> {
    this.loading.set(true);
    return this.http.get<DrizzleTableMeta[]>(`${this.baseUrl}/tables`).pipe(
      tap({
        next: (res) => {
          this.tables.set(res || []);
          this.loading.set(false);
          this.error.set(null);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || 'Failed to load Drizzle ORM tables');
        },
      }),
    );
  }

  getTableSchema(tableName: string): Observable<{ tableName: string; columns: DrizzleColumnMeta[] }> {
    return this.http.get<{ tableName: string; columns: DrizzleColumnMeta[] }>(
      `${this.baseUrl}/tables/${tableName}/schema`,
    ).pipe(
      tap({
        next: (res) => {
          this.activeSchema.set(res?.columns || []);
        },
      }),
    );
  }

  getTableData(tableName: string, page = 1, limit = 20, search = ''): Observable<DrizzleTableDataResponse> {
    this.loading.set(true);
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<DrizzleTableDataResponse>(`${this.baseUrl}/tables/${tableName}/data`, { params }).pipe(
      tap({
        next: (res) => {
          this.activeData.set(res);
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || `Failed to fetch data for ${tableName}`);
        },
      }),
    );
  }
}
