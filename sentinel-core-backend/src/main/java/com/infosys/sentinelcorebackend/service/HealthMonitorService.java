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

    @Scheduled(fixedRate = 60000)
    public void checkAssetHealth() {

        List<Asset> assets = assetRepository.findAll();

        for (Asset asset : assets) {

            if (asset.getCpuUsage() != null &&
                    asset.getCpuUsage() >= CPU_CRITICAL_THRESHOLD) {

                asset.setStatus("CRITICAL");

                boolean alreadyAlerted =
                        alertRepository.existsByAssetIdAndSeverityAndStatus(
                                asset.getId(),
                                Alert.AlertSeverity.CRITICAL,
                                Alert.AlertStatus.OPEN
                        );

                if (!alreadyAlerted) {
                    alertService.createAlert(
                            asset.getId(),
                            "CRITICAL",
                            "CPU usage critical: "
                                    + asset.getCpuUsage() + "%"
                    );
                }

            } else if (asset.getMemoryUsage() != null &&
                    asset.getMemoryUsage() >= MEMORY_WARNING_THRESHOLD) {

                asset.setStatus("WARNING");

                boolean alreadyAlerted =
                        alertRepository.existsByAssetIdAndSeverityAndStatus(
                                asset.getId(),
                                Alert.AlertSeverity.MEDIUM,
                                Alert.AlertStatus.OPEN
                        );

                if (!alreadyAlerted) {
                    alertService.createAlert(
                            asset.getId(),
                            "MEDIUM",
                            "Memory usage high: "
                                    + asset.getMemoryUsage() + "%"
                    );
                }

            } else {

                asset.setStatus("ONLINE");
            }

            assetRepository.save(asset);
        }
    }
}