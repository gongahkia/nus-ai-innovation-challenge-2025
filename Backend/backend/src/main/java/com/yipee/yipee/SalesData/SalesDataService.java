package com.yipee.yipee.SalesData;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesDataService {

    SalesData addSalesDataByCompany(SalesData salesData);
    SalesData updateSalesDataByCompany(Long salesDataid, SalesData updatedSalesData, Long companyId);
    void deleteSalesData(Long id);
    List<SalesData> getSalesDataByCompany(Long companyId);
    List<SalesData> getSalesDataByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime);
    int getTotalSalesByCompany(Long companyId);
    int getTotalSalesByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime);
    List<SalesData> getSalesDataByDate(LocalDateTime date);
    void finalizeSalesData(Long salesDataId);
}