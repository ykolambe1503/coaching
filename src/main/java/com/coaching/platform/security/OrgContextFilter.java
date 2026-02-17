package com.coaching.platform.security;

import com.coaching.platform.entity.Organization;
import com.coaching.platform.entity.User;
import com.coaching.platform.repository.OrganizationRepository;
import com.coaching.platform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter that extracts and validates organization context from request header
 * Sets the organization ID in thread-local storage for org-scoped operations
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrgContextFilter extends OncePerRequestFilter {

    private static final String ORG_ID_HEADER = "X-Organization-Id";

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        try {
            // Only process for org-admin endpoints
            String requestPath = request.getRequestURI();
            if (requestPath.startsWith("/api/v1/org-admin/")) {
                String orgIdHeader = request.getHeader(ORG_ID_HEADER);

                if (orgIdHeader == null || orgIdHeader.isEmpty()) {
                    log.warn("Missing {} header for org-admin request", ORG_ID_HEADER);
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                            "Organization ID header is required");
                    return;
                }

                try {
                    UUID orgId = UUID.fromString(orgIdHeader);

                    // Verify organization exists
                    Organization organization = organizationRepository.findById(orgId)
                            .orElse(null);

                    if (organization == null) {
                        log.warn("Organization not found: {}", orgId);
                        response.sendError(HttpServletResponse.SC_NOT_FOUND,
                                "Organization not found");
                        return;
                    }

                    // Verify current user is admin of this organization
                    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                    if (auth != null && auth.isAuthenticated()) {
                        String username = auth.getName();
                        User currentUser = userRepository.findByUsername(username).orElse(null);

                        if (currentUser != null) {
                            // Check if user is the admin of this organization
                            if (organization.getAdminContact() != null &&
                                    !organization.getAdminContact().getId().equals(currentUser.getId())) {
                                log.warn("User {} is not admin of organization {}", username, orgId);
                                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                                        "Access denied: You are not the administrator of this organization");
                                return;
                            }
                        }
                    }

                    // Set organization context
                    OrgContext.setOrgId(orgId);
                    log.debug("Organization context set to: {}", orgId);

                } catch (IllegalArgumentException e) {
                    log.warn("Invalid organization ID format: {}", orgIdHeader);
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                            "Invalid organization ID format");
                    return;
                }
            }

            filterChain.doFilter(request, response);

        } finally {
            // Always clear context after request
            OrgContext.clear();
        }
    }
}
