package com.yipee.yipee.SalesItem;

import java.util.List;

public interface SalesItemService {
    SalesItem addSalesItemToSalesData(SalesItem salesItem, Long salesDataId);
    SalesItem updateSalesItemQuantity(Long salesItemId, int quantitySold);
    void deleteSalesItem(Long salesItemId, Long salesDataId);
    SalesItem getSalesItemById(Long id);
    List<SalesItem> getSalesItemsBySalesDataId(Long salesDataId);
}
