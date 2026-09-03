package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.AssetDTO;
import com.infosys.sentinelcorebackend.dto.DashboardSummaryDTO;
import com.infosys.sentinelcorebackend.entity.Alert;
import com.infosys.sentinelcorebackend.entity.Asset;
import com.infosys.sentinelcorebackend.repository.AlertRepository;
import com.infosys.sentinelcorebackend.repository.AssetRepository;
import com.infosys.sentinelcorebackend.repository.AssetSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;
    private final AlertRepository alertRepository;

    public AssetDTO saveAsset(AssetDTO dto) {
        Asset asset = convertToEntity(dto);

        if (asset.getCreatedDate() == null) {
            asset.setCreatedDate(LocalDateTime.now());
        }

        if (asset.getRisk() == null || asset.getRisk().isBlank()) {
            asset.setRisk(calculateRisk(asset));
        }

        if (asset.getStatus() == null || asset.getStatus().isBlank()) {
            asset.setStatus(calculateStatus(asset));
        }

        return convertToDTO(assetRepository.save(asset));
    }

    public List<AssetDTO> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public List<AssetDTO> searchAssets(String search, String status, String risk) {
        Specification<Asset> specification =
                AssetSpecification.searchAssets(search, status, risk);

        return assetRepository.findAll(specification)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public AssetDTO getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + id));

        return convertToDTO(asset);
    }

    public DashboardSummaryDTO getDashboardSummary() {
        long totalAssets = assetRepository.count();
        long onlineAssets = assetRepository.countOnlineAssets();
        long offlineAssets = assetRepository.countOfflineAssets();

        Double avgCpuUsage = assetRepository.findAverageCpuUsage();
        Double avgMemoryUsage = assetRepository.findAverageMemoryUsage();
        long criticalAlerts = alertRepository.countBySeverityAndStatus(
                Alert.AlertSeverity.CRITICAL,
                Alert.AlertStatus.OPEN
        );

        double uptimePercentage = totalAssets == 0
                ? 0.0
                : ((double) onlineAssets / totalAssets) * 100.0;

        return DashboardSummaryDTO.builder()
                .totalAssets(totalAssets)
                .onlineAssets(onlineAssets)
                .offlineAssets(offlineAssets)
                .uptimePercentage(uptimePercentage)
                .avgCpuUsage(avgCpuUsage != null ? avgCpuUsage : 0.0)
                .avgMemoryUsage(avgMemoryUsage != null ? avgMemoryUsage : 0.0)
                .criticalAlerts(criticalAlerts)
                .build();
    }

    private String calculateRisk(Asset asset) {
        double cpu = valueOrZero(asset.getCpuUsage());
        double memory = valueOrZero(asset.getMemoryUsage());
        double disk = valueOrZero(asset.getDiskUsage());

        if (cpu >= 90 || disk >= 90) {
            return "CRITICAL";
        }
        if (memory >= 80 || cpu >= 75 || disk >= 80) {
            return "HIGH";
        }
        if (cpu >= 60 || memory >= 60 || disk >= 60) {
            return "MEDIUM";
        }
        return "LOW";
    }

    private String calculateStatus(Asset asset) {
        if (valueOrZero(asset.getCpuUsage()) >= 90) {
            return "CRITICAL";
        }
        if (valueOrZero(asset.getMemoryUsage()) >= 80) {
            return "WARNING";
        }
        return "ONLINE";
    }

    private double valueOrZero(Double value) {
        return value == null ? 0.0 : value;
    }

    private AssetDTO convertToDTO(Asset asset) {
        return AssetDTO.builder()
                .id(asset.getId())
                .assetName(asset.getAssetName())
                .assetType(asset.getAssetType())
                .ipAddress(asset.getIpAddress())
                .location(asset.getLocation())
                .status(asset.getStatus())
                .risk(asset.getRisk())
                .cpuUsage(asset.getCpuUsage())
                .memoryUsage(asset.getMemoryUsage())
                .diskUsage(asset.getDiskUsage())
                .networkUsage(asset.getNetworkUsage())
                .createdDate(asset.getCreatedDate())
                .build();
    }

    private Asset convertToEntity(AssetDTO dto) {
        return Asset.builder()
                .id(dto.getId())
                .assetName(dto.getAssetName())
                .assetType(dto.getAssetType())
                .ipAddress(dto.getIpAddress())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .risk(dto.getRisk())
                .cpuUsage(dto.getCpuUsage())
                .memoryUsage(dto.getMemoryUsage())
                .diskUsage(dto.getDiskUsage())
                .networkUsage(dto.getNetworkUsage())
                .createdDate(dto.getCreatedDate())
                .build();
    }
}
