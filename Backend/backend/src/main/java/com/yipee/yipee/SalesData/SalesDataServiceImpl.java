package com.yipee.yipee.SalesData;

import com.yipee.yipee.Inventory.ItemBatch;
import com.yipee.yipee.Inventory.ItemBatchService;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SalesDataServiceImpl implements SalesDataService {

    @Autowired
    private SalesDataRepository salesDataRepository;

    @Autowired
    private SalesDataItemRepository salesDataItemRepository;

    @Autowired
    private ItemBatchService itemBatchService; // Use the service to change stock after one transaction is made

    @Transactional
    @Override
    public SalesData addSalesDataByCompany(SalesData salesData, Long companyId) {
        salesData.setCompany(new Company(companyId));
        salesData.setDateTime(LocalDateTime.now());

        for (SalesDataItem item : salesData.getItems()) {
            ItemBatch batch = item.getItemBatch();

            // Deduct stock using the ItemBatchService method
            itemBatchService.updateItemQuantity(batch.getId(), item.getQuantitySold(), false);

            // Link SalesDataItem to SalesData
            item.setSalesData(salesData);
        }
        
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
            for (SalesDataItem item : existingData.getItems()) {
                itemBatchService.updateItemQuantity(item.getItemBatch().getId(), item.getQuantitySold(), true);
            }

            // Remove old SalesDataItems and replace them
            salesDataItemRepository.deleteAll(existingData.getItems());
            existingData.getItems().clear();

            // Deduct stock again for new SalesDataItems
            for (SalesDataItem newItem : updatedSalesData.getItems()) {
                itemBatchService.updateItemQuantity(newItem.getItemBatch().getId(), newItem.getQuantitySold(), false);
                newItem.setSalesData(existingData);
                existingData.getItems().add(newItem);
            }

            existingData.setDateTime(updatedSalesData.getDateTime());
            return salesDataRepository.save(existingData);
        }).orElseThrow(() -> new IllegalArgumentException("Sales data not found."));
    }

    //to end the transaction
    @Override
    public void finalizeSalesData(Long salesDataId) {
        SalesData salesData = salesDataRepository.findById(salesDataId)
            .orElseThrow(() -> new IllegalArgumentException("Sales data not found"));

        salesData.setEnded(true);
        salesDataRepository.save(salesData);
    }

    @Transactional
    @Override
    public void deleteSalesData(Long id) {
        salesDataRepository.findById(id).ifPresent(salesData -> {
            // Restore stock before deleting
            for (SalesDataItem item : salesData.getItems()) {
                itemBatchService.updateItemQuantity(item.getItemBatch().getId(), item.getQuantitySold(), true);
            }

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
