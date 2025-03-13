package com.yipee.yipee.Company;

public interface CompanyService {
    Company addCompany(Company company);
    Company updateCompany(Long id, Company updatedCompany);
    Company getCompanyById(Long id);
    void exportSalesDataToCSV(Long companyId);
    void exportAllSalesDataToCSV();
    int getNumberOfTransactions(Long companyId);
}