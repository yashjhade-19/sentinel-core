package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.dto.IncidentRequest;
import com.infosys.sentinelcorebackend.entity.Incident;
import com.infosys.sentinelcorebackend.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {
    private final IncidentService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Incident> create(@RequestBody IncidentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public List<Incident> getAll() { return service.getAll(); }

    @GetMapping("/{id}")
    public Incident getById(@PathVariable Long id) { return service.getById(id); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign")
    public Incident assign(@PathVariable Long id, @RequestParam String user) { return service.assign(id, user); }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public Incident updateStatus(@PathVariable Long id, @RequestParam Incident.IncidentStatus status) {
        return service.updateStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
