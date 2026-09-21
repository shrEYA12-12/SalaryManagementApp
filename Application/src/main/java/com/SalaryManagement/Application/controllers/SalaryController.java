package com.SalaryManagement.Application.controllers;

import com.SalaryManagement.Application.Service.SalaryService;
import com.SalaryManagement.Application.dto.SalaryDTO;
import com.SalaryManagement.Application.entity.Salary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "http://localhost:4200")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @PostMapping
    public ResponseEntity<Salary> createSalary(
            @RequestBody SalaryDTO salaryDTO) {

        Salary salary = salaryService.createSalary(salaryDTO);

        return new ResponseEntity<>(salary, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Salary>> getAllSalaries() {

        return ResponseEntity.ok(
                salaryService.getAllSalaries()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salary> getSalaryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                salaryService.getSalaryById(id)
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Salary>> getSalariesByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                salaryService.getSalariesByEmployee(employeeId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salary> updateSalary(
            @PathVariable Long id,
            @RequestBody SalaryDTO salaryDTO) {

        return ResponseEntity.ok(
                salaryService.updateSalary(id, salaryDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalary(
            @PathVariable Long id) {

        salaryService.deleteSalary(id);

        return ResponseEntity.noContent().build();
    }
}