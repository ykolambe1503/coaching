package com.coaching.platform.dto;

import com.coaching.platform.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UUID userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
