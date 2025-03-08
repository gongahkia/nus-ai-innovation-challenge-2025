package com.yipee.yipee.Inventory;

import com.yipee.yipee.Company.Company;
import com.yipee.yipee.Company.CompanyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemBatchServiceImpl implements ItemBatchService {

    @Autowired
    private ItemBatchRepository itemBatchRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public ItemBatch addItemBatchToCompany(ItemBatch itemBatch, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }

        Optional<ItemBatch> existingBatchOptional = itemBatchRepository.findByNameAndExpirationDateAndCompanyId(
                itemBatch.getName(), itemBatch.getExpirationDate(), companyId);

        if (existingBatchOptional.isPresent()) {
            // Found existing batch, add quantities
            ItemBatch existingBatch = existingBatchOptional.get();
            existingBatch.setQuantity(existingBatch.getQuantity() + itemBatch.getQuantity());
            return itemBatchRepository.save(existingBatch);
        } else {
            // No existing batch, create new one
            Company company = companyOptional.get();
            itemBatch.setCompany(company);
            return itemBatchRepository.save(itemBatch);
        }
    }

    @Override
    public ItemBatch updateItemBatchToComapny(Long id, ItemBatch updatedItemBatch, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }

        Company company = companyOptional.get();

        Optional<ItemBatch> itemBatchOptional = itemBatchRepository.findByIdAndCompanyId(id, companyId);
        if (itemBatchOptional.isEmpty()) {
            throw new IllegalArgumentException("Item batch not found for this company.");
        }

        ItemBatch existingItemBatch = itemBatchOptional.get();

        existingItemBatch.setName(updatedItemBatch.getName());
        existingItemBatch.setPrice(updatedItemBatch.getPrice());
        existingItemBatch.setExpirationDate(updatedItemBatch.getExpirationDate());
        existingItemBatch.setQuantity(updatedItemBatch.getQuantity());

        return itemBatchRepository.save(existingItemBatch);
    }

    @Override
    public void deleteItemBatchFromCompany(Long itemBatchId, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }

        Company company = companyOptional.get();

        Optional<ItemBatch> itemBatchOptional = itemBatchRepository.findByIdAndCompanyId(itemBatchId, companyId);
        if (itemBatchOptional.isEmpty()) {
            throw new IllegalArgumentException("Item batch not found for this company.");
        }

        itemBatchRepository.deleteById(itemBatchId);
    }

    @Override
    public ItemBatch getItemBatchByidFromCompany(Long itemBatchId, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }

        Optional<ItemBatch> itemBatchOptional = itemBatchRepository.findByIdAndCompanyId(itemBatchId, companyId);
        if (itemBatchOptional.isEmpty()) {
            throw new IllegalArgumentException("Item batch not found for this company.");
        }

        return itemBatchOptional.get();
    }

    @Override
    public ItemBatch updateItemQuantity(Long id, int quantity, boolean isAddition) {
        Optional<ItemBatch> itemBatchOptional = itemBatchRepository.findById(id);
        if (itemBatchOptional.isEmpty()) {
            throw new IllegalArgumentException("Item batch not found.");
        }

        ItemBatch itemBatch = itemBatchOptional.get();
        if (isAddition) {
            itemBatch.setQuantity(itemBatch.getQuantity() + quantity);
        } else {
            int newQuantity = itemBatch.getQuantity() - quantity;
            if (newQuantity < 0) {
                throw new IllegalArgumentException("Quantity cannot be negative.");
            }
            itemBatch.setQuantity(newQuantity);
        }
        return itemBatchRepository.save(itemBatch);
    }

    @Override
    public List<ItemBatch> getItemBatchesByCompanyId(Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }
        return itemBatchRepository.findByCompanyId(companyId);
    }

    @Override
    public List<ItemBatch> getItemBatchesByExpirationDateAndCompanyId(LocalDate expirationDate, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }
        return itemBatchRepository.findByExpirationDateAndCompanyId(expirationDate, companyId);
    }

    @Override
    public List<ItemBatch> getItemBatchesByNameAndCompanyId(String name, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }
        return itemBatchRepository.findAll().stream()
                .filter(itemBatch -> itemBatch.getCompany().equals(companyOptional.get()) && itemBatch.getName().equals(name))
                .collect(Collectors.toList());
    }

    @Override
    public ItemBatch getItemBatchesByNameAndExpirationDateAndCompanyId(String name, LocalDate expirationDate, Long companyId) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);
        if (companyOptional.isEmpty()) {
            throw new IllegalArgumentException("Company not found.");
        }
        return itemBatchRepository.findByNameAndExpirationDateAndCompanyId(name, expirationDate, companyId).get();
    }
}