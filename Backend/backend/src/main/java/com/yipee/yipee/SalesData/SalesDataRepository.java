package com.yipee.yipee.SalesData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesDataRepository extends JpaRepository<SalesData, Long> {
    List<SalesData> findByCompanyId(Long companyId);
    List<SalesData> findByItemBatchIdAndDateTime(Long itemBatchId, LocalDateTime dateTime);
    int getTotalSalesByCompany(Long companyId);
    int getTotalSalesByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime);
    List<SalesData> findByDate(LocalDateTime date);
}