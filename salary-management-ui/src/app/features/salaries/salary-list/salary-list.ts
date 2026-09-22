import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Salary } from '../../../models/salary.model';
import { SalaryService } from '../../../services/salary.service';

@Component({
  selector: 'app-salary-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './salary-list.html',
  styleUrl: './salary-list.css'
})
export class SalaryList implements OnInit {

  salaries: Salary[] = [];
  filteredSalaries: Salary[] = [];

  searchText = '';
  selectedYear = 'ALL';
  selectedMonth = 'ALL';

  loading = false;
  errorMessage = '';

  constructor(private salaryService: SalaryService) {}

  ngOnInit(): void {
    this.loadSalaries();
  }

loadSalaries(): void {
  this.loading = true;
  this.errorMessage = '';

  console.log('Loading salaries...');

  this.salaryService.getSalaries().subscribe({
    next: (data) => {
      console.log('SALARY API RESPONSE:', data);
      console.log('IS ARRAY:', Array.isArray(data));

      this.salaries = data || [];
      this.applyFilters();

      this.loading = false;

      console.log('Salary loading finished:', this.loading);
    },

    error: (error) => {
      console.error('SALARY API ERROR:', error);

      this.errorMessage =
        error?.error?.message ||
        'Unable to load salary records.';

      this.loading = false;

      console.log('Salary loading finished with error:', this.loading);
    },

    complete: () => {
      console.log('SALARY API COMPLETE');
    }
  });
}

  applyFilters(): void {
    const search = this.searchText.toLowerCase().trim();

    this.filteredSalaries = this.salaries.filter(salary => {

      const matchesSearch =
        !search ||
        salary.employeeId.toString().includes(search);

      const matchesYear =
        this.selectedYear === 'ALL' ||
        salary.salaryYear.toString() === this.selectedYear;

      const matchesMonth =
        this.selectedMonth === 'ALL' ||
        salary.salaryMonth.toString() === this.selectedMonth;

      return matchesSearch && matchesYear && matchesMonth;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedYear = 'ALL';
    this.selectedMonth = 'ALL';
    this.applyFilters();
  }

  get years(): number[] {
    return [
      ...new Set(
        this.salaries.map(salary => salary.salaryYear)
      )
    ].sort((a, b) => b - a);
  }

  get totalNetSalary(): number {
    return this.filteredSalaries.reduce(
      (total, salary) => total + (salary.netSalary || 0),
      0
    );
  }

  get totalGrossSalary(): number {
    return this.filteredSalaries.reduce(
      (total, salary) => total + (salary.grossSalary || 0),
      0
    );
  }

  getMonthName(month: number): string {
    return new Date(2000, month - 1).toLocaleString(
      'default',
      { month: 'short' }
    );
  }
}