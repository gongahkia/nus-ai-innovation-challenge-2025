package com.yipee.yipee.SalesData;

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

    private Long companyId;
    private LocalDateTime dateTime;
    private double amount;

    @OneToMany(mappedBy = "salesData")
    private List<SalesItem> salesItems;

    @Column(nullable = false)
    @Builder.Default
    private boolean ended = false;  // whether the sales data has ended
}
