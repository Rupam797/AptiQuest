package com.aptitudeedge.controller;

import com.aptitudeedge.dto.request.LoginRequest;
import com.aptitudeedge.dto.request.RegisterRequest;
import com.aptitudeedge.dto.response.AuthResponse;
import com.aptitudeedge.model.RefreshToken;
import com.aptitudeedge.model.User;
import com.aptitudeedge.repository.UserRepository;
import com.aptitudeedge.security.JwtUtil;
import com.aptitudeedge.service.AuthService;
import com.aptitudeedge.service.RefreshTokenService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);
        setRefreshTokenCookie(response, authResponse.getRefreshToken());
        authResponse.setRefreshToken(null);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        String token = getRefreshTokenFromCookies(request);
        if (token == null || token.isEmpty()) {
            throw new IllegalArgumentException("Refresh token is missing");
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(token)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getUsername());
        
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getUsername());
        setRefreshTokenCookie(response, newRefreshToken.getToken());

        return ResponseEntity.ok(new AuthResponse(newAccessToken, user.getUsername(), user.getRole()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {
        String token = getRefreshTokenFromCookies(request);
        if (token != null && !token.isEmpty()) {
            refreshTokenService.findByToken(token)
                    .ifPresent(rt -> refreshTokenService.deleteByUsername(rt.getUser().getUsername()));
        }
        
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token) {
        long maxAge = 7 * 24 * 60 * 60;
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            return Arrays.stream(cookies)
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }
        return null;
    }
}
