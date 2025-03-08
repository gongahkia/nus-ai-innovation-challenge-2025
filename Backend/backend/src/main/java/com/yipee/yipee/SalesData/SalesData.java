package com.yipee.yipee.SalesData;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.time.LocalDate;

import com.yipee.yipee.Company.Company;

// transaction data
// contains the date and time of the transaction, the product name, the expiration date, 
// the quantity sold, and the company
@Entity
public class SalesData {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateTime;
    private String[] productName;
    private LocalDate[] expirationDate;
    private int[] quantitySold;
    @ManyToOne
    private Company company;
}