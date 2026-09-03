package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.AlertDTO;
import com.infosys.sentinelcorebackend.entity.Alert;
import com.infosys.sentinelcorebackend.entity.Asset;
import com.infosys.sentinelcorebackend.repository.AlertRepository;
import com.infosys.sentinelcorebackend.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;
    private final NotificationService notificationService;

    public AlertDTO createAlert(
            Long assetId,
            String severity,
            String message) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found: " + assetId
                        )
                );

        Alert.AlertSeverity alertSeverity =
                Alert.AlertSeverity.valueOf(severity);

        /*
         * Prevent duplicate OPEN alerts.
         *
         * HealthMonitorService runs periodically. If the same
         * condition is still active, we keep the existing alert
         * instead of creating another one every minute.
         */
        boolean alreadyOpen =
                alertRepository.existsByAssetIdAndSeverityAndStatus(
                        assetId,
                        alertSeverity,
                        Alert.AlertStatus.OPEN
                );

        if (alreadyOpen) {

            return alertRepository
                    .findByStatus(Alert.AlertStatus.OPEN)
                    .stream()
                    .filter(alert ->
                            alert.getAsset().getId().equals(assetId)
                                    && alert.getSeverity() == alertSeverity
                    )
                    .findFirst()
                    .map(this::toDTO)
                    .orElseThrow();
        }

        Alert alert = Alert.builder()
                .asset(asset)
                .severity(alertSeverity)
                .message(message)
                .status(Alert.AlertStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();

        Alert savedAlert = alertRepository.save(alert);

        /*
         * Send notification only for HIGH and CRITICAL alerts.
         */
        if (alertSeverity == Alert.AlertSeverity.HIGH ||
                alertSeverity == Alert.AlertSeverity.CRITICAL) {

            notificationService.sendAlertEmail(
                    asset.getAssetName(),
                    alertSeverity.name(),
                    message
            );
        }

        return toDTO(savedAlert);
    }

    public AlertDTO resolveAlert(Long alertId) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alert not found: " + alertId
                        )
                );

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        return toDTO(alertRepository.save(alert));
    }

    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(Alert.AlertStatus.OPEN)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AlertDTO toDTO(Alert alert) {

        return AlertDTO.builder()
                .id(alert.getId())
                .assetId(alert.getAsset().getId())
                .assetName(alert.getAsset().getAssetName())
                .severity(alert.getSeverity().name())
                .message(alert.getMessage())
                .status(alert.getStatus().name())
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}