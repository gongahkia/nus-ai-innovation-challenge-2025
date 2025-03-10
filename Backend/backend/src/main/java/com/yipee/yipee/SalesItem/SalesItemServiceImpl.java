package com.yipee.yipee.SalesItem;

import com.yipee.yipee.Inventory.ItemBatchService;
import com.yipee.yipee.SalesData.SalesDataRepository;
import com.yipee.yipee.SalesData.SalesData;

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
    private ItemBatchService itemBatchService;

    @Override
    public SalesItem addSalesItemToSalesData(SalesItem salesItem, Long salesDataId) {
        salesItem.setSalesDataId(salesDataId);
        salesItemsRepository.add(salesItem);
        return salesItem;
    }

    @Transactional
    @Override
    public SalesItem updateSalesItemQuantity(Long salesItemId, int newQuantity) {
        return salesItemRepository.findById(salesItemId).map(salesItem -> {
            // Check if the SalesData is finalized
            if (salesItem.getSalesData().isEnded()) {
                throw new IllegalStateException("Sales data is finalized and cannot be modified.");
            }

            int oldQuantity = salesItem.getQuantitySold();
            int quantityDifference = newQuantity - oldQuantity;

            // Adjust stock levels accordingly
            if (quantityDifference > 0) {
                itemBatchService.updateItemQuantity(salesItem.getItemBatch().getId(), quantityDifference, false);
            } else if (quantityDifference < 0) {
                itemBatchService.updateItemQuantity(salesItem.getItemBatch().getId(), Math.abs(quantityDifference), true);
            }

            // Update the SalesItem quantity
            salesItem.setQuantitySold(newQuantity);
            SalesItem updatedItem = salesItemRepository.save(salesItem);

            // Update SalesData totals
            SalesData salesData = salesItem.getSalesData();
            salesDataRepository.save(salesData);

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
            salesData.getItems().remove(salesItem);
            salesDataRepository.save(salesData);
            return salesItem;
        }).orElseThrow(() -> new IllegalArgumentException("Sales data not found"));
        salesItemRepository.deleteById(id);
    }

    @Override
    public SalesItem getSalesItemById(Long id) {
        return salesItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sales item not found"));
    }

    @Override
    public List<SalesItem> getSalesItemsBySalesDataId(Long salesDataId) {
        List<SalesItem> itemsForSalesData = new ArrayList<>();
        for (SalesItem item : salesItemsRepository.findAll()) {
            if (item.getSalesData.getId().equals(salesDataId)) {
                itemsForSalesData.add(item);
            }
        }
        return itemsForSalesData;
    }
}
