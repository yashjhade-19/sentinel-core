package com.infosys.sentinelcorebackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Enumerated(EnumType.STRING)
    private AlertSeverity severity;

    private String message;

    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    public enum AlertSeverity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum AlertStatus {
        OPEN,
        ACKNOWLEDGED,
        RESOLVED
    }
}