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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = authService.authenticate(username, password);

        String role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User has no assigned role"))
                .getName();

        return Map.of(
                "accessToken", jwtUtil.generateAccessToken(user.getUsername(), role),
                "refreshToken", jwtUtil.generateRefreshToken(user.getUsername())
        );
    }

    @PostMapping("/refresh")
    public Map<String, String> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null
                || !jwtUtil.isTokenValid(refreshToken)
                || !jwtUtil.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is disabled");
        }

        String role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User has no assigned role"))
                .getName();

        return Map.of(
                "accessToken", jwtUtil.generateAccessToken(user.getUsername(), role)
        );
    }
}
