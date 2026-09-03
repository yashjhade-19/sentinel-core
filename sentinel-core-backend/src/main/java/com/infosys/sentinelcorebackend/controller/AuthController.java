package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.entity.User;
import com.infosys.sentinelcorebackend.repository.UserRepository;
import com.infosys.sentinelcorebackend.service.AuthService;
import com.infosys.sentinelcorebackend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = authService.authenticate(username, password);

        String role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("User has no assigned role")
                )
                .getName();

        String accessToken = jwtUtil.generateAccessToken(
                user.getUsername(),
                role
        );

        String refreshToken = jwtUtil.generateRefreshToken(
                user.getUsername()
        );

        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(
            @RequestBody Map<String, String> request) {

        String refreshToken = request.get("refreshToken");

        if (refreshToken == null ||
                !jwtUtil.isTokenValid(refreshToken)) {

            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        String role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("User has no assigned role")
                )
                .getName();

        String newAccessToken = jwtUtil.generateAccessToken(
                user.getUsername(),
                role
        );

        return Map.of(
                "accessToken", newAccessToken
        );
    }
}