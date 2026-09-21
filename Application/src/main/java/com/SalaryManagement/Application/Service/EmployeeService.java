package com.SalaryManagement.Application.Service;

import com.SalaryManagement.Application.dto.EmployeeDTO;
import com.SalaryManagement.Application.entity.Employee;
import com.SalaryManagement.Application.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee createEmployee(EmployeeDTO dto) {

        if (employeeRepository.existsByEmployeeCode(dto.getEmployeeCode())) {
            throw new RuntimeException("Employee code already exists");
        }

        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Employee employee = new Employee();

        employee.setEmployeeCode(dto.getEmployeeCode());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setSalary(dto.getSalary());
        employee.setStatus(dto.getStatus());

        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found with id: " + id));
    }

    public Employee updateEmployee(Long id, EmployeeDTO dto) {

        Employee employee = getEmployeeById(id);

        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setDesignation(dto.getDesignation());
        employee.setJoiningDate(dto.getJoiningDate());
        employee.setSalary(dto.getSalary());
        employee.setStatus(dto.getStatus());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {

        Employee employee = getEmployeeById(id);

        employeeRepository.delete(employee);
    }
}