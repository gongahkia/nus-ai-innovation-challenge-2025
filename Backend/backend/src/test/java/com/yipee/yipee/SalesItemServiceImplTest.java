package com.yipee.yipee.test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.EmptyResultDataAccessException;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@ExtendWith(MockitoExtension.class)
class SalesItemServiceImplTest {

    @Mock
    private SalesItemRepository salesItemRepository;

    @Mock
    private SalesDataRepository salesDataRepository;

    @Mock
    private ItemBatchService itemBatchService;

    @InjectMocks
    private SalesItemServiceImpl salesItemService;

    private SalesItem salesItem;
    private SalesData salesData;
    private ItemBatch itemBatch;

    @BeforeEach
    void setUp() {
        salesData = new SalesData();
        salesData.setId(1L);
        salesData.setEnded(false);

        itemBatch = new ItemBatch();
        itemBatch.setId(1L);

        salesItem = new SalesItem();
        salesItem.setId(1L);
        salesItem.setSalesData(salesData);
        salesItem.setItemBatch(itemBatch);
        salesItem.setQuantitySold(5);
    }

    @Test
    void testAddSalesItemToSalesData() {
        SalesItem result = salesItemService.addSalesItemToSalesData(salesItem, 1L);
        assertEquals(1L, result.getSalesDataId());
    }

    @Test
    void testUpdateSalesItemQuantity() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));
        when(salesItemRepository.save(any(SalesItem.class))).thenReturn(salesItem);
        when(salesDataRepository.save(any(SalesData.class))).thenReturn(salesData);

        SalesItem updatedItem = salesItemService.updateSalesItemQuantity(1L, 10);

        assertEquals(10, updatedItem.getQuantitySold());
        verify(itemBatchService, times(1)).updateItemQuantity(anyLong(), eq(5), eq(false));
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
    }

    @Test
    void testUpdateSalesItemQuantity_SalesDataFinalized() {
        salesItem.getSalesData().setEnded(true);
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));

        Exception exception = assertThrows(IllegalStateException.class, () -> 
            salesItemService.updateSalesItemQuantity(1L, 10)
        );
        assertEquals("Sales data is finalized and cannot be modified.", exception.getMessage());
    }

    @Test
    void testUpdateSalesItemQuantity_NotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> 
            salesItemService.updateSalesItemQuantity(1L, 10)
        );
        assertEquals("Sales item not found", exception.getMessage());
    }

    @Test
    void testDeleteSalesItem() {
        doNothing().when(salesItemRepository).deleteById(1L);

        assertDoesNotThrow(() -> salesItemService.deleteSalesItem(1L));
        verify(salesItemRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteSalesItem_NotFound() {
        doThrow(new EmptyResultDataAccessException(1)).when(salesItemRepository).deleteById(1L);

        assertThrows(EmptyResultDataAccessException.class, () -> salesItemService.deleteSalesItem(1L));
    }

    @Test
    void testGetSalesItemById() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.of(salesItem));

        SalesItem result = salesItemService.getSalesItemById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    void testGetSalesItemById_NotFound() {
        when(salesItemRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> 
            salesItemService.getSalesItemById(1L)
        );
        assertEquals("Sales item not found", exception.getMessage());
    }

    @Test
    void testGetSalesItemsBySalesDataId() {
        List<SalesItem> mockSalesItems = new ArrayList<>();
        mockSalesItems.add(salesItem);

        SalesItemServiceImpl salesItemServiceSpy = spy(salesItemService);
        doReturn(mockSalesItems).when(salesItemServiceSpy).getSalesItemsBySalesDataId(1L);

        List<SalesItem> result = salesItemServiceSpy.getSalesItemsBySalesDataId(1L);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
    }
}