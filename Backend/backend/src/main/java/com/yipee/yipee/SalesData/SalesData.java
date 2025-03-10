package com.yipee.yipee.SalesData;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.SalesItem.SalesItem;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private LocalDateTime dateTime;
    private double amount;

    @OneToMany(mappedBy = "salesData", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalesItem> salesItems;

    @Column(nullable = false)
    @Builder.Default
    private boolean ended = false;  // whether the sales data has ended
}
