package com.coaching.platform.controller;

import com.coaching.platform.dto.AuthResponse;
import com.coaching.platform.dto.LoginRequest;
import com.coaching.platform.dto.RegisterRequest;
import com.coaching.platform.dto.SignUpWithInviteRequest;
import com.coaching.platform.service.AuthService;
import com.coaching.platform.service.InviteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final InviteService inviteService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Sign up using an invite token
     */
    @PostMapping("/signup/invite/{token}")
    public ResponseEntity<AuthResponse> signUpWithInvite(
            @PathVariable String token,
            @Valid @RequestBody SignUpWithInviteRequest request) {
        AuthResponse response = inviteService.signUpWithInvite(token, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
