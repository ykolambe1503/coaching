package com.coaching.platform.repository;

import com.coaching.platform.entity.UserInvite;
import com.coaching.platform.enums.InviteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for UserInvite entity
 */
@Repository
public interface UserInviteRepository extends JpaRepository<UserInvite, UUID> {

    /**
     * Find invite by token
     */
    Optional<UserInvite> findByInviteToken(String inviteToken);

    /**
     * Find all invites for an organization
     */
    List<UserInvite> findByOrganization_OrgId(UUID orgId);

    /**
     * Find invites by status for an organization
     */
    List<UserInvite> findByOrganization_OrgIdAndStatus(UUID orgId, InviteStatus status);

    /**
     * Find pending invites that have expired
     */
    List<UserInvite> findByStatusAndExpiresAtBefore(InviteStatus status, LocalDateTime dateTime);

    /**
     * Check if email already has pending invite in organization
     */
    boolean existsByEmailAndOrganization_OrgIdAndStatus(String email, UUID orgId, InviteStatus status);

    /**
     * Delete old expired invites
     */
    void deleteByStatusAndExpiresAtBefore(InviteStatus status, LocalDateTime dateTime);
}
