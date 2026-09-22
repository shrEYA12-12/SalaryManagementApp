import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Payroll } from '../models/payroll.model';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {

  private apiUrl = 'http://localhost:8080/api/payroll';

  constructor(private http: HttpClient) {}

  getPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(this.apiUrl);
  }

  getPayroll(id: number): Observable<Payroll> {
    return this.http.get<Payroll>(
      `${this.apiUrl}/${id}`
    );
  }

  getEmployeePayroll(employeeId: number): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(
      `${this.apiUrl}/employee/${employeeId}`
    );
  }

  getEmployeePayrollForMonth(
    employeeId: number,
    month: number,
    year: number
  ): Observable<Payroll> {

    return this.http.get<Payroll>(
      `${this.apiUrl}/employee/${employeeId}/${month}/${year}`
    );
  }

  generatePayroll(
    employeeId: number,
    salaryMonth: number,
    salaryYear: number
  ): Observable<Payroll> {

    return this.http.post<Payroll>(
      `${this.apiUrl}/generate`,
      {
        employeeId,
        salaryMonth,
        salaryYear
      }
    );
  }
}