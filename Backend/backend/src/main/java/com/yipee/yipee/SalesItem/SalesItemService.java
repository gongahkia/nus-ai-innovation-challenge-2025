package com.yipee.yipee.SalesItem;

import java.util.List;

public interface SalesItemService {
    SalesItem addSalesItemToSalesData(SalesItem salesItem, Long salesDataId);
    SalesItem updateSalesItemQuantity(Long salesItemId, int quantitySold);
    void deleteSalesItemFromSalesData(Long id);
    SalesItem getSalesItemById(Long id);
    List<SalesItem> getSalesItemsBySalesDataId(Long salesDataId);
}
