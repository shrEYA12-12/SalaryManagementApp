import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Employee } from '../../../models/employee.model';
import {
  EmployeeService,
  EmployeePage
} from '../../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  searchText = '';
  selectedDepartment = 'ALL';
  selectedStatus = 'ALL';

  loading = false;
  errorMessage = '';

  // ==============================
  // PAGINATION
  // ==============================

  currentPage = 0;
  pageSize = 10;

  totalElements = 0;
  totalPages = 0;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('EmployeeListComponent initialized');

    this.loadEmployees();
  }

  // ==============================
  // LOAD EMPLOYEES
  // ==============================

  loadEmployees(): void {

    console.log('==============================');
    console.log('START: loadEmployees()');
    console.log('Page:', this.currentPage);
    console.log('Page Size:', this.pageSize);
    console.log('==============================');

    this.loading = true;
    this.errorMessage = '';

    this.employeeService
      .getEmployees(this.currentPage, this.pageSize)
      .subscribe({

        next: (data: EmployeePage) => {

          console.log('EMPLOYEE API RESPONSE:', data);

          // Employees for current page
          this.employees =
            Array.isArray(data?.content)
              ? data.content
              : [];

          // Pagination information
          this.totalElements =
            data?.totalElements || 0;

          this.totalPages =
            data?.totalPages || 0;

          this.currentPage =
            data?.number ?? this.currentPage;

          console.log(
            'Employees loaded:',
            this.employees.length
          );

          console.log(
            'Total employees:',
            this.totalElements
          );

          console.log(
            'Total pages:',
            this.totalPages
          );

          this.applyFilters();

          this.loading = false;

          this.cdr.detectChanges();

          console.log('Employee API request completed');
        },

        error: (error) => {

          console.error(
            'EMPLOYEE API ERROR:',
            error
          );

          this.employees = [];
          this.filteredEmployees = [];

          this.totalElements = 0;
          this.totalPages = 0;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load employees. Please try again.';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // ==============================
  // SEARCH / FILTER
  // ==============================

  applyFilters(): void {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    this.filteredEmployees =
      this.employees.filter(
        (employee: Employee) => {

          const employeeCode =
            employee.employeeCode
              ?.toString()
              .toLowerCase() || '';

          const firstName =
            employee.firstName
              ?.toString()
              .toLowerCase() || '';

          const lastName =
            employee.lastName
              ?.toString()
              .toLowerCase() || '';

          const email =
            employee.email
              ?.toString()
              .toLowerCase() || '';

          const department =
            employee.department
              ?.toString()
              .toLowerCase() || '';

          const designation =
            employee.designation
              ?.toString()
              .toLowerCase() || '';

          const matchesSearch =
            !search ||
            employeeCode.includes(search) ||
            firstName.includes(search) ||
            lastName.includes(search) ||
            email.includes(search) ||
            department.includes(search) ||
            designation.includes(search);

          const matchesDepartment =
            this.selectedDepartment === 'ALL' ||
            employee.department ===
              this.selectedDepartment;

          const matchesStatus =
            this.selectedStatus === 'ALL' ||
            employee.status ===
              this.selectedStatus;

          return (
            matchesSearch &&
            matchesDepartment &&
            matchesStatus
          );
        }
      );

    console.log(
      'FILTER RESULT:',
      this.filteredEmployees
    );
  }

  // ==============================
  // DEPARTMENTS
  // ==============================

  get departments(): string[] {

    return [
      ...new Set(
        this.employees
          .map(employee => employee.department)
          .filter(
            (
              department
            ): department is string =>
              !!department
          )
      )
    ];
  }

  // ==============================
  // SUMMARY
  // ==============================

  get activeEmployees(): number {

    return this.employees.filter(
      employee =>
        employee.status === 'ACTIVE'
    ).length;
  }

  get inactiveEmployees(): number {

    return this.employees.filter(
      employee =>
        employee.status !== 'ACTIVE'
    ).length;
  }

  // ==============================
  // PAGINATION
  // ==============================

  goToPage(page: number): void {

    if (
      page < 0 ||
      page >= this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.currentPage = page;

    this.loadEmployees();
  }

  previousPage(): void {

    if (this.currentPage > 0) {

      this.currentPage--;

      this.loadEmployees();
    }
  }

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages - 1
    ) {

      this.currentPage++;

      this.loadEmployees();
    }
  }

  get pageNumbers(): number[] {

    const pages: number[] = [];

    for (
      let i = 0;
      i < this.totalPages;
      i++
    ) {

      pages.push(i);
    }

    return pages;
  }

  get showingFrom(): number {

    if (this.totalElements === 0) {
      return 0;
    }

    return (
      this.currentPage *
        this.pageSize +
      1
    );
  }

  get showingTo(): number {

    return Math.min(
      (this.currentPage + 1) *
        this.pageSize,
      this.totalElements
    );
  }

  // ==============================
  // FILTER CLEAR
  // ==============================

  clearFilters(): void {

    this.searchText = '';
    this.selectedDepartment = 'ALL';
    this.selectedStatus = 'ALL';

    this.applyFilters();

    this.cdr.detectChanges();
  }

  // ==============================
  // ADD EMPLOYEE
  // ==============================

  addEmployee(): void {

    this.router.navigate([
      '/employees/add'
    ]);
  }

  // ==============================
  // VIEW EMPLOYEE
  // ==============================

  viewEmployee(id?: number): void {

    if (
      id === undefined ||
      id === null
    ) {

      console.error(
        'Employee ID is missing'
      );

      return;
    }

    this.router.navigate([
      '/employees/view',
      id
    ]);
  }

  // ==============================
  // EDIT EMPLOYEE
  // ==============================

  editEmployee(id?: number): void {

    if (
      id === undefined ||
      id === null
    ) {

      console.error(
        'Employee ID is missing'
      );

      return;
    }

    this.router.navigate([
      '/employees/edit',
      id
    ]);
  }

  // ==============================
  // DELETE EMPLOYEE
  // ==============================

  deleteEmployee(id?: number): void {

    if (
      id === undefined ||
      id === null
    ) {

      console.error(
        'Employee ID is missing'
      );

      return;
    }

    const confirmed =
      confirm(
        'Are you sure you want to delete this employee?'
      );

    if (!confirmed) {
      return;
    }

    this.employeeService
      .deleteEmployee(id)
      .subscribe({

        next: () => {

          console.log(
            'Employee deleted successfully'
          );

          // If the last employee on a page
          // was deleted, move back one page.
          if (
            this.employees.length === 1 &&
            this.currentPage > 0
          ) {

            this.currentPage--;
          }

          this.loadEmployees();
        },

        error: (error) => {

          console.error(
            'Error deleting employee:',
            error
          );

          this.errorMessage =
            'Unable to delete employee.';

          this.cdr.detectChanges();
        }
      });
  }
}