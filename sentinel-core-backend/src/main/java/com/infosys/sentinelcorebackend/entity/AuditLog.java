package com.infosys.sentinelcorebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String action;
    private String resource;
    private String ipAddress;

    @Column(length = 2000)
    private String details;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
