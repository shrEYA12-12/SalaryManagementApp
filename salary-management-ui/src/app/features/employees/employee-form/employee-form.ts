import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';

import { Salary } from '../../../models/salary.model';
import { SalaryService } from '../../../services/salary.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeFormComponent implements OnInit {

  employee: Employee = {
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    designation: '',
    joiningDate: '',
    salary: 0,
    status: 'ACTIVE'
  };

  salary: Salary = {
    employeeId: 0,
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    salaryMonth: new Date().getMonth() + 1,
    salaryYear: new Date().getFullYear()
  };

  isEditMode = false;
  employeeId?: number;
  salaryId?: number;

  loading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private salaryService: SalaryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.isEditMode = true;
      this.employeeId = Number(id);

      this.loadEmployee(this.employeeId);

    }
  }

  // ============================================================
  // LOAD EMPLOYEE
  // ============================================================

  loadEmployee(id: number): void {

    this.loading = true;
    this.errorMessage = '';

    console.log('Loading employee:', id);

    this.employeeService
      .getEmployee(id)
      .subscribe({

        next: (data) => {

          console.log(
            'EMPLOYEE RESPONSE:',
            data
          );

          this.employee = {
            ...data,

            joiningDate:
              data.joiningDate
                ? data.joiningDate.substring(0, 10)
                : ''
          };

          // Load salary structure
          this.loadEmployeeSalary(id);
        },

        error: (error) => {

          console.error(
            'Error loading employee:',
            error
          );

          this.errorMessage =
            'Unable to load employee details.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // ============================================================
  // LOAD EMPLOYEE SALARY
  // ============================================================

  loadEmployeeSalary(
    employeeId: number
  ): void {

    console.log(
      'Loading salary for employee:',
      employeeId
    );

    this.salaryService
      .getEmployeeSalaries(employeeId)
      .subscribe({

        next: (salaries) => {

          console.log(
            'SALARY RESPONSE:',
            salaries
          );

          if (
            salaries &&
            salaries.length > 0
          ) {

            // Take the latest salary record
            const latestSalary =
              salaries[salaries.length - 1];

            this.salary = {
              ...latestSalary
            };

            this.salaryId =
              latestSalary.id;

            console.log(
              'Latest salary:',
              this.salary
            );

          } else {

            console.log(
              'No salary record found.'
            );

            this.initializeSalary();
          }

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading salary:',
            error
          );

          // Employee can still be edited
          // even if salary doesn't exist yet.
          this.initializeSalary();

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // ============================================================
  // INITIALIZE SALARY
  // ============================================================

  initializeSalary(): void {

    const now = new Date();

    this.salary = {
      employeeId:
        this.employeeId || 0,

      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0,

      salaryMonth:
        now.getMonth() + 1,

      salaryYear:
        now.getFullYear()
    };
  }

  // ============================================================
  // GROSS SALARY
  // ============================================================

  get grossSalary(): number {

    return (
      Number(this.salary.basicSalary || 0) +
      Number(this.salary.hra || 0) +
      Number(this.salary.allowances || 0)
    );
  }

  // ============================================================
  // NET SALARY
  // ============================================================

  get netSalary(): number {

    return Math.max(
      0,
      this.grossSalary -
      Number(this.salary.deductions || 0)
    );
  }

  // ============================================================
  // SAVE EMPLOYEE
  // ============================================================

  saveEmployee(): void {

    this.errorMessage = '';

    if (!this.validateForm()) {
      return;
    }

    this.loading = true;

    // Keep existing Employee.salary compatible
    // with current backend.
    this.employee.salary =
      this.grossSalary;

    console.log(
      'EMPLOYEE PAYLOAD:',
      this.employee
    );

    console.log(
      'SALARY STRUCTURE:',
      this.salary
    );

    if (
      this.isEditMode &&
      this.employeeId
    ) {

      this.updateExistingEmployee();

    } else {

      this.createNewEmployee();
    }
  }

  // ============================================================
  // CREATE EMPLOYEE
  // ============================================================

  private createNewEmployee(): void {

    this.employeeService
      .createEmployee(this.employee)
      .subscribe({

        next: (createdEmployee) => {

          console.log(
            'EMPLOYEE CREATED:',
            createdEmployee
          );

          const newEmployeeId =
            createdEmployee.id;

          if (
            !newEmployeeId
          ) {

            console.error(
              'Employee ID missing from response.'
            );

            this.errorMessage =
              'Employee was created, but employee ID was not returned.';

            this.loading = false;

            this.cdr.detectChanges();

            return;
          }

          this.createSalary(
            newEmployeeId
          );
        },

        error: (error) => {

          console.error(
            'Error creating employee:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create employee. Please try again.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // ============================================================
  // CREATE SALARY
  // ============================================================

  private createSalary(
    employeeId: number
  ): void {

    const salaryPayload: Salary = {

      employeeId: employeeId,

      basicSalary:
        Number(this.salary.basicSalary || 0),

      hra:
        Number(this.salary.hra || 0),

      allowances:
        Number(this.salary.allowances || 0),

      deductions:
        Number(this.salary.deductions || 0),

      salaryMonth:
        this.salary.salaryMonth,

      salaryYear:
        this.salary.salaryYear
    };

    console.log(
      'CREATING SALARY:',
      salaryPayload
    );

    this.salaryService
      .createSalary(salaryPayload)
      .subscribe({

        next: (createdSalary) => {

          console.log(
            'SALARY CREATED:',
            createdSalary
          );

          this.loading = false;

          this.router.navigate(
            ['/employees']
          );
        },

        error: (error) => {

          console.error(
            'Error creating salary:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Employee was created, but salary could not be saved.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // ============================================================
  // UPDATE EMPLOYEE
  // ============================================================

  private updateExistingEmployee(): void {

    if (!this.employeeId) {
      return;
    }

    this.employeeService
      .updateEmployee(
        this.employeeId,
        this.employee
      )
      .subscribe({

        next: () => {

          console.log(
            'EMPLOYEE UPDATED'
          );

          this.updateSalary();
        },

        error: (error) => {

          console.error(
            'Error updating employee:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to update employee. Please try again.';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });
  }

  // ============================================================
  // UPDATE SALARY
  // ============================================================

  private updateSalary(): void {

    if (!this.employeeId) {
      return;
    }

    const salaryPayload: Salary = {

      employeeId:
        this.employeeId,

      basicSalary:
        Number(this.salary.basicSalary || 0),

      hra:
        Number(this.salary.hra || 0),

      allowances:
        Number(this.salary.allowances || 0),

      deductions:
        Number(this.salary.deductions || 0),

      salaryMonth:
        this.salary.salaryMonth,

      salaryYear:
        this.salary.salaryYear
    };

    console.log(
      'UPDATING SALARY:',
      salaryPayload
    );

    // If salary already exists
    if (this.salaryId) {

      this.salaryService
        .updateSalary(
          this.salaryId,
          salaryPayload
        )
        .subscribe({

          next: () => {

            console.log(
              'SALARY UPDATED'
            );

            this.loading = false;

            this.router.navigate(
              ['/employees']
            );
          },

          error: (error) => {

            console.error(
              'Error updating salary:',
              error
            );

            this.errorMessage =
              'Employee updated, but salary could not be updated.';

            this.loading = false;

            this.cdr.detectChanges();
          }

        });

    } else {

      // No salary existed previously,
      // so create one.
      this.salaryService
        .createSalary(salaryPayload)
        .subscribe({

          next: () => {

            console.log(
              'SALARY CREATED DURING UPDATE'
            );

            this.loading = false;

            this.router.navigate(
              ['/employees']
            );
          },

          error: (error) => {

            console.error(
              'Error creating salary:',
              error
            );

            this.errorMessage =
              'Employee updated, but salary could not be saved.';

            this.loading = false;

            this.cdr.detectChanges();
          }

        });
    }
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  validateForm(): boolean {

    if (
      !this.employee.employeeCode ||
      !this.employee.employeeCode.trim()
    ) {

      this.errorMessage =
        'Employee code is required.';

      return false;
    }

    if (
      !this.employee.firstName ||
      !this.employee.firstName.trim()
    ) {

      this.errorMessage =
        'First name is required.';

      return false;
    }

    if (
      !this.employee.lastName ||
      !this.employee.lastName.trim()
    ) {

      this.errorMessage =
        'Last name is required.';

      return false;
    }

    if (
      !this.employee.email ||
      !this.employee.email.trim()
    ) {

      this.errorMessage =
        'Email is required.';

      return false;
    }

    if (
      !this.employee.department ||
      !this.employee.department.trim()
    ) {

      this.errorMessage =
        'Department is required.';

      return false;
    }

    if (
      !this.employee.designation ||
      !this.employee.designation.trim()
    ) {

      this.errorMessage =
        'Designation is required.';

      return false;
    }

    if (!this.employee.joiningDate) {

      this.errorMessage =
        'Joining date is required.';

      return false;
    }

    if (
      this.salary.basicSalary === null ||
      this.salary.basicSalary === undefined ||
      this.salary.basicSalary < 0
    ) {

      this.errorMessage =
        'Please enter a valid basic salary.';

      return false;
    }

    if (
      this.salary.hra === null ||
      this.salary.hra === undefined ||
      this.salary.hra < 0
    ) {

      this.errorMessage =
        'Please enter a valid HRA amount.';

      return false;
    }

    if (
      this.salary.allowances === null ||
      this.salary.allowances === undefined ||
      this.salary.allowances < 0
    ) {

      this.errorMessage =
        'Please enter a valid allowances amount.';

      return false;
    }

    if (
      this.salary.deductions === null ||
      this.salary.deductions === undefined ||
      this.salary.deductions < 0
    ) {

      this.errorMessage =
        'Please enter a valid deductions amount.';

      return false;
    }

    if (this.grossSalary <= 0) {

      this.errorMessage =
        'Gross salary must be greater than zero.';

      return false;
    }

    if (this.netSalary < 0) {

      this.errorMessage =
        'Deductions cannot exceed gross salary.';

      return false;
    }

    return true;
  }

  // ============================================================
  // CANCEL
  // ============================================================

  cancel(): void {

    this.router.navigate(
      ['/employees']
    );
  }
}