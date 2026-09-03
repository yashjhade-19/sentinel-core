package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.entity.Alert;
import com.infosys.sentinelcorebackend.entity.Asset;
import com.infosys.sentinelcorebackend.repository.AlertRepository;
import com.infosys.sentinelcorebackend.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthMonitorService {

    private final AssetRepository assetRepository;
    private final AlertService alertService;
    private final AlertRepository alertRepository;

    private static final double CPU_CRITICAL_THRESHOLD = 90.0;
    private static final double MEMORY_WARNING_THRESHOLD = 80.0;
    private static final double DISK_CRITICAL_THRESHOLD = 90.0;

    @Scheduled(fixedRate = 60000)
    public void checkAssetHealth() {
        List<Asset> assets = assetRepository.findAll();

        for (Asset asset : assets) {
            double cpu = valueOrZero(asset.getCpuUsage());
            double memory = valueOrZero(asset.getMemoryUsage());
            double disk = valueOrZero(asset.getDiskUsage());

            if (cpu >= CPU_CRITICAL_THRESHOLD) {
                asset.setStatus("CRITICAL");
                asset.setRisk("CRITICAL");

                createIfNotOpen(
                        asset,
                        Alert.AlertSeverity.CRITICAL,
                        "CPU usage is critical at " + cpu + "%. Immediate attention is required."
                );
            } else if (disk >= DISK_CRITICAL_THRESHOLD) {
                asset.setStatus("CRITICAL");
                asset.setRisk("CRITICAL");

                createIfNotOpen(
                        asset,
                        Alert.AlertSeverity.CRITICAL,
                        "Disk usage is critical at " + disk + "%. Immediate attention is required."
                );
            } else if (memory >= MEMORY_WARNING_THRESHOLD) {
                asset.setStatus("WARNING");
                asset.setRisk("HIGH");

                createIfNotOpen(
                        asset,
                        Alert.AlertSeverity.MEDIUM,
                        "Memory usage is high at " + memory + "%. Please review the asset."
                );
            } else {
                asset.setStatus("ONLINE");
                asset.setRisk(calculateRisk(cpu, memory, disk));
            }

            assetRepository.save(asset);
        }
    }

    private void createIfNotOpen(
            Asset asset,
            Alert.AlertSeverity severity,
            String message) {

        boolean alreadyOpen = alertRepository.existsByAssetIdAndSeverityAndStatus(
                asset.getId(),
                severity,
                Alert.AlertStatus.OPEN
        );

        if (!alreadyOpen) {
            alertService.createAlert(
                    asset.getId(),
                    severity.name(),
                    message
            );
        }
    }

    private String calculateRisk(double cpu, double memory, double disk) {
        if (cpu >= 90 || disk >= 90) return "CRITICAL";
        if (memory >= 80 || cpu >= 75 || disk >= 80) return "HIGH";
        if (cpu >= 60 || memory >= 60 || disk >= 60) return "MEDIUM";
        return "LOW";
    }

    private double valueOrZero(Double value) {
        return value == null ? 0.0 : value;
    }
}
