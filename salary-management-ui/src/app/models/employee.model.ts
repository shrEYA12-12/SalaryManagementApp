export interface Employee {
  id?: number;

  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;

  department: string;
  designation: string;

  joiningDate: string;

  // Kept for compatibility with existing Employee backend.
  // This will contain gross salary.
  salary: number;

  status: string;
}