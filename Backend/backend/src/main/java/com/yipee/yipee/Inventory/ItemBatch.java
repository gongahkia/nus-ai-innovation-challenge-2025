package com.yipee.yipee.Inventory;

import java.time.LocalDate;

import com.yipee.yipee.Company.Company;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//stores the items by batch, their product type and expiration date
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ItemBatch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
    private LocalDate expirationDate;
    private int quantity;
    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
