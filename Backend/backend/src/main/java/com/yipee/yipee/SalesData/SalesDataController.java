package com.yipee.yipee.SalesData;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/company/{companyId}/sales-data")
public class SalesDataController {

    @Autowired
    private SalesDataService salesDataService;

    @Autowired
    private CompanyService companyService; // To fetch company details

    @PostMapping("")
    public ResponseEntity<SalesData> addSalesData(@PathVariable Long companyId, @RequestBody SalesData salesData) {
        // Set the company before saving
        Company company = companyService.getCompanyById(companyId);
        salesData.setCompany(company);

        return ResponseEntity.ok(salesDataService.addSalesDataByCompany(salesData));
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

    @GetMapping("/batch/{itemBatchId}/time/{dateTime}")
    public ResponseEntity<List<SalesData>> getSalesDataByTimeAndCompany(@PathVariable Long companyId,
                                                                        @PathVariable Long itemBatchId,
                                                                        @PathVariable LocalDateTime dateTime) {
        return ResponseEntity.ok(salesDataService.getSalesDataByTimeAndCompany(itemBatchId, dateTime));
    }

    @GetMapping("/total")
    public ResponseEntity<Integer> getTotalSalesByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(salesDataService.getTotalSalesByCompany(companyId));
    }

    @GetMapping("/batch/{itemBatchId}/time/{dateTime}/total")
    public ResponseEntity<Integer> getTotalSalesByTimeAndCompany(@PathVariable Long companyId,
                                                                  @PathVariable Long itemBatchId,
                                                                  @PathVariable LocalDateTime dateTime) {
        return ResponseEntity.ok(salesDataService.getTotalSalesByTimeAndCompany(itemBatchId, dateTime));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<SalesData>> getSalesDataByDate(@PathVariable LocalDateTime date) {
        return ResponseEntity.ok(salesDataService.getSalesDataByDate(date));
    }
}
