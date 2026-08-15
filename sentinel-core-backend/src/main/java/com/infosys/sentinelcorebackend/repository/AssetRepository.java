package com.infosys.sentinelcorebackend.repository;

import com.infosys.sentinelcorebackend.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AssetRepository extends JpaRepository<Asset, Long> {

    @Query("SELECT AVG(a.cpuUsage) FROM Asset a")
    Double findAverageCpuUsage();

    @Query("SELECT AVG(a.memoryUsage) FROM Asset a")
    Double findAverageMemoryUsage();

    @Query("""
           SELECT COUNT(a)
           FROM Asset a
           WHERE a.status = 'CRITICAL'
           """)
    Long countCriticalAssets();

    @Query("""
           SELECT COUNT(a)
           FROM Asset a
           WHERE a.status = 'ONLINE'
           """)
    Long countOnlineAssets();
}