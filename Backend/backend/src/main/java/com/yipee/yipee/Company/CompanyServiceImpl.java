package com.yipee.yipee.Company;

import org.springframework.stereotype.Service;

// import com.yipee.yipee.Inventory.ItemBatch;
// import com.yipee.yipee.Inventory.ItemBatchRepository;
// import com.yipee.yipee.SalesData.SalesData;
// import com.yipee.yipee.SalesData.SalesDataRepository;

@Service
public class CompanyServiceImpl implements CompanyService {

    // private ItemBatchRepository itemBatchRepository;
    // private SalesDataRepository salesDataRepository;
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
        if(id == null || updatedCompany == null) {
            throw new IllegalArgumentException("id and updatedCompany cannot be null");
        }
        Company company = companyRepository.findById(id).orElse(null);
        company.setName(updatedCompany.getName());
        company.setIndustry(updatedCompany.getIndustry());
        company.setAddress(updatedCompany.getAddress());
        return companyRepository.save(company);
    }

    
}