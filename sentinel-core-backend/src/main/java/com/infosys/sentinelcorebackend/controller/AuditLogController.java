package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.dto.AuditLogRequest;
import com.infosys.sentinelcorebackend.entity.AuditLog;
import com.infosys.sentinelcorebackend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditLogController {
    private final AuditLogService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AuditLog create(@RequestBody AuditLogRequest request) { return service.create(request); }
    @GetMapping
    public List<AuditLog> getAll() { return service.getAll(); }
    @GetMapping("/user/{username}")
    public List<AuditLog> getByUsername(@PathVariable String username) { return service.getByUsername(username); }
}
