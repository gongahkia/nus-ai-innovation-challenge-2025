package com.yipee.yipee.SalesData;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SalesDataRepository extends JpaRepository<SalesData, Long> {

    // Find all sales data for a given company
    List<SalesData> findByCompanyId(Long companyId);

    // Find sales data for a company on a specific date and time
    List<SalesData> findByCompanyIdAndTransactionDate(Long companyId, LocalDateTime transactionDate);

    // Find sales data for a company within a date range
    List<SalesData> findByCompanyIdAndTransactionDateBetween(Long companyId, LocalDateTime start, LocalDateTime end);
}
