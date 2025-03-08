package com.yipee.yipee.Inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yipee.yipee.Company.Company;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Repository
public interface ItemBatchRepository extends JpaRepository<ItemBatch, Long> {

    List<ItemBatch> findByNameAndCompanyId(String name, Long companyId);

    List<ItemBatch> findByCompanyId(Long companyId);

    List<ItemBatch> findByExpirationDateAndCompanyId(LocalDate expirationDate, Long companyId);

    Optional<ItemBatch> findByNameAndExpirationDateAndCompanyId(String name, LocalDate expirationDate, Long companyId);

    Optional<ItemBatch> findByIdAndCompanyId(Long id, Long companyId);
}