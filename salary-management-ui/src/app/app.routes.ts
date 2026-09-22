import { Routes } from '@angular/router';

import { EmployeeListComponent } from './features/employees/employee-list/employee-list';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form';

import { SalaryList } from './features/salaries/salary-list/salary-list';
import { PayrollList } from './features/payroll/payroll-list/payroll-list';
import { EmployeeDetailsComponent } from './features/employees/employee-details/employee-details';

export const routes: Routes = [

  // Default
  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },

  // Employee routes
  {
    path: 'employees/add',
    component: EmployeeFormComponent
  },
{
  path: 'employees/view/:id',
  component: EmployeeDetailsComponent
},
  {
    path: 'employees/edit/:id',
    component: EmployeeFormComponent
  },

  {
    path: 'employees',
    component: EmployeeListComponent
  },

  // Salary routes
  {
    path: 'salaries',
    component: SalaryList
  },

  // Payroll routes
  {
    path: 'payroll',
    component: PayrollList
  },
  // Unknown route
  {
    path: '**',
    redirectTo: 'employees'
  }

];