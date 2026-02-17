package com.coaching.platform.repository;

import com.coaching.platform.entity.Organization;
import com.coaching.platform.enums.OrganizationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Organization entity
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {

    /**
     * Find organization by name
     */
    Optional<Organization> findByName(String name);

    /**
     * Find all organizations by status
     */
    List<Organization> findByStatus(OrganizationStatus status);

    /**
     * Check if organization name already exists
     */
    boolean existsByName(String name);

    /**
     * Find organizations by admin contact
     */
    Optional<Organization> findByAdminContact_Id(UUID adminUserId);

    /**
     * Find all active organizations
     */
    default List<Organization> findAllActive() {
        return findByStatus(OrganizationStatus.ACTIVE);
    }

    /**
     * Find all suspended organizations
     */
    default List<Organization> findAllSuspended() {
        return findByStatus(OrganizationStatus.SUSPENDED);
    }
}
