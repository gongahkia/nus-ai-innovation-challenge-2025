package com.yippee.yipee.Company;
import com.yipee.yipee.Inventory.ItemBatch;
import com.yipee.yipee.SalesData.SalesData;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String industry;
    private String address;

    @OneToMany(mappedBy = "company")
    private ItemBatch itemBatches;

    @OneToMany(mappedBy = "company")
    private SalesData salesData;
}