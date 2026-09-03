package com.infosys.sentinelcorebackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDTO {

    private Long id;
    private String assetName;
    private String assetType;
    private String ipAddress;
    private String location;
    private String status;
    private String risk;
    private Double cpuUsage;
    private Double memoryUsage;
    private Double diskUsage;
    private Double networkUsage;
    private LocalDateTime createdDate;
}
