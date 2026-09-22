import { Component } from '@angular/core';
import { Payroll } from '../../../models/payroll.model';
import { PayrollService } from '../../../services/payroll.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './payroll-list.html',
  styleUrl: './payroll-list.css'
})
export class PayrollList {

  payrolls: Payroll[] = [];
  filteredPayrolls: Payroll[] = [];

  searchText = '';
  selectedYear = 'ALL';
  selectedMonth = 'ALL';

  loading = false;
  generating = false;

  errorMessage = '';
  successMessage = '';

  employeeId = '';
  salaryMonth = new Date().getMonth() + 1;
  salaryYear = new Date().getFullYear();

  constructor(
    private payrollService: PayrollService
  ) {}

  ngOnInit(): void {
    this.loadPayrolls();
  }

loadPayrolls(): void {
  this.loading = true;
  this.errorMessage = '';

  console.log('Loading payroll...');

  this.payrollService.getPayrolls().subscribe({
    next: (data) => {
      console.log('PAYROLL API RESPONSE:', data);
      console.log('IS ARRAY:', Array.isArray(data));

      this.payrolls = data || [];
      this.applyFilters();

      this.loading = false;

      console.log('Payroll loading finished:', this.loading);
    },

    error: (error) => {
      console.error('PAYROLL API ERROR:', error);

      this.errorMessage =
        error?.error?.message ||
        'Unable to load payroll records.';

      this.loading = false;

      console.log('Payroll loading finished with error:', this.loading);
    },

    complete: () => {
      console.log('PAYROLL API COMPLETE');
    }
  });
}
  applyFilters(): void {

    const search =
      this.searchText.toLowerCase().trim();

    this.filteredPayrolls =
      this.payrolls.filter(payroll => {

        const matchesSearch =
          !search ||
          payroll.employeeId
            .toString()
            .includes(search);

        const matchesYear =
          this.selectedYear === 'ALL' ||
          payroll.salaryYear.toString() === this.selectedYear;

        const matchesMonth =
          this.selectedMonth === 'ALL' ||
          payroll.salaryMonth.toString() === this.selectedMonth;

        return (
          matchesSearch &&
          matchesYear &&
          matchesMonth
        );
      });
  }

  generatePayroll(): void {

    if (!this.employeeId) {
      this.errorMessage =
        'Please enter an employee ID.';

      return;
    }

    this.generating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.payrollService.generatePayroll(
      Number(this.employeeId),
      Number(this.salaryMonth),
      Number(this.salaryYear)
    ).subscribe({

      next: () => {

        this.successMessage =
          'Payroll generated successfully.';

        this.generating = false;

        this.loadPayrolls();
      },

      error: (error) => {

        console.error(error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to generate payroll.';

        this.generating = false;
      }
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
        this.payrolls.map(
          payroll => payroll.salaryYear
        )
      )
    ].sort((a, b) => b - a);
  }

  get totalNetPayroll(): number {

    return this.filteredPayrolls.reduce(
      (total, payroll) =>
        total + payroll.netSalary,
      0
    );
  }

  getMonthName(month: number): string {

    return new Date(
      2000,
      month - 1
    ).toLocaleString(
      'default',
      { month: 'short' }
    );
  }
}