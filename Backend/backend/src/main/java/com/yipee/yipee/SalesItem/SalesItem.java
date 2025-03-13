package com.yipee.yipee.SalesItem;

import jakarta.persistence.*;
import lombok.*;
import com.yipee.yipee.Inventory.ItemBatch;
import com.yipee.yipee.SalesData.SalesData;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sales_data_id", nullable = false)
    private SalesData salesData;

    @ManyToOne
    @JoinColumn(name = "item_batch_id", nullable = false)
    private ItemBatch itemBatch;

    private int quantitySold;
}
