import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface PrismaTableMeta {
  name: string;
  key: string;
  category: string;
  columnCount: number;
  rowCount: number;
  description: string;
}

export interface PrismaColumnMeta {
  name: string;
  dataType: string;
  isPrimary: boolean;
  isNullable: boolean;
  hasDefault: boolean;
  defaultVal?: string;
}

export interface PrismaTableDataResponse {
  tableName: string;
  total: number;
  page: number;
  limit: number;
  columns: string[];
  rows: any[];
}

// Aliases for seamless migration
export type DrizzleTableMeta = PrismaTableMeta;
export type DrizzleColumnMeta = PrismaColumnMeta;
export type DrizzleTableDataResponse = PrismaTableDataResponse;

@Injectable({
  providedIn: 'root',
})
export class DatabaseExplorerService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/database';
  private http = inject(HttpClient);

  // Reactive Signals
  tables = signal<PrismaTableMeta[]>([]);
  activeTable = signal<string>('users');
  activeSchema = signal<PrismaColumnMeta[]>([]);
  activeData = signal<PrismaTableDataResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getTables(): Observable<PrismaTableMeta[]> {
    this.loading.set(true);
    return this.http.get<PrismaTableMeta[]>(`${this.baseUrl}/tables`).pipe(
      tap({
        next: (res) => {
          this.tables.set(res || []);
          this.loading.set(false);
          this.error.set(null);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message || 'Failed to load Prisma ORM tables');
        },
      }),
    );
  }

  getTableSchema(tableName: string): Observable<{ tableName: string; columns: PrismaColumnMeta[] }> {
    return this.http.get<{ tableName: string; columns: PrismaColumnMeta[] }>(
      `${this.baseUrl}/tables/${tableName}/schema`,
    ).pipe(
      tap({
        next: (res) => {
          this.activeSchema.set(res?.columns || []);
        },
      }),
    );
  }

  getTableData(tableName: string, page = 1, limit = 20, search = ''): Observable<PrismaTableDataResponse> {
    this.loading.set(true);
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PrismaTableDataResponse>(`${this.baseUrl}/tables/${tableName}/data`, { params }).pipe(
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

  setActiveTable(name: string) {
    this.activeTable.set(name);
  }
}
