package com.SalaryManagement.Application.Service;

import com.SalaryManagement.Application.dto.SalaryDTO;
import com.SalaryManagement.Application.entity.Employee;
import com.SalaryManagement.Application.entity.Salary;
import com.SalaryManagement.Application.repository.EmployeeRepository;
import com.SalaryManagement.Application.repository.SalaryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public SalaryService(
            SalaryRepository salaryRepository,
            EmployeeRepository employeeRepository) {

        this.salaryRepository = salaryRepository;
        this.employeeRepository = employeeRepository;
    }

    public Salary createSalary(SalaryDTO dto) {

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id: " + dto.getEmployeeId()
                        ));

        validateSalary(dto);

        if (salaryRepository.existsByEmployeeIdAndSalaryMonthAndSalaryYear(
                dto.getEmployeeId(),
                dto.getSalaryMonth(),
                dto.getSalaryYear())) {

            throw new RuntimeException(
                    "Salary already exists for this employee and month"
            );
        }

        double basicSalary = defaultValue(dto.getBasicSalary());
        double hra = defaultValue(dto.getHra());
        double allowances = defaultValue(dto.getAllowances());
        double deductions = defaultValue(dto.getDeductions());

        double grossSalary = basicSalary + hra + allowances;
        double netSalary = grossSalary - deductions;

        Salary salary = new Salary();

        salary.setEmployee(employee);
        salary.setBasicSalary(basicSalary);
        salary.setHra(hra);
        salary.setAllowances(allowances);
        salary.setDeductions(deductions);
        salary.setGrossSalary(grossSalary);
        salary.setNetSalary(netSalary);
        salary.setSalaryMonth(dto.getSalaryMonth());
        salary.setSalaryYear(dto.getSalaryYear());

        return salaryRepository.save(salary);
    }

    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    public Salary getSalaryById(Long id) {

        return salaryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Salary not found with id: " + id
                        ));
    }

    public List<Salary> getSalariesByEmployee(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException(
                    "Employee not found with id: " + employeeId
            );
        }

        return salaryRepository.findByEmployeeId(employeeId);
    }

    public Salary updateSalary(Long id, SalaryDTO dto) {

        Salary salary = getSalaryById(id);

        Employee employee = employeeRepository.findById(dto.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id: " + dto.getEmployeeId()
                        ));

        validateSalary(dto);

        double basicSalary = defaultValue(dto.getBasicSalary());
        double hra = defaultValue(dto.getHra());
        double allowances = defaultValue(dto.getAllowances());
        double deductions = defaultValue(dto.getDeductions());

        double grossSalary = basicSalary + hra + allowances;
        double netSalary = grossSalary - deductions;

        salary.setEmployee(employee);
        salary.setBasicSalary(basicSalary);
        salary.setHra(hra);
        salary.setAllowances(allowances);
        salary.setDeductions(deductions);
        salary.setGrossSalary(grossSalary);
        salary.setNetSalary(netSalary);
        salary.setSalaryMonth(dto.getSalaryMonth());
        salary.setSalaryYear(dto.getSalaryYear());

        return salaryRepository.save(salary);
    }

    public void deleteSalary(Long id) {

        Salary salary = getSalaryById(id);

        salaryRepository.delete(salary);
    }

    private double defaultValue(Double value) {
        return value == null ? 0.0 : value;
    }

    private void validateSalary(SalaryDTO dto) {

        if (dto.getEmployeeId() == null) {
            throw new RuntimeException("Employee ID is required");
        }

        if (dto.getBasicSalary() == null || dto.getBasicSalary() < 0) {
            throw new RuntimeException(
                    "Basic salary must be greater than or equal to 0"
            );
        }

        if (dto.getSalaryMonth() == null ||
                dto.getSalaryMonth() < 1 ||
                dto.getSalaryMonth() > 12) {

            throw new RuntimeException(
                    "Salary month must be between 1 and 12"
            );
        }

        if (dto.getSalaryYear() == null ||
                dto.getSalaryYear() < 2000) {

            throw new RuntimeException(
                    "Invalid salary year"
            );
        }
    }
}