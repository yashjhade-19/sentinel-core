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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO assetDTO) {
        return assetService.saveAsset(assetDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public AssetDTO updateAsset(
            @PathVariable Long id,
            @RequestBody AssetDTO assetDTO) {
        assetDTO.setId(id);
        return assetService.saveAsset(assetDTO);
    }

    @GetMapping("/dashboard/summary")
    public DashboardSummaryDTO getDashboardSummary() {
        return assetService.getDashboardSummary();
    }

    @GetMapping("/search")
    public List<AssetDTO> searchAssets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String risk) {
        return assetService.searchAssets(search, status, risk);
    }

    @GetMapping
    public List<AssetDTO> findAllAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public AssetDTO findAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }
}
