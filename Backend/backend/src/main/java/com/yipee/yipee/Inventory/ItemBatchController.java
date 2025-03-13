package com.yipee.yipee.Inventory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/Company/{companyId}/item-batches")
public class ItemBatchController {

    @Autowired
    private ItemBatchService itemBatchService;

    @GetMapping
    public ResponseEntity<List<ItemBatch>> getAllItemBatches(@PathVariable Long companyId) {
        try {
            List<ItemBatch> itemBatches = itemBatchService.getItemBatchesByCompanyId(companyId);
            return ResponseEntity.ok(itemBatches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemBatch> getItemBatchById(@PathVariable Long companyId, @PathVariable Long id) {
        try {
            ItemBatch itemBatch = itemBatchService.getItemBatchByidFromCompany(id, companyId);
            return ResponseEntity.ok(itemBatch);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<List<ItemBatch>> getItemBatchByName(@PathVariable Long companyId, @PathVariable String name) {
        try {
            List<ItemBatch> itemBatches = itemBatchService.getItemBatchesByNameAndCompanyId(name, companyId);
            return ResponseEntity.ok(itemBatches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/expiration/{expirationDate}")
    public ResponseEntity<List<ItemBatch>> getItemBatchByExpirationDate(@PathVariable Long companyId, @PathVariable String expirationDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate localDate = LocalDate.parse(expirationDate, formatter);
            List<ItemBatch> itemBatches = itemBatchService.getItemBatchesByExpirationDateAndCompanyId(localDate, companyId);
            return ResponseEntity.ok(itemBatches);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}/expiration/{expirationDate}")
    public ResponseEntity<ItemBatch> getItemBatchByNameAndExpirationDate(@PathVariable Long companyId, @PathVariable String name, @PathVariable String expirationDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate localDate = LocalDate.parse(expirationDate, formatter);
            ItemBatch itemBatch = itemBatchService.getItemBatchesByNameAndExpirationDateAndCompanyId(name, localDate, companyId);
            return ResponseEntity.ok(itemBatch);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ItemBatch> createItemBatch(@PathVariable Long companyId, @RequestBody ItemBatch itemBatch) {
        try {
            ItemBatch savedItemBatch = itemBatchService.addItemBatchToCompany(itemBatch, companyId);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItemBatch);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemBatch> updateItemBatch(@PathVariable Long companyId, @PathVariable Long id, @RequestBody ItemBatch updatedItemBatch) {
        try {
            ItemBatch savedItemBatch = itemBatchService.updateItemBatchToCompany(id, updatedItemBatch, companyId);
            return ResponseEntity.ok(savedItemBatch);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<ItemBatch> updateItemBatchQuantity(
            @PathVariable Long companyId,
            @PathVariable Long id,
            @RequestBody QuantityUpdateRequest quantityUpdateRequest) {
        try {
            ItemBatch updatedBatch = itemBatchService.updateItemQuantity(id, quantityUpdateRequest.getQuantity(), true);
            return ResponseEntity.ok(updatedBatch);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemBatch(@PathVariable Long companyId, @PathVariable Long id) {
        try {
            itemBatchService.deleteItemBatchFromCompany(id, companyId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    static class QuantityUpdateRequest {
        private int quantity;

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}