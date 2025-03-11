package com.yipee.yipee.SalesItem;

import com.yipee.yipee.Inventory.ItemBatch;
import com.yipee.yipee.Inventory.ItemBatchService;
import com.yipee.yipee.SalesData.SalesData;
import com.yipee.yipee.SalesData.SalesDataRepository;
import com.yipee.yipee.SalesData.SalesDataService;
import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SalesItemServiceTest {

    @Mock
    private SalesItemRepository salesItemRepository;

    @Mock
    private SalesDataRepository salesDataRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private ItemBatchService itemBatchService;

    @Mock
    private SalesDataService salesDataService;

    @InjectMocks
    private SalesItemServiceImpl salesItemService;

    private SalesItem salesItem;
    private SalesData salesData;
    private Company company;
    private ItemBatch itemBatch;

    @BeforeEach
    void setUp() {
        company = Company.builder().id(1L).name("Test Company").build();
        salesData = SalesData.builder().id(1L).company(company).salesItems(new ArrayList<>()).ended(false).build();
        itemBatch = ItemBatch.builder().id(1L).quantity(100).build();
        salesItem = SalesItem.builder().id(1L).salesData(salesData).itemBatch(itemBatch).quantitySold(10).build();

        salesData.getSalesItems().add(salesItem);
    }

    @Test
    void addSalesItemToSalesData_Success() {
        when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));
        when(salesItemRepository.save(any(SalesItem.class))).thenReturn(salesItem);

        SalesItem result = salesItemService.addSalesItemToSalesData(salesItem, 1L);

        assertNotNull(result);
        assertEquals(salesItem, result);
        assertEquals(salesData, salesItem.getSalesData());
        verify(salesDataService, times(1)).updateSalesDataByCompany(1L, salesData, 1L);
        verify(salesItemRepository, times(1)).save(salesItem);
    }

    @Test
    void addSalesItemToSalesData_SalesDataNotFound() {
        when(salesDataRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesItemService.addSalesItemToSalesData(salesItem, 1L));
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
        verify(salesItemRepository, never()).save(any(SalesItem.class));
    }

    @Test
    void updateSalesItemQuantity_Success() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));
        when(salesItemRepository.save(any(SalesItem.class))).thenReturn(salesItem);

        SalesItem result = salesItemService.updateSalesItemQuantity(1L, 20);

        assertNotNull(result);
        assertEquals(20, result.getQuantitySold());
        verify(itemBatchService, times(1)).updateItemQuantity(1L, 10, false);
        verify(salesDataService, times(1)).updateSalesDataByCompany(1L, salesData, 1L);
    }

    @Test
    void updateSalesItemQuantity_SalesItemNotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesItemService.updateSalesItemQuantity(1L, 20));
        verify(itemBatchService, never()).updateItemQuantity(anyLong(), anyInt(), anyBoolean());
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
    }

    @Test
    void updateSalesItemQuantity_SalesDataFinalized() {
        salesData.setEnded(true);
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));

        assertThrows(IllegalStateException.class, () -> salesItemService.updateSalesItemQuantity(1L, 20));
        verify(itemBatchService, never()).updateItemQuantity(anyLong(), anyInt(), anyBoolean());
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
    }

    @Test
    void deleteSalesItem_Success() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));
        when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));

        salesItemService.deleteSalesItem(1L, 1L);

        verify(salesDataService, times(1)).updateSalesDataByCompany(1L, salesData, 1L);
        verify(salesItemRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteSalesItem_SalesItemNotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesItemService.deleteSalesItem(1L, 1L));
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
        verify(salesItemRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteSalesItem_SalesDataNotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));
        when(salesDataRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesItemService.deleteSalesItem(1L, 1L));
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
        verify(salesItemRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteSalesItem_SalesDataFinalized() {
        salesData.setEnded(true);
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));

        assertThrows(IllegalStateException.class, () -> salesItemService.deleteSalesItem(1L, 1L));
        verify(salesDataService, never()).updateSalesDataByCompany(anyLong(), any(SalesData.class), anyLong());
        verify(salesItemRepository, never()).deleteById(anyLong());
    }

    @Test
    void getSalesItemById_Success() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));

        SalesItem result = salesItemService.getSalesItemById(1L);

        assertNotNull(result);
        assertEquals(salesItem, result);
    }

    @Test
    void getSalesItemById_SalesItemNotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> salesItemService.getSalesItemById(1L));
    }

    @Test
    void getSalesItemsBySalesDataId_Success() {
        List<SalesItem> salesItems = new ArrayList<>();
        salesItems.add(salesItem);
        when(salesItemRepository.findBySalesDataId(1L)).thenReturn(salesItems);

        List<SalesItem> result = salesItemService.getSalesItemsBySalesDataId(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(salesItem, result.get(0));
    }
}