import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComponentHealth {
  name: string;
  status: string;
  url?: string;
  swaggerUrl?: string;
  studioUrl?: string;
  mode?: string;
  version?: string;
  engine?: string;
  port?: number;
  databaseName?: string;
  connectionPool?: string;
  tablesMapped?: number;
  totalMigrations?: number;
  channels?: string[];
  capabilities?: string[];
}

export interface SystemHealthResponse {
  status: string;
  version: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  components: {
    frontend: ComponentHealth;
    backend: ComponentHealth;
    restApi: ComponentHealth;
    database: ComponentHealth;
    prismaOrm: ComponentHealth;
    migrations: ComponentHealth;
    notificationService: ComponentHealth;
    payrollEngine: ComponentHealth;
    lifecycleService: ComponentHealth;
    [key: string]: ComponentHealth | undefined;
  };
  resources: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  endpoints: {
    frontendUrl: string;
    backendUrl: string;
    swaggerUrl: string;
    healthUrl: string;
    prismaStudioUrl?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/health';
  private http = inject(HttpClient);

  getHealth(): Observable<SystemHealthResponse> {
    return this.http.get<SystemHealthResponse>(this.apiUrl);
  }
}
