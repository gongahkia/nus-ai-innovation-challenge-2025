package com.yipee.yipee.SalesItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

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
        salesItemsDatabase.add(salesItem);
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
    public void deleteSalesItem(Long id) {
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
        for (SalesItem item : salesItemsDatabase) {
            if (item.getSalesDataId().equals(salesDataId)) {
                itemsForSalesData.add(item);
            }
        }
        return itemsForSalesData;
    }

}
