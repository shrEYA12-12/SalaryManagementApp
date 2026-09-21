package com.SalaryManagement.Application.controllers;

import com.SalaryManagement.Application.Service.PayrollService;
import com.SalaryManagement.Application.dto.PayrollDTO;
import com.SalaryManagement.Application.entity.Payroll;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:4200")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Payroll> generatePayroll(
            @RequestBody PayrollDTO payrollDTO) {

        Payroll payroll =
                payrollService.generatePayroll(payrollDTO);

        return new ResponseEntity<>(
                payroll,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {

        return ResponseEntity.ok(
                payrollService.getAllPayrolls()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payroll> getPayrollById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                payrollService.getPayrollById(id)
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getPayrollByEmployee(employeeId)
        );
    }

    @GetMapping("/employee/{employeeId}/{month}/{year}")
    public ResponseEntity<Payroll> getEmployeePayrollForMonth(
            @PathVariable Long employeeId,
            @PathVariable Integer month,
            @PathVariable Integer year) {

        return ResponseEntity.ok(
                payrollService.getEmployeePayrollForMonth(
                        employeeId,
                        month,
                        year
                )
        );
    }
}