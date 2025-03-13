package com.yipee.yipee.SalesData;

import com.yipee.yipee.Company.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/company/{companyId}/sales-data")
public class SalesDataController {

    @Autowired
    private SalesDataService salesDataService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyRepository companyRepository;

    @PostMapping("/new")
    public ResponseEntity<SalesData> addSalesData(@PathVariable Long companyId, @RequestBody SalesData salesData) {
        // Set the company before saving
        Company company = companyService.getCompanyById(companyId);
        salesData.setCompany(company);

        return ResponseEntity.ok(salesDataService.addSalesDataByCompany(salesData, companyId));
    }

    @PutMapping("/{salesDataId}")
    public ResponseEntity<SalesData> updateSalesData(@PathVariable Long companyId,
                                                     @PathVariable Long salesDataId,
                                                     @RequestBody SalesData updatedSalesData) {
        return ResponseEntity.ok(salesDataService.updateSalesDataByCompany(salesDataId, updatedSalesData, companyId));
    }

    @DeleteMapping("/{salesDataId}")
    public ResponseEntity<Void> deleteSalesData(@PathVariable Long companyId, @PathVariable Long salesDataId) {
        salesDataService.deleteSalesData(salesDataId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("")
    public ResponseEntity<List<SalesData>> getSalesDataByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(salesDataService.getSalesDataByCompany(companyId));
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<SalesData>> getSalesDataByDateAndCompany(
            @PathVariable Long companyId, 
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<SalesData> salesDataList = salesDataService.getSalesDataByDateandCompany(companyId, localDate);
        return ResponseEntity.ok(salesDataList);
    }

    @GetMapping("/total-sales")
    public ResponseEntity<Double> getTotalSalesByCompany(@PathVariable Long companyId) {
        double totalSales = salesDataService.getTotalSalesByCompany(companyId);
        return ResponseEntity.ok(totalSales);
    }

    @GetMapping("/total-sales/date/{date}")
    public ResponseEntity<Double> getTotalSalesByDateAndCompany(
            @PathVariable Long companyId, 
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        double totalSales = salesDataService.getTotalSalesByDateAndCompany(companyId, localDate);
        return ResponseEntity.ok(totalSales);
    }

    @PutMapping("/{salesDataId}/finalised")
    public ResponseEntity<SalesData> finalizeSalesData(@PathVariable Long salesDataId) {
        SalesData finalizedSalesData = salesDataService.finalizeSalesData(salesDataId);
        return ResponseEntity.ok(finalizedSalesData);
    }

    @GetMapping("/top-item")
    public ResponseEntity<String> getTopSalesItemByCompany(@PathVariable Long companyId) {
        String topItem = salesDataService.getTopSalesItemByCompany(companyId);
        return ResponseEntity.ok(topItem);
    }

}
