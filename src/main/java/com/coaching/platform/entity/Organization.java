package com.coaching.platform.entity;

import com.coaching.platform.enums.OrganizationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Represents a coaching institute/organization in the platform
 */
@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "org_id")
    private UUID orgId;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OrganizationStatus status = OrganizationStatus.PENDING;

    @Column(length = 200)
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @OneToOne
    @JoinColumn(name = "admin_user_id", referencedColumnName = "id")
    private User adminContact;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Batch> batches = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Get the count of batches in this organization
     */
    public int getBatchCount() {
        return batches != null ? batches.size() : 0;
    }

    /**
     * Check if organization is active
     */
    public boolean isActive() {
        return status == OrganizationStatus.ACTIVE;
    }

    /**
     * Activate the organization
     */
    public void activate() {
        this.status = OrganizationStatus.ACTIVE;
    }

    /**
     * Suspend the organization
     */
    public void suspend() {
        this.status = OrganizationStatus.SUSPENDED;
    }
}
