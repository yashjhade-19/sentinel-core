package com.infosys.sentinelcorebackend.service;

import com.infosys.sentinelcorebackend.dto.IncidentRequest;
import com.infosys.sentinelcorebackend.entity.Incident;
import com.infosys.sentinelcorebackend.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {
    private final IncidentRepository repository;

    public Incident create(IncidentRequest request) {
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .severity(request.getSeverity())
                .assignedTo(request.getAssignedTo())
                .slaDueAt(request.getSlaDueAt())
                .status(Incident.IncidentStatus.OPEN)
                .build();
        return repository.save(incident);
    }

    public List<Incident> getAll() { return repository.findAll(); }

    public Incident getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    public Incident assign(Long id, String user) {
        Incident incident = getById(id);
        incident.setAssignedTo(user);
        incident.setStatus(Incident.IncidentStatus.IN_PROGRESS);
        return repository.save(incident);
    }

    public Incident updateStatus(Long id, Incident.IncidentStatus status) {
        Incident incident = getById(id);
        incident.setStatus(status);
        if (status == Incident.IncidentStatus.RESOLVED) incident.setResolvedAt(LocalDateTime.now());
        return repository.save(incident);
    }

    public void delete(Long id) { repository.deleteById(id); }
}
