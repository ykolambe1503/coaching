package com.coaching.platform.entity;

import com.coaching.platform.enums.InviteStatus;
import com.coaching.platform.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents an invitation for a user to join an organization
 */
@Entity
@Table(name = "user_invites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String inviteToken;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", referencedColumnName = "org_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_id", referencedColumnName = "id")
    private User invitedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InviteStatus status = InviteStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime acceptedAt;

    /**
     * Check if invite is still valid
     */
    public boolean isValid() {
        return status == InviteStatus.PENDING &&
                expiresAt.isAfter(LocalDateTime.now());
    }

    /**
     * Mark invite as accepted
     */
    public void accept() {
        this.status = InviteStatus.ACCEPTED;
        this.acceptedAt = LocalDateTime.now();
    }

    /**
     * Mark invite as expired
     */
    public void expire() {
        this.status = InviteStatus.EXPIRED;
    }

    /**
     * Cancel the invite
     */
    public void cancel() {
        this.status = InviteStatus.CANCELLED;
    }
}
