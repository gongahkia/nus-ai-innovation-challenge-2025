package com.yipee.yipee.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.yipee.yipee.SalesData.*;
import com.yipee.yipee.Inventory.*;
import com.yipee.yipee.Company.*;
import com.yipee.yipee.SalesItem.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class SalesDataServiceImplTest {

    @Mock
    private SalesDataRepository salesDataRepository;

    @Mock
    private SalesItemRepository salesItemRepository;

    @Mock
    private ItemBatchService itemBatchService;

    @InjectMocks
    private SalesDataServiceImpl salesDataService;

    private SalesData salesData;
    private SalesItem salesItem;

    @BeforeEach
    void setUp() {
        salesData = new SalesData();
        salesData.setId(1L);
        salesData.setDateTime(LocalDateTime.now());
        salesData.setEnded(false);
    }

    @Test
    void testAddSalesDataByCompany() {
        when(salesDataRepository.save(any(SalesData.class))).thenReturn(salesData);
        SalesData result = salesDataService.addSalesDataByCompany(salesData, 1L);
        assertNotNull(result);
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
    }

    // @Test
    // void testUpdateSalesDataByCompany_Success() {
    //     SalesData updatedData = new SalesData();
    //     updatedData.setItems(Arrays.asList(new SalesItem()));
    //     when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));
    //     when(salesDataRepository.save(any(SalesData.class))).thenReturn(updatedData);

    //     SalesData result = salesDataService.updateSalesDataByCompany(1L, updatedData, 1L);
    //     assertNotNull(result);
    //     verify(salesDataRepository, times(1)).save(any(SalesData.class));
    // }

    @Test
    void testUpdateSalesDataByCompany_ThrowsExceptionWhenFinalized() {
        salesData.setEnded(true);
        when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));

        assertThrows(IllegalStateException.class, () -> 
            salesDataService.updateSalesDataByCompany(1L, new SalesData(), 1L));
    }

    @Test
    void testFinalizeSalesData() {
        when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));
        salesDataService.finalizeSalesData(1L);
        verify(salesDataRepository, times(1)).save(any(SalesData.class));
        assertTrue(salesData.isEnded());
    }

    @Test
    void testDeleteSalesData() {
        when(salesDataRepository.findById(1L)).thenReturn(Optional.of(salesData));
        salesDataService.deleteSalesData(1L);
        verify(salesDataRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetSalesDataByCompany() {
        when(salesDataRepository.findByCompanyId(1L)).thenReturn(Arrays.asList(salesData));
        List<SalesData> result = salesDataService.getSalesDataByCompany(1L);
        assertFalse(result.isEmpty());
    }
}
