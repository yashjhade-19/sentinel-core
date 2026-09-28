package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.entity.Role;
import com.infosys.sentinelcorebackend.entity.User;
import com.infosys.sentinelcorebackend.repository.RoleRepository;
import com.infosys.sentinelcorebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public User authenticate(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password")
                );

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is disabled");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    public void registerViewer(String username, String email, String password) {

        String normalizedUsername = username == null ? "" : username.trim();
        String normalizedEmail = email == null ? "" : email.trim();

        if (userRepository.findByUsername(normalizedUsername).isPresent()) {
            throw new IllegalArgumentException("Username is already taken");
        }

        Role viewerRole = roleRepository.findByName("ROLE_VIEWER")
                .orElseThrow(() -> new IllegalStateException("ROLE_VIEWER is not configured"));

        User user = User.builder()
                .username(normalizedUsername)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .roles(new HashSet<>(Set.of(viewerRole)))
                .enabled(true)
                .build();

        userRepository.save(user);
    }
}
