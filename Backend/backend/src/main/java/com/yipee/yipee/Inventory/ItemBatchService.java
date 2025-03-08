package com.yipee.yipee.Inventory;

import java.util.List;
import java.time.LocalDate;

public interface ItemBatchService {
    ItemBatch addItemBatchToCompany(ItemBatch itemBatch, Long companyId);
    ItemBatch updateItemBatchToComapny(Long id, ItemBatch updatedItemBatch, Long companyId);
    void deleteItemBatchFromCompany(Long itemBatchId, Long companyId);
    ItemBatch getItemBatchByidFromCompany(Long itemBatchId, Long companyId);
    ItemBatch updateItemQuantity(Long id, int quantity, boolean isAddition);

    List<ItemBatch> getItemBatchesByCompanyId(Long companyId);
    List<ItemBatch> getItemBatchesByExpirationDateAndCompanyId(LocalDate expirationDate, Long companyId);
    List<ItemBatch> getItemBatchesByNameAndCompanyId(String name, Long companyId);
    ItemBatch getItemBatchesByNameAndExpirationDateAndCompanyId(String name, LocalDate expirationDate, Long companyId);
}