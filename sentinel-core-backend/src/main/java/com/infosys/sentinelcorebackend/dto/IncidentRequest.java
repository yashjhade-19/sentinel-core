package com.infosys.sentinelcorebackend.dto;

import com.infosys.sentinelcorebackend.entity.Incident;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncidentRequest {
    private String title;
    private String description;
    private Incident.Severity severity;
    private String assignedTo;
    private LocalDateTime slaDueAt;
}
