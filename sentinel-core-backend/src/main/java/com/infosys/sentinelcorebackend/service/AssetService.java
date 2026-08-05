package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.AssetDTO;
import com.infosys.sentinelcorebackend.entity.Asset;
import com.infosys.sentinelcorebackend.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetDTO saveAsset(AssetDTO dto) {

        Asset asset = convertToEntity(dto);

        Asset savedAsset = assetRepository.save(asset);

        return convertToDTO(savedAsset);
    }

    public List<AssetDTO> getAllAssets() {

        return assetRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public AssetDTO getAssetById(Long id) {

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        return convertToDTO(asset);
    }

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