package com.yipee.yipee.SalesData;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesDataService {

    SalesData addSalesDataByCompany(SalesData salesData);
    SalesData updateSalesDataByCompany(Long salesDataid, SalesData updatedSalesData, Long companyId);
    void deleteSalesData(Long id);
    SalesData[] getAllSalesData();
    List<SalesData> getSalesDataByCompany(Long companyId);
    List<SalesData> getSalesDataByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime);
    int getTotalSalesByCompany(Long companyId);
    int getTotalSalesByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime);
}