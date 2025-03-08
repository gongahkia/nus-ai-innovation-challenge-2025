package com.yipee.yipee.SalesData;

import com.yipee.yipee.Inventory.ItemBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SalesDataRepository extends JpaRepository<SalesData, Long>{
    
}