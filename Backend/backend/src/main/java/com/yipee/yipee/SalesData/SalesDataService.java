package com.yipee.yipee.SalesData;

import java.time.LocalDate;
import java.util.List;

public interface SalesDataService {

    SalesData addSalesDataByCompany(SalesData salesData, Long companyId);
    SalesData updateSalesDataByCompany(Long salesDataid, SalesData updatedSalesData, Long companyId);
    void deleteSalesData(Long id);
    List<SalesData> getSalesDataByCompany(Long companyId);

    // get the total revenue of company
    double getTotalSalesByCompany(Long companyId);

    // get the total revenue by company and date
    double getTotalSalesByDateAndCompany(Long companyId, LocalDate date);

    // get all the transactions by company and date
    List<SalesData> getSalesDataByDateandCompany(Long companyId, LocalDate date);

    // end the transaction
    SalesData finalizeSalesData(Long salesDataId);

    // find the top item found sold by company
    String getTopSalesItemByCompany(Long comapanyId);
}