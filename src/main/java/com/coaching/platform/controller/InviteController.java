package com.coaching.platform.controller;

import com.coaching.platform.dto.InviteRequest;
import com.coaching.platform.dto.InviteResponse;
import com.coaching.platform.security.OrgContext;
import com.coaching.platform.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for managing user invites
 * All operations are scoped to the organization specified in X-Organization-Id
 * header
 */
@RestController
@RequestMapping("/api/v1/org-admin/invites")
@RequiredArgsConstructor
@Slf4j
public class InviteController {

    private final UserManagementService userManagementService;

    /**
     * Create a new invite
     */
    @PostMapping
    public ResponseEntity<InviteResponse> createInvite(@Valid @RequestBody InviteRequest request) {
        UUID orgId = OrgContext.getOrgId();
        log.info("POST /api/v1/org-admin/invites for org: {}", orgId);
        InviteResponse invite = userManagementService.createInvite(request, orgId);
        return ResponseEntity.status(HttpStatus.CREATED).body(invite);
    }

    /**
     * Get all invites for the organization
     */
    @GetMapping
    public ResponseEntity<List<InviteResponse>> getInvites() {
        UUID orgId = OrgContext.getOrgId();
        log.info("GET /api/v1/org-admin/invites for org: {}", orgId);
        List<InviteResponse> invites = userManagementService.getInvites(orgId);
        return ResponseEntity.ok(invites);
    }

    /**
     * Resend an invite
     */
    @PostMapping("/{inviteId}/resend")
    public ResponseEntity<InviteResponse> resendInvite(@PathVariable UUID inviteId) {
        UUID orgId = OrgContext.getOrgId();
        log.info("POST /api/v1/org-admin/invites/{}/resend for org: {}", inviteId, orgId);
        InviteResponse invite = userManagementService.resendInvite(inviteId, orgId);
        return ResponseEntity.ok(invite);
    }
}
