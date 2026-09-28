package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.AuditLogRequest;
import com.infosys.sentinelcorebackend.entity.AuditLog;
import com.infosys.sentinelcorebackend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    private final AuditLogRepository repository;

    public AuditLog create(AuditLogRequest request) {
        AuditLog log = AuditLog.builder()
                .username(request.getUsername())
                .action(request.getAction())
                .resource(request.getResource())
                .ipAddress(request.getIpAddress())
                .details(request.getDetails())
                .build();
        return repository.save(log);
    }

    public List<AuditLog> getAll() { return repository.findAll(); }
    public List<AuditLog> getByUsername(String username) { return repository.findByUsername(username); }
}
