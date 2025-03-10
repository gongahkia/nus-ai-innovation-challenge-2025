package com.yipee.yipee.SalesItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/company/{companyId}/SalesData/{salesDataId}/SalesItems")
public class SalesItemController {

    @Autowired
    private SalesItemService salesItemService;

    // Add a SalesItem to a SalesData
    @PostMapping("/add")
    public ResponseEntity<SalesItem> addSalesItemToSalesData(@PathVariable Long companyId,
                                                              @PathVariable Long salesDataId,
                                                              @Valid @RequestBody SalesItem salesItem) {
        try {
            SalesItem addedSalesItem = salesItemService.addSalesItemToSalesData(salesItem, salesDataId);
            return new ResponseEntity<>(addedSalesItem, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Update the quantity of a SalesItem
    @PutMapping("/update-quantity/{salesItemId}")
    public ResponseEntity<SalesItem> updateSalesItemQuantity(@PathVariable Long companyId,
                                                              @PathVariable Long salesDataId,
                                                              @PathVariable Long salesItemId,
                                                              @RequestParam int newQuantity) {
        try {
            SalesItem updatedSalesItem = salesItemService.updateSalesItemQuantity(salesItemId, newQuantity);
            return new ResponseEntity<>(updatedSalesItem, HttpStatus.OK);
        } catch (IllegalStateException e) {
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN); // if the sales data is finalized
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Delete a SalesItem by ID
    @DeleteMapping("/delete/{salesItemId}")
    public ResponseEntity<Void> deleteSalesItem(@PathVariable Long companyId,
                                                @PathVariable Long salesDataId,
                                                @PathVariable Long salesItemId) {
        try {
            salesItemService.deleteSalesItem(salesItemId, salesDataId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No content as response
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Item not found
        }
    }

    // Get a SalesItem by ID
    @GetMapping("/{salesItemId}")
    public ResponseEntity<SalesItem> getSalesItemById(@PathVariable Long companyId,
                                                      @PathVariable Long salesDataId,
                                                      @PathVariable Long salesItemId) {
        try {
            SalesItem salesItem = salesItemService.getSalesItemById(salesItemId);
            return new ResponseEntity<>(salesItem, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Item not found
        }
    }

    // Get all SalesItems for a specific SalesData ID
    @GetMapping("")
    public ResponseEntity<List<SalesItem>> getSalesItemsBySalesDataId(@PathVariable Long companyId,
                                                                      @PathVariable Long salesDataId) {
        List<SalesItem> salesItems = salesItemService.getSalesItemsBySalesDataId(salesDataId);
        if (salesItems.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No content if no items found
        }
        return new ResponseEntity<>(salesItems, HttpStatus.OK);
    }
}
