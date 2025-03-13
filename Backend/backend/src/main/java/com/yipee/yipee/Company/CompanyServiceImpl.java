package com.yipee.yipee.Company;

import com.yipee.yipee.Export.*;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;


    @Override
    public Company addCompany(Company company) {
        if (company == null) {
            throw new IllegalArgumentException("company cannot be null");
        }
        return companyRepository.save(company);
    }

    @Override
    public Company updateCompany(Long id, Company updatedCompany) {
        if (id == null || updatedCompany == null) {
            throw new IllegalArgumentException("id and updatedCompany cannot be null");
        }
        Company company = companyRepository.findById(id).orElse(null);
        company.setName(updatedCompany.getName());
        company.setIndustry(updatedCompany.getIndustry());
        company.setAddress(updatedCompany.getAddress());
        return companyRepository.save(company);
    }

    @Override
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
    }

    @Override
    public void exportSalesDataToCSV(Long companyId) {
        DatabaseToCSVExporter.exportSalesDataToCSV(companyId);
    }

    @Override
    public void exportAllSalesDataToCSV() {
        DatabaseToCSVExporter.exportAllSalesDataToCSV();
    }

    @Override
    public int getNumberOfTransactions(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        
        return company.getSalesData().size();
    }


}