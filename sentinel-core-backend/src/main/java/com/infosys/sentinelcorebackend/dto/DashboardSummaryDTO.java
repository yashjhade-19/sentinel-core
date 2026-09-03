package com.infosys.sentinelcorebackend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryDTO {

    private Long totalAssets;

    private Long onlineAssets;

    private Long offlineAssets;

    private Double uptimePercentage;

    private Double avgCpuUsage;

    private Double avgMemoryUsage;

    private Long criticalAlerts;
}