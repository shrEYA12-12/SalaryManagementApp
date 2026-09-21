package com.SalaryManagement.Application.Service;

import com.SalaryManagement.Application.dto.PayrollDTO;
import com.SalaryManagement.Application.entity.Employee;
import com.SalaryManagement.Application.entity.Payroll;
import com.SalaryManagement.Application.entity.Salary;
import com.SalaryManagement.Application.repository.EmployeeRepository;
import com.SalaryManagement.Application.repository.PayrollRepository;
import com.SalaryManagement.Application.repository.SalaryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    public PayrollService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository,
            SalaryRepository salaryRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
        this.salaryRepository = salaryRepository;
    }

    public Payroll generatePayroll(PayrollDTO dto) {

        validateRequest(dto);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id: "
                                        + dto.getEmployeeId()
                        ));

        boolean payrollExists =
                payrollRepository
                        .existsByEmployeeIdAndSalaryMonthAndSalaryYear(
                                dto.getEmployeeId(),
                                dto.getSalaryMonth(),
                                dto.getSalaryYear()
                        );

        if (payrollExists) {
            throw new RuntimeException(
                    "Payroll already generated for employee "
                            + dto.getEmployeeId()
                            + " for "
                            + dto.getSalaryMonth()
                            + "/"
                            + dto.getSalaryYear()
            );
        }

        Salary salary = salaryRepository
                .findByEmployeeIdAndSalaryMonthAndSalaryYear(
                        dto.getEmployeeId(),
                        dto.getSalaryMonth(),
                        dto.getSalaryYear()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Salary not found for employee "
                                        + dto.getEmployeeId()
                                        + " for "
                                        + dto.getSalaryMonth()
                                        + "/"
                                        + dto.getSalaryYear()
                        ));

        Payroll payroll = new Payroll();

        payroll.setEmployee(employee);

        payroll.setSalaryMonth(dto.getSalaryMonth());
        payroll.setSalaryYear(dto.getSalaryYear());

        payroll.setBasicSalary(salary.getBasicSalary());
        payroll.setHra(salary.getHra());
        payroll.setAllowances(salary.getAllowances());
        payroll.setGrossSalary(salary.getGrossSalary());
        payroll.setDeductions(salary.getDeductions());
        payroll.setNetSalary(salary.getNetSalary());

        payroll.setStatus("GENERATED");
        payroll.setGeneratedAt(LocalDateTime.now());

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getAllPayrolls() {

        return payrollRepository.findAll();
    }

    public Payroll getPayrollById(Long id) {

        return payrollRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payroll not found with id: " + id
                        ));
    }

    public List<Payroll> getPayrollByEmployee(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException(
                    "Employee not found with id: " + employeeId
            );
        }

        return payrollRepository.findByEmployeeId(employeeId);
    }

    public Payroll getEmployeePayrollForMonth(
            Long employeeId,
            Integer month,
            Integer year) {

        return payrollRepository
                .findByEmployeeIdAndSalaryMonthAndSalaryYear(
                        employeeId,
                        month,
                        year
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payroll not found"
                        ));
    }

    private void validateRequest(PayrollDTO dto) {

        if (dto.getEmployeeId() == null) {
            throw new RuntimeException(
                    "Employee ID is required"
            );
        }

        if (dto.getSalaryMonth() == null
                || dto.getSalaryMonth() < 1
                || dto.getSalaryMonth() > 12) {

            throw new RuntimeException(
                    "Salary month must be between 1 and 12"
            );
        }

        if (dto.getSalaryYear() == null
                || dto.getSalaryYear() < 2000) {

            throw new RuntimeException(
                    "Invalid salary year"
            );
        }
    }
}