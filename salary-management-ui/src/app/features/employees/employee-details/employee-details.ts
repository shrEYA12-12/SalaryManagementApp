import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { Employee } from '../../../models/employee.model';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetailsComponent implements OnInit {

  employee?: Employee;

  employeeId?: number;

  loading = false;

  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage = 'Employee ID is missing.';
      return;
    }

    this.employeeId = Number(id);

    this.loadEmployee(this.employeeId);
  }


  loadEmployee(id: number): void {

    this.loading = true;

    this.errorMessage = '';

    this.employeeService.getEmployee(id).subscribe({

      next: (data: Employee) => {

        this.employee = data;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Error loading employee details:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to load employee details.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });
  }


  editEmployee(): void {

    if (!this.employeeId) {
      return;
    }

    this.router.navigate([
      '/employees/edit',
      this.employeeId
    ]);
  }


  goBack(): void {

    this.router.navigate([
      '/employees'
    ]);
  }


  unlockSalary(): void {

    /*
     * Salary authorization will be implemented next.
     *
     * For now this method only shows the intended action.
     */

    alert(
      'Salary authorization will be implemented here.'
    );
  }

}