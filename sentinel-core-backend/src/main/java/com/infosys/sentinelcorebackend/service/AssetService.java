package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.AssetDTO;
import com.infosys.sentinelcorebackend.dto.DashboardSummaryDTO;
import com.infosys.sentinelcorebackend.entity.Asset;
import com.infosys.sentinelcorebackend.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    // Create Asset
    public AssetDTO saveAsset(AssetDTO dto) {

        Asset asset = convertToEntity(dto);

        Asset savedAsset = assetRepository.save(asset);

        return convertToDTO(savedAsset);
    }

    // Get all Assets
    public List<AssetDTO> getAllAssets() {

        return assetRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get Asset by ID
    public AssetDTO getAssetById(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Asset not found"));

        return convertToDTO(asset);
    }

    // Dashboard Summary
    public DashboardSummaryDTO getDashboardSummary() {

        Long totalAssets = assetRepository.count();

        Double avgCpuUsage =
                assetRepository.findAverageCpuUsage();

        Double avgMemoryUsage =
                assetRepository.findAverageMemoryUsage();

        Long criticalAlerts =
                assetRepository.countCriticalAssets();

        Long onlineAssets =
                assetRepository.countOnlineAssets();

        Double uptimePercentage;

        if (totalAssets == 0) {
            uptimePercentage = 0.0;
        } else {
            uptimePercentage =
                    ((double) onlineAssets / totalAssets) * 100;
        }

        return DashboardSummaryDTO.builder()
                .totalAssets(totalAssets)
                .uptimePercentage(uptimePercentage)
                .avgCpuUsage(
                        avgCpuUsage != null
                                ? avgCpuUsage
                                : 0.0
                )
                .avgMemoryUsage(
                        avgMemoryUsage != null
                                ? avgMemoryUsage
                                : 0.0
                )
                .criticalAlerts(criticalAlerts)
                .build();
    }

    // Entity → DTO
    private AssetDTO convertToDTO(Asset asset) {

        return AssetDTO.builder()
                .id(asset.getId())
                .assetName(asset.getAssetName())
                .assetType(asset.getAssetType())
                .ipAddress(asset.getIpAddress())
                .location(asset.getLocation())
                .status(asset.getStatus())
                .cpuUsage(asset.getCpuUsage())
                .memoryUsage(asset.getMemoryUsage())
                .networkUsage(asset.getNetworkUsage())
                .createdDate(asset.getCreatedDate())
                .build();
    }

    // DTO → Entity
    private Asset convertToEntity(AssetDTO dto) {

        return Asset.builder()
                .id(dto.getId())
                .assetName(dto.getAssetName())
                .assetType(dto.getAssetType())
                .ipAddress(dto.getIpAddress())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .cpuUsage(dto.getCpuUsage())
                .memoryUsage(dto.getMemoryUsage())
                .networkUsage(dto.getNetworkUsage())
                .createdDate(dto.getCreatedDate())
                .build();
    }
}