package com.infosys.sentinelcorebackend.config;

import com.infosys.sentinelcorebackend.entity.Role;
import com.infosys.sentinelcorebackend.entity.User;
import com.infosys.sentinelcorebackend.repository.RoleRepository;
import com.infosys.sentinelcorebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // Create roles
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() ->
                        roleRepository.save(
                                Role.builder()
                                        .name("ROLE_ADMIN")
                                        .build()
                        )
                );

        Role viewerRole = roleRepository.findByName("ROLE_VIEWER")
                .orElseGet(() ->
                        roleRepository.save(
                                Role.builder()
                                        .name("ROLE_VIEWER")
                                        .build()
                        )
                );

        // Create admin user
        if (userRepository.findByUsername("admin").isEmpty()) {

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@sentinelcore.local")
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        }

        // Create viewer user
        if (userRepository.findByUsername("viewer").isEmpty()) {

            User viewer = User.builder()
                    .username("viewer")
                    .password(passwordEncoder.encode("viewer123"))
                    .email("viewer@sentinelcore.local")
                    .roles(new HashSet<>(Set.of(viewerRole)))
                    .enabled(true)
                    .build();

            userRepository.save(viewer);
        }
    }
}