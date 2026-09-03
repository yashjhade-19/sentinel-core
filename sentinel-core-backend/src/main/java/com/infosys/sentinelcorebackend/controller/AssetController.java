package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.dto.AssetDTO;
import com.infosys.sentinelcorebackend.dto.DashboardSummaryDTO;
import com.infosys.sentinelcorebackend.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    // ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO assetDTO) {
        return assetService.saveAsset(assetDTO);
    }

    // ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public AssetDTO updateAsset(
            @PathVariable Long id,
            @RequestBody AssetDTO assetDTO) {

        assetDTO.setId(id);

        return assetService.saveAsset(assetDTO);
    }

    // Authenticated users can view
    @GetMapping
    public List<AssetDTO> findAllAssets() {
        return assetService.getAllAssets();
    }

    // Authenticated users can view
    @GetMapping("/{id}")
    public AssetDTO findAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    // Authenticated users can view
    @GetMapping("/dashboard/summary")
    public DashboardSummaryDTO getDashboardSummary() {
        return assetService.getDashboardSummary();
    }
}