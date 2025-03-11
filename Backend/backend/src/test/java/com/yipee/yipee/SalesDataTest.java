package com.yipee.yipee.SalesData;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyRepository;
import com.yipee.yipee.Inventory.ItemBatch;
import com.yipee.yipee.Inventory.ItemBatchRepository;
import com.yipee.yipee.Inventory.ItemBatchService;
import com.yipee.yipee.SalesItem.SalesItem;
import com.yipee.yipee.SalesItem.SalesItemRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalesDataServiceImplTest {

    @Mock
    private CompanyRepository companyRepository;
    
    @Mock
    private SalesDataRepository salesDataRepository;
    
    @Mock
    private SalesItemRepository salesItemRepository;
    
    @Mock
    private ItemBatchRepository itemBatchRepository;
    
    @Mock
    private ItemBatchService itemBatchService;
    
    @InjectMocks
    private SalesDataServiceImpl salesDataService;
    
    private Company company;
    private SalesData salesData;
    private SalesItem salesItem;
    private ItemBatch itemBatch;

    @BeforeEach
    void setUp() {
        company = new Company();
        company.setId(1L);

        itemBatch = new ItemBatch();
        itemBatch.setId(100L);
        itemBatch.setQuantity(50);

        salesItem = new SalesItem();
        salesItem.setItemBatch(itemBatch);
        salesItem.setQuantitySold(10);

        salesData = new SalesData();
        salesData.setId(200L);
        salesData.setCompany(company);
        salesData.setSalesItems(List.of(salesItem));
    }

    @Test
    void testAddSalesDataByCompany() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(salesDataRepository.save(any(SalesData.class))).thenReturn(salesData);

        SalesData result = salesDataService.addSalesDataByCompany(salesData, 1L);

        assertNotNull(result);
        assertEquals(company, result.getCompany());
        verify(itemBatchService, times(1)).updateItemQuantity(itemBatch.getId(), salesItem.getQuantitySold(), false);
        verify(itemBatchRepository, times(1)).save(any(ItemBatch.class));
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
    }

    @Test
    void testUpdateSalesDataByCompany() {
        when(salesDataRepository.findById(200L)).thenReturn(Optional.of(salesData));
        when(salesDataRepository.save(any(SalesData.class))).thenReturn(salesData);

        SalesData updatedData = new SalesData();
        updatedData.setSalesItems(List.of(salesItem));

        SalesData result = salesDataService.updateSalesDataByCompany(200L, updatedData, 1L);

        assertNotNull(result);
        verify(salesItemRepository, times(1)).deleteAll(anyList());
        verify(itemBatchService, times(2)).updateItemQuantity(anyLong(), anyInt(), anyBoolean());
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
    }

    @Test
    void testFinalizeSalesData() {
        when(salesDataRepository.findById(200L)).thenReturn(Optional.of(salesData));
        when(salesDataRepository.save(any(SalesData.class))).thenReturn(salesData);

        SalesData result = salesDataService.finalizeSalesData(200L);

        assertNotNull(result);
        assertTrue(result.isEnded());
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
    }

    @Test
    void testDeleteSalesData() {
        when(salesDataRepository.findById(200L)).thenReturn(Optional.of(salesData));
        doNothing().when(salesDataRepository).deleteById(200L);

        salesDataService.deleteSalesData(200L);

        verify(itemBatchService, times(1)).updateItemQuantity(anyLong(), anyInt(), anyBoolean());
        verify(companyRepository, times(1)).save(any(Company.class));
        verify(salesDataRepository, times(1)).deleteById(200L);
    }
}
