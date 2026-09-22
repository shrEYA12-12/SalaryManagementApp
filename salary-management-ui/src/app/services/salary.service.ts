import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Salary } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private apiUrl = 'http://localhost:8080/api/salaries';

  constructor(private http: HttpClient) {}

  getSalaries(): Observable<Salary[]> {
    return this.http.get<Salary[]>(this.apiUrl);
  }

  getSalary(id: number): Observable<Salary> {
    return this.http.get<Salary>(`${this.apiUrl}/${id}`);
  }

  getEmployeeSalaries(employeeId: number): Observable<Salary[]> {
    return this.http.get<Salary[]>(
      `${this.apiUrl}/employee/${employeeId}`
    );
  }

  createSalary(salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(this.apiUrl, salary);
  }

  updateSalary(id: number, salary: Salary): Observable<Salary> {
    return this.http.put<Salary>(
      `${this.apiUrl}/${id}`,
      salary
    );
  }

  deleteSalary(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}