package com.coaching.platform.enums;

/**
 * Status of a user invitation
 */
public enum InviteStatus {
    /**
     * Invite has been sent and is awaiting acceptance
     */
    PENDING,

    /**
     * Invite has been accepted and user has signed up
     */
    ACCEPTED,

    /**
     * Invite has expired (past expiration date)
     */
    EXPIRED,

    /**
     * Invite has been cancelled by admin
     */
    CANCELLED
}
