package com.yipee.yipee.Company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CompanyService companyService;

    @PostMapping
    public ResponseEntity<Company> addCompany(@RequestBody Company company) {
        // Save company data
        Company savedCompany = companyRepository.save(company);
        return ResponseEntity.ok(savedCompany);
    }

    @PutMapping("/path/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company updatedCompany) {
        // Retrieve the existing company
        Company existingCompany = companyRepository.findById(id).orElse(null);

        if (existingCompany == null) {
            return ResponseEntity.notFound().build(); // Company not found
        }

        // Update the existing company with the data from the request body
        existingCompany.setName(updatedCompany.getName()); // Example: update name
        existingCompany.setAddress(updatedCompany.getAddress()); // example: update address.
        // Update other fields as needed

        // Save the updated company
        Company savedCompany = companyRepository.save(existingCompany);

        // Return the updated company
        return ResponseEntity.ok(savedCompany);
    }

    @GetMapping("/{companyId}/export/sales-data")
    public ResponseEntity<String> exportSalesDataToCSV(@PathVariable Long companyId) {
        companyService.exportSalesDataToCSV(companyId);
        return ResponseEntity.ok("SalesData data exported to CSV.");
    }

    @GetMapping("/{companyId}/export/item-batch")
    public ResponseEntity<String> exportItemBatchToCSV(@PathVariable Long companyId) {
        companyService.exportItemBatchToCSV(companyId);
        return ResponseEntity.ok("SalesData data exported to CSV.");
    }

    @GetMapping("/export/all-sales-data")
    public ResponseEntity<String> exportAllSalesDataToCSV() {
        companyService.exportAllSalesDataToCSV();
        return ResponseEntity.ok("AllSalesData data exported to CSV.");
    }



}