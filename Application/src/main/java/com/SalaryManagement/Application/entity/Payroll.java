package com.SalaryManagement.Application.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payrolls",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "employee_id",
                                "salary_month",
                                "salary_year"
                        }
                )
        }
)
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer salaryMonth;

    @Column(nullable = false)
    private Integer salaryYear;

    @Column(nullable = false)
    private Double basicSalary;

    @Column(nullable = false)
    private Double hra;

    @Column(nullable = false)
    private Double allowances;

    @Column(nullable = false)
    private Double grossSalary;

    @Column(nullable = false)
    private Double deductions;

    @Column(nullable = false)
    private Double netSalary;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    public Payroll() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Integer getSalaryMonth() {
        return salaryMonth;
    }

    public void setSalaryMonth(Integer salaryMonth) {
        this.salaryMonth = salaryMonth;
    }

    public Integer getSalaryYear() {
        return salaryYear;
    }

    public void setSalaryYear(Integer salaryYear) {
        this.salaryYear = salaryYear;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public Double getHra() {
        return hra;
    }

    public void setHra(Double hra) {
        this.hra = hra;
    }

    public Double getAllowances() {
        return allowances;
    }

    public void setAllowances(Double allowances) {
        this.allowances = allowances;
    }

    public Double getGrossSalary() {
        return grossSalary;
    }

    public void setGrossSalary(Double grossSalary) {
        this.grossSalary = grossSalary;
    }

    public Double getDeductions() {
        return deductions;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(Double netSalary) {
        this.netSalary = netSalary;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}