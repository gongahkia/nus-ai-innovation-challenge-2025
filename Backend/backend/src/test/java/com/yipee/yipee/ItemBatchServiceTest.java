package com.yipee.yipee.Inventory;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.beans.Transient;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyRepository;

@ExtendWith(MockitoExtension.class)
class ItemBatchServiceTest {

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
        company = new Company();
        company.setId(1L);

        itemBatch = new ItemBatch();
        itemBatch.setId(1L);
        itemBatch.setName("Test Batch");
        itemBatch.setExpirationDate(LocalDate.now().plusDays(30));
        itemBatch.setQuantity(10);
        itemBatch.setCompany(company);
    }

    @Test
    void testAddItemBatchToCompany_NewBatch() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByNameAndExpirationDateAndCompanyId(itemBatch.getName(), itemBatch.getExpirationDate(), 1L)).thenReturn(Optional.empty());
        when(itemBatchRepository.save(itemBatch)).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.addItemBatchToCompany(itemBatch, 1L);
        
        assertNotNull(result);
        assertEquals(itemBatch.getName(), result.getName());
        verify(itemBatchRepository).save(itemBatch);
    }


    @Test
    void testAddItemBatchToCompany_CompanyNotFound() {
        when(companyRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                itemBatchService.addItemBatchToCompany(itemBatch, 1L));

        assertEquals("Company not found.", exception.getMessage());
    }

    @Test
    void testAddItemBatchToCompany_ExistingBatch() {
        ItemBatch existingBatch = new ItemBatch();
        existingBatch.setId(1L);
        existingBatch.setName("Test Batch");
        existingBatch.setExpirationDate(itemBatch.getExpirationDate());
        existingBatch.setQuantity(5);
        existingBatch.setCompany(company);

        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByNameAndExpirationDateAndCompanyId(itemBatch.getName(), itemBatch.getExpirationDate(), 1L)).thenReturn(Optional.of(existingBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(existingBatch);

        ItemBatch result = itemBatchService.addItemBatchToCompany(itemBatch, 1L);
        
        assertNotNull(result);
        assertEquals(15, result.getQuantity());
        verify(itemBatchRepository).save(existingBatch);
    }

    @Test
    void testUpdateItemBatchToCompany_Success() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByIdAndCompanyId(1L, 1L)).thenReturn(Optional.of(itemBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch updatedBatch = new ItemBatch();
        updatedBatch.setName("Updated Batch");
        updatedBatch.setQuantity(20);
        updatedBatch.setExpirationDate(LocalDate.now().plusDays(60));

        ItemBatch result = itemBatchService.updateItemBatchToCompany(1L, updatedBatch, 1L);

        assertNotNull(result);
        assertEquals("Updated Batch", result.getName());
        assertEquals(20, result.getQuantity());
        verify(itemBatchRepository).save(any(ItemBatch.class));
    }

    @Test
    void testDeleteItemBatchFromCompany_Success() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByIdAndCompanyId(1L, 1L)).thenReturn(Optional.of(itemBatch));

        itemBatchService.deleteItemBatchFromCompany(1L, 1L);

        verify(itemBatchRepository).deleteById(1L);
    }

    @Test
    void testGetItemBatchByIdFromCompany_Success() {
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(itemBatchRepository.findByIdAndCompanyId(1L, 1L)).thenReturn(Optional.of(itemBatch));

        ItemBatch result = itemBatchService.getItemBatchByidFromCompany(1L, 1L);

        assertNotNull(result);
        assertEquals(itemBatch.getName(), result.getName());
    }

    @Test
    void testUpdateItemQuantity_Addition() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.updateItemQuantity(1L, 5, true);

        assertEquals(15, result.getQuantity());
    }

    @Test
    void testUpdateItemQuantity_Subtraction() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));
        when(itemBatchRepository.save(any(ItemBatch.class))).thenReturn(itemBatch);

        ItemBatch result = itemBatchService.updateItemQuantity(1L, 5, false);

        assertEquals(5, result.getQuantity());
    }

    @Test
    void testUpdateItemQuantity_SubtractionFails() {
        when(itemBatchRepository.findById(1L)).thenReturn(Optional.of(itemBatch));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                itemBatchService.updateItemQuantity(1L, 15, false));

        assertEquals("Quantity cannot be negative.", exception.getMessage());
    }
}
