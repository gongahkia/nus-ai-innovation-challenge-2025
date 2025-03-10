package com.yipee.yipee.SalesItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface SalesItemRepository extends JpaRepository<SalesItem, Long>{
    SalesItem findByItemBatchByItemBatchId(Long itemBatchId);
    List<SalesItem> findBySalesDataId(Long salesDataId);
    List<SalesItem> findBySalesDataIdAndItemBatchId(Long salesDataId, Long itemBatchId);
}