export interface Salary {
  id?: number;

  employeeId: number;

  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;

  salaryMonth: number;
  salaryYear: number;

  // Calculated salary values
  grossSalary?: number;
  netSalary?: number;
}