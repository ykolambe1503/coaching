package com.coaching.platform.security;

import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

/**
 * Thread-local storage for current organization context
 * Used to scope all operations to a specific organization
 */
@Slf4j
public class OrgContext {

    private static final ThreadLocal<UUID> currentOrgId = new ThreadLocal<>();

    /**
     * Set the current organization ID for this thread
     */
    public static void setOrgId(UUID orgId) {
        log.debug("Setting org context: {}", orgId);
        currentOrgId.set(orgId);
    }

    /**
     * Get the current organization ID for this thread
     */
    public static UUID getOrgId() {
        return currentOrgId.get();
    }

    /**
     * Check if org context is set
     */
    public static boolean hasOrgContext() {
        return currentOrgId.get() != null;
    }

    /**
     * Clear the organization context for this thread
     * Should be called after request processing
     */
    public static void clear() {
        log.debug("Clearing org context");
        currentOrgId.remove();
    }
}
