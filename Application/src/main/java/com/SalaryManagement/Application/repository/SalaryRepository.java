package com.SalaryManagement.Application.repository;

import com.SalaryManagement.Application.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    List<Salary> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeIdAndSalaryMonthAndSalaryYear(
            Long employeeId,
            Integer salaryMonth,
            Integer salaryYear
    );

    Optional<Salary> findByEmployeeIdAndSalaryMonthAndSalaryYear(
            Long employeeId,
            Integer salaryMonth,
            Integer salaryYear
    );
}