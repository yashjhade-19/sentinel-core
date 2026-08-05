package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.dto.AssetDTO;
import com.infosys.sentinelcorebackend.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO assetDTO) {
        return assetService.saveAsset(assetDTO);
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