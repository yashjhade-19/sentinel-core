package com.infosys.sentinelcorebackend.repository;

import com.infosys.sentinelcorebackend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

//    List<Asset> findByStatus(Asset.AssetStatus status);
//    List<Asset> findByAssetType(String assetType);
}