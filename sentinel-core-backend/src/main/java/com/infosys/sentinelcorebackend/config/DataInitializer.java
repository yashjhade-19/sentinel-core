package com.infosys.sentinelcorebackend.config;

import com.infosys.sentinelcorebackend.entity.*;
import com.infosys.sentinelcorebackend.repository.*;
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
    private final IncidentRepository incidentRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final AuditLogRepository auditLogRepository;
    private final ComplianceRepository complianceRepository;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_ADMIN").build()));
        Role viewerRole = roleRepository.findByName("ROLE_VIEWER").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_VIEWER").build()));

        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder().username("admin").password(passwordEncoder.encode("admin123"))
                    .email("admin@sentinelcore.local").roles(new HashSet<>(Set.of(adminRole))).enabled(true).build());
        }
        if (userRepository.findByUsername("viewer").isEmpty()) {
            userRepository.save(User.builder().username("viewer").password(passwordEncoder.encode("viewer123"))
                    .email("viewer@sentinelcore.local").roles(new HashSet<>(Set.of(viewerRole))).enabled(true).build());
        }

        seedSecurityOperations();
    }

    private void seedSecurityOperations() {
        if (incidentRepository.count() == 0) {
            incidentRepository.save(Incident.builder()
                    .title("Suspicious Login")
                    .description("Multiple failed login attempts detected")
                    .severity(Incident.Severity.HIGH)
                    .status(Incident.IncidentStatus.OPEN)
                    .assignedTo("admin")
                    .build());
        }

        if (vulnerabilityRepository.count() == 0) {
            vulnerabilityRepository.save(Vulnerability.builder()
                    .cveId("CVE-2026-0001")
                    .title("Sample Vulnerability")
                    .affectedSystem("API Server")
                    .severity("HIGH")
                    .riskScore(8.2)
                    .description("Sample security vulnerability for demonstration")
                    .patchVersion("2.1.0")
                    .patchStatus("OPEN")
                    .build());
        }

        if (auditLogRepository.count() == 0) {
            auditLogRepository.save(AuditLog.builder()
                    .username("admin")
                    .action("LOGIN")
                    .resource("AUTHENTICATION")
                    .ipAddress("127.0.0.1")
                    .details("Successful login")
                    .build());
        }

        if (complianceRepository.count() == 0) {
            complianceRepository.save(ComplianceCheck.builder()
                    .framework("PCI DSS")
                    .controlId("A-01")
                    .controlName("Access Control")
                    .status(ComplianceCheck.ComplianceStatus.COMPLIANT)
                    .remarks("Sample verification")
                    .build());
        }
    }
}
