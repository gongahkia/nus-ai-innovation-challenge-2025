package com.yipee.yipee.SalesItem;

import jakarta.persistence.*;
import lombok.*;

import com.yipee.yipee.Inventory.ItemBatch;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private SalesData salesData;

    @ManyToOne
    private ItemBatch itemBatch;

    private int quantitySold;
}
