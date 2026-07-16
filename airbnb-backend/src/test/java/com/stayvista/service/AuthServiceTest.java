package com.stayvista.service;

import com.stayvista.dto.auth.LoginRequest;
import com.stayvista.dto.auth.RegisterRequest;
import com.stayvista.dto.auth.JwtResponse;
import com.stayvista.entity.User;
import com.stayvista.exception.ConflictException;
import com.stayvista.repository.UserRepository;
import com.stayvista.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;
    @Mock private EmailService emailService;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User mockUser;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("Password123");

        mockUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(User.Role.GUEST)
                .emailVerified(false)
                .isActive(true)
                .isBanned(false)
                .build();
    }

    @Test
    @DisplayName("Register - should throw ConflictException when email exists")
    void register_shouldThrowConflict_whenEmailExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already registered");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Register - should create user successfully")
    void register_shouldCreateUser_whenEmailNotExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        org.springframework.security.core.userdetails.UserDetails mockDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username("john@example.com")
                        .password("encoded_password")
                        .roles("GUEST")
                        .build();

        when(userDetailsService.loadUserByUsername(anyString())).thenReturn(mockDetails);
        when(jwtTokenProvider.generateToken(any())).thenReturn("access_token");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("refresh_token");
        doNothing().when(notificationService).createWelcomeNotification(any());
        doNothing().when(emailService).sendEmailVerification(anyString(), anyString(), anyString());

        JwtResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getEmail()).isEqualTo("john@example.com");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Login - should authenticate and return tokens")
    void login_shouldReturnTokens_whenCredentialsValid() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("Password123");

        org.springframework.security.core.userdetails.UserDetails mockDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username("john@example.com")
                        .password("encoded_password")
                        .roles("GUEST")
                        .build();

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockDetails);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(mockUser));
        when(jwtTokenProvider.generateToken(any())).thenReturn("access_token");
        when(jwtTokenProvider.generateRefreshToken(any())).thenReturn("refresh_token");

        JwtResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_token");
    }
}
