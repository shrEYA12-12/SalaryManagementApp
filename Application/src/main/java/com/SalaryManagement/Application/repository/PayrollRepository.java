package com.SalaryManagement.Application.repository;

import com.SalaryManagement.Application.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    boolean existsByEmployeeIdAndSalaryMonthAndSalaryYear(
            Long employeeId,
            Integer salaryMonth,
            Integer salaryYear
    );

    Optional<Payroll> findByEmployeeIdAndSalaryMonthAndSalaryYear(
            Long employeeId,
            Integer salaryMonth,
            Integer salaryYear
    );

    List<Payroll> findByEmployeeId(Long employeeId);
}