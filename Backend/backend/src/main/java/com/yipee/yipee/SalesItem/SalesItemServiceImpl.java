package com.yipee.yipee.SalesItem;

import com.yipee.yipee.Inventory.*;
import com.yipee.yipee.SalesData.*;
import com.yipee.yipee.Company.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@Service
public class SalesItemServiceImpl implements SalesItemService {

    @Autowired
    private SalesItemRepository salesItemRepository;

    @Autowired
    private SalesDataRepository salesDataRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ItemBatchService itemBatchService;

    @Autowired
    private SalesDataService salesDataService;

    @Override
    public SalesItem addSalesItemToSalesData(SalesItem salesItem, Long salesDataId) {
        SalesData salesData = salesDataRepository.findById(salesDataId)
                .orElseThrow(() -> new IllegalArgumentException("Sales data not found."));
        salesItem.setSalesData(salesData);
        salesData.getSalesItems().add(salesItem);

        // save update the item Repository
        salesDataService.updateSalesDataByCompany(salesData.getId(), salesData, salesData.getCompany().getId());
        
        salesItemRepository.save(salesItem); // Use save to ensure entity persists
        return salesItem;
    }

    @Transactional
    @Override
    public SalesItem updateSalesItemQuantity(Long salesItemId, int quantitySold) {
        return salesItemRepository.findById(salesItemId).map(salesItem -> {
            // Check if the SalesData is finalized
            if (salesItem.getSalesData().isEnded()) {
                throw new IllegalStateException("Sales data is finalized and cannot be modified.");
            }

            int oldQuantity = salesItem.getQuantitySold();
            int quantityDifference = quantitySold - oldQuantity;

            // Adjust stock levels accordingly
            if (quantityDifference > 0) {
                itemBatchService.updateItemQuantity(salesItem.getItemBatch().getId(), quantityDifference, false);
            } else if (quantityDifference < 0) {
                itemBatchService.updateItemQuantity(salesItem.getItemBatch().getId(), Math.abs(quantityDifference), true);
            }

            // Update the SalesItem quantity
            salesItem.setQuantitySold(quantitySold);
            SalesItem updatedItem = salesItemRepository.save(salesItem);

            // Update SalesData
            SalesData salesData = salesItem.getSalesData();
            salesData.getSalesItems().remove(salesItem);
            salesData.getSalesItems().add(updatedItem);
            salesDataService.updateSalesDataByCompany(salesData.getId(), salesData, salesData.getCompany().getId());

            return updatedItem;
        }).orElseThrow(() -> new IllegalArgumentException("Sales item not found"));
    }

    @Override
    public void deleteSalesItem(Long salesItemId, Long salesDataId) {
        SalesItem salesItem = getSalesItemById(salesItemId);
        if (salesItem.getSalesData().isEnded()) {
            throw new IllegalStateException("Sales data is finalized and cannot be modified.");
        }
        salesDataRepository.findById(salesDataId).map(salesData -> {
            salesData.getSalesItems().remove(salesItem);
            salesDataService.updateSalesDataByCompany(salesDataId, salesData, salesData.getCompany().getId());
            return salesItem;
        }).orElseThrow(() -> new IllegalArgumentException("Sales data not found"));
        salesItemRepository.deleteById(salesItemId);
    }

    @Override
    public SalesItem getSalesItemById(Long salesItemId) {
        return salesItemRepository.findById(salesItemId)
                .orElseThrow(() -> new IllegalArgumentException("Sales item not found"));
    }

    @Override
    public List<SalesItem> getSalesItemsBySalesDataId(Long salesDataId) {
        return salesItemRepository.findBySalesDataId(salesDataId); // Use the repository method alr found in SalesItemRepository
    }
}
