package com.yipee.yipee.SalesData;

import com.yipee.yipee.Inventory.*;
import com.yipee.yipee.Company.*;
import com.yipee.yipee.SalesItem.*;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class SalesDataServiceImpl implements SalesDataService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private SalesDataRepository salesDataRepository;

    @Autowired
    private SalesItemRepository salesItemRepository;

    @Autowired
    private ItemBatchRepository itemBatchRepository;

    @Autowired
    private ItemBatchService itemBatchService; // Use the service to change stock after one transaction is made

    @Transactional
    @Override
    public SalesData addSalesDataByCompany(SalesData salesData, Long companyId) {
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new IllegalArgumentException("Company not found."));
        
        salesData.setCompany(company);

        salesData.setDateTime(LocalDateTime.now());

        for (SalesItem item : salesData.getSalesItems()) {
            ItemBatch batch = item.getItemBatch();

            // Deduct stock using the ItemBatchService method
            itemBatchService.updateItemQuantity(batch.getId(), item.getQuantitySold(), false);

            for(ItemBatch itemBatch : company.getItemBatches()) {
                if(itemBatch.getId().equals(batch.getId())) {
                    itemBatch.setQuantity(itemBatch.getQuantity() - item.getQuantitySold());
                    break;
                }
            }

            // Save the updated ItemBatch in the repository
            itemBatchRepository.save(batch);

            // Link SalesItem to SalesData
            item.setSalesData(salesData);
        }

        company.getSalesData().add(salesData);
        companyRepository.save(company);

        return salesDataRepository.save(salesData);
    }

    @Transactional
    @Override
    public SalesData updateSalesDataByCompany(Long salesDataId, SalesData updatedSalesData, Long companyId) {
        return salesDataRepository.findById(salesDataId).map(existingData -> {
            if (existingData.isEnded()) {
                throw new IllegalStateException("Sales data is finalized and cannot be modified.");
            }

            if (!existingData.getCompany().getId().equals(companyId)) {
                throw new IllegalArgumentException("Sales data does not belong to the given company.");
            }

            // Restore the stock before updating
            for (SalesItem item : existingData.getSalesItems()) {
                itemBatchService.updateItemQuantity(item.getItemBatch().getId(), item.getQuantitySold(), true);
                // Save the updated ItemBatch in the repository
                itemBatchRepository.save(item.getItemBatch());
            }

            // Remove old SalesItems and replace them
            existingData.setSalesItems(new ArrayList<>()); // Ensure the list is mutable
            salesItemRepository.deleteAll(existingData.getSalesItems());

            // Deduct stock again for new SalesItems
            for (SalesItem newItem : updatedSalesData.getSalesItems()) {
                itemBatchService.updateItemQuantity(newItem.getItemBatch().getId(), newItem.getQuantitySold(), false);
                // Save the updated ItemBatch in the repository
                itemBatchRepository.save(newItem.getItemBatch());
                newItem.setSalesData(existingData);
                existingData.getSalesItems().add(newItem);
            }

            existingData.setDateTime(updatedSalesData.getDateTime());

            // Update Company's sales data list
            Company company = existingData.getCompany();
            company.getSalesData().remove(existingData);
            company.getSalesData().add(existingData);

            // Save the updated company
            companyRepository.save(company);

            return salesDataRepository.save(existingData);
        }).orElseThrow(() -> new IllegalArgumentException("Sales data not found."));
    }

    @Override
    public SalesData finalizeSalesData(Long salesDataId) {
        SalesData salesData = salesDataRepository.findById(salesDataId)
            .orElseThrow(() -> new IllegalArgumentException("Sales data not found"));

        salesData.setEnded(true);

        // Update Company's sales data list
        Company company = salesData.getCompany();
        company.getSalesData().remove(salesData);
        company.getSalesData().add(salesData);

        // Save the updated company
        companyRepository.save(company);

        return salesDataRepository.save(salesData);
    }

    @Transactional
    @Override
    public void deleteSalesData(Long id) {
        salesDataRepository.findById(id).ifPresent(salesData -> {
            // Restore stock before deleting
            for (SalesItem item : salesData.getSalesItems()) {
                itemBatchService.updateItemQuantity(item.getItemBatch().getId(), item.getQuantitySold(), true);
                // Save the updated ItemBatch in the repository
                itemBatchRepository.save(item.getItemBatch());
            }

            // Remove SalesData from Company
            Company company = salesData.getCompany();
            company.getSalesData().remove(salesData);
            companyRepository.save(company);

            salesDataRepository.deleteById(id);
        });
    }

    @Override
    public List<SalesData> getSalesDataByCompany(Long companyId) {
        return salesDataRepository.findByCompanyId(companyId);
    }

    @Override
    public List<SalesData> getSalesDataByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime) {
        return salesDataRepository.findByItemBatchIdAndDateTime(itemBatchId, dateTime);
    }

    @Override
    public int getTotalSalesByCompany(Long companyId) {
        return salesDataRepository.getTotalSalesByCompany(companyId);
    }

    @Override
    public int getTotalSalesByTimeAndCompany(Long itemBatchId, LocalDateTime dateTime) {
        return salesDataRepository.getTotalSalesByTimeAndCompany(itemBatchId, dateTime);
    }

    @Override
    public List<SalesData> getSalesDataByDate(LocalDateTime date) {
        return salesDataRepository.findByDate(date);
    }
}
