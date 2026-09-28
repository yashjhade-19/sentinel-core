package com.infosys.sentinelcorebackend.controller;

import com.infosys.sentinelcorebackend.entity.ComplianceCheck;
import com.infosys.sentinelcorebackend.repository.ComplianceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
public class ComplianceController {
    private final ComplianceRepository repository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ComplianceCheck create(@RequestBody ComplianceCheck check) { return repository.save(check); }
    @GetMapping
    public List<ComplianceCheck> getAll() { return repository.findAll(); }
    @GetMapping("/framework/{framework}")
    public List<ComplianceCheck> byFramework(@PathVariable String framework) { return repository.findByFramework(framework); }
}
