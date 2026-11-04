import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/reports';
  private http = inject(HttpClient);

  getItsmReport(query?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/itsm`, { params: query });
  }

  getWorkforceReport(query?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/workforce`, { params: query });
  }

  getAuditReport(query?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/audit`, { params: query });
  }

  exportReport(reportType: 'itsm' | 'workforce' | 'audit', format: 'xlsx' | 'csv', query?: any): Observable<Blob> {
    const params = { ...(query || {}), reportType, format };
    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob',
    });
  }
}
