import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PayslipItem {
  id: string;
  referenceId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  jobTitle: string;
  month: number;
  year: number;
  basicPay: number;
  hra: number;
  allowances: number;
  overtimePay: number;
  grossEarnings: number;
  taxDeduction: number;
  pfDeduction: number;
  insurance: number;
  unpaidLeaveDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: string;
  createdAt: string;
}

export interface TaxDeclaration {
  financialYear: string;
  regime: 'NEW' | 'OLD';
  section80c: number;
  section80d: number;
  hraRentPaid: number;
  homeLoanInterest: number;
  otherExemptions: number;
  status: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/payroll';
  private http = inject(HttpClient);

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/template`, { responseType: 'blob' });
  }

  uploadBatch(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(`${this.apiUrl}/upload-batch`, formData);
  }

  getMyPayslips(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-payslips`);
  }

  getAllBatches(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/batches`);
  }

  downloadPayslipPdf(payslipId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payslips/${payslipId}/download`, {
      responseType: 'blob',
    });
  }

  getTaxDeclaration(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tax-declaration`);
  }

  saveTaxDeclaration(dto: Partial<TaxDeclaration>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tax-declaration`, dto);
  }
}
