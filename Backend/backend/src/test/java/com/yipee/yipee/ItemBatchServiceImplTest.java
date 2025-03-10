package com.yipee.yipee.Test;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemBatchServiceImplTest {

    @Mock
    private ItemBatchRepository itemBatchRepository;
    
    @Mock
    private CompanyRepository companyRepository;
    
    @InjectMocks
    private ItemBatchServiceImpl itemBatchService;

    private Company company;
    private ItemBatch itemBatch;

    @BeforeEach
    void setUp() {
        company = new Company(1L);
        itemBatch = new ItemBatch();
        itemBatch.setId(1L);
        itemBatch.setName("Sample Item");
        itemBatch.setExpirationDate(LocalDate.of(2025, 12, 31));
        itemBatch.setQuantity(10);
        itemBatch.setCompany(company);
    }

    @Test
    void testAddItemBatchToCompany_NewBatch() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByNameAndExpirationDateAndCompanyId(
                itemBatch.getName(), itemBatch.getExpirationDate(), 1L)).thenReturn(Optional.empty());
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.addItemBatchToCompany(itemBatch, 1L);
        
        assertNotNull(result);
        assertEquals(itemBatch.getName(), result.getName());
        verify(itemBatchRepository, times(1)).save(any(ItemBatch.class));
    }

    @Test
    void testAddItemBatchToCompany_ExistingBatch() {
        ItemBatch existingBatch = new ItemBatch();
        existingBatch.setId(1L);
        existingBatch.setName("Sample Item");
        existingBatch.setExpirationDate(LocalDate.of(2025, 12, 31));
        existingBatch.setQuantity(5);
        existingBatch.setCompany(company);

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByNameAndExpirationDateAndCompanyId(
                itemBatch.getName(), itemBatch.getExpirationDate(), 1L)).thenReturn(Optional.of(existingBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(existingBatch);

        ItemBatch result = itemBatchService.addItemBatchToCompany(itemBatch, 1L);
        
        assertNotNull(result);
        assertEquals(15, result.getQuantity());
        verify(itemBatchRepository, times(1)).save(existingBatch);
    }

    @Test
    void testUpdateItemQuantity_Addition() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.updateItemQuantity(1L, 5, true);

        assertNotNull(result);
        assertEquals(15, result.getQuantity());
        verify(itemBatchRepository, times(1)).save(itemBatch);
    }

    @Test
    void testUpdateItemQuantity_Subtraction() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.updateItemQuantity(1L, 5, false);

        assertNotNull(result);
        assertEquals(5, result.getQuantity());
        verify(itemBatchRepository, times(1)).save(itemBatch);
    }

    @Test
    void testUpdateItemQuantity_QuantityCannotBeNegative() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));
        
        Exception exception = assertThrows(IllegalArgumentException.class, () ->
                itemBatchService.updateItemQuantity(1L, 15, false));
        
        assertEquals("Quantity cannot be negative.", exception.getMessage());
    }
}
