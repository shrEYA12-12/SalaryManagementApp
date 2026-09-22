export interface Payroll {
  id?: number;

  employeeId: number;

  salaryMonth: number;
  salaryYear: number;

  basicSalary: number;
  hra: number;
  allowances: number;

  grossSalary: number;

  deductions: number;
  netSalary: number;

  status: string;
  generatedAt: string;
}