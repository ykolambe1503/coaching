package com.coaching.platform.security;

import com.coaching.platform.entity.User;
import com.coaching.platform.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;

import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "jwt.secret=test-secret-key-for-jwt-token-generation-must-be-at-least-256-bits-long",
        "jwt.expiration=3600000" // 1 hour in milliseconds
})
class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil;

    private User user;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(Role.STUDENT)
                .enabled(true)
                .build();

        userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("testuser")
                .password("encodedPassword")
                .authorities("ROLE_STUDENT")
                .build();
    }

    @Test
    void generateToken_ValidUser_ReturnsToken() {
        // Act
        String token = jwtUtil.generateToken(user);

        // Assert
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts separated by dots
    }

    @Test
    void extractUsername_ValidToken_ReturnsUsername() {
        // Arrange
        String token = jwtUtil.generateToken(user);

        // Act
        String username = jwtUtil.extractUsername(token);

        // Assert
        assertEquals("testuser", username);
    }

    @Test
    void extractExpiration_ValidToken_ReturnsFutureDate() {
        // Arrange
        String token = jwtUtil.generateToken(user);

        // Act
        Date expiration = jwtUtil.extractExpiration(token);

        // Assert
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date())); // Expiration should be in the future
    }

    @Test
    void validateToken_ValidToken_ReturnsTrue() {
        // Arrange
        String token = jwtUtil.generateToken(user);

        // Act
        Boolean isValid = jwtUtil.validateToken(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void validateToken_WrongUsername_ReturnsFalse() {
        // Arrange
        String token = jwtUtil.generateToken(user);

        UserDetails wrongUserDetails = org.springframework.security.core.userdetails.User.builder()
                .username("wronguser")
                .password("password")
                .authorities("ROLE_STUDENT")
                .build();

        // Act
        Boolean isValid = jwtUtil.validateToken(token, wrongUserDetails);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void generateToken_CreatesTokenWithCorrectClaims() {
        // Act
        String token = jwtUtil.generateToken(user);

        // Assert - verify we can extract the username
        String extractedUsername = jwtUtil.extractUsername(token);
        assertEquals(user.getUsername(), extractedUsername);
    }

    @Test
    void extractExpiration_TokenHasCorrectExpirationTime() {
        // Arrange
        long beforeGeneration = System.currentTimeMillis();
        String token = jwtUtil.generateToken(user);
        long afterGeneration = System.currentTimeMillis();

        // Act
        Date expiration = jwtUtil.extractExpiration(token);

        // Assert
        // Verify expiration is approximately 1 hour (3600000 ms) from now
        long expirationTime = expiration.getTime();
        long expectedMinExpiration = beforeGeneration + 3600000;
        long expectedMaxExpiration = afterGeneration + 3600000;

        assertTrue(expirationTime >= expectedMinExpiration && expirationTime <= expectedMaxExpiration,
                "Expiration time should be approximately 1 hour from token generation");
    }

    @Test
    void generateToken_DifferentUsers_GenerateDifferentTokens() {
        // Arrange
        User user2 = User.builder()
                .id(UUID.randomUUID())
                .username("anotheruser")
                .email("another@example.com")
                .password("encodedPassword")
                .firstName("Another")
                .lastName("User")
                .role(Role.FACULTY)
                .enabled(true)
                .build();

        // Act
        String token1 = jwtUtil.generateToken(user);
        String token2 = jwtUtil.generateToken(user2);

        // Assert
        assertNotEquals(token1, token2);
        assertEquals("testuser", jwtUtil.extractUsername(token1));
        assertEquals("anotheruser", jwtUtil.extractUsername(token2));
    }
}
