package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.GardenMaintenanceResponse;
import com.klef.soa.docker.entity.GardenMaintenanceEntity;
import com.klef.soa.docker.repository.GardenMaintenanceRepository;

@Service
public class GardenMaintenanceServiceImpl implements GardenMaintenanceService {

    @Autowired
    GardenMaintenanceRepository repo;

    @Override
    public GardenMaintenanceResponse addGarden(GardenMaintenanceEntity garden) {

        GardenMaintenanceEntity g = repo.save(garden);
        return mapToResponse(g);
    }

    @Override
    public List<GardenMaintenanceResponse> getAllGardens() {

        List<GardenMaintenanceEntity> gardens = repo.findAll();

        return gardens.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GardenMaintenanceResponse getGardenById(Long id) {

        Optional<GardenMaintenanceEntity> optional = repo.findById(id);

        if (optional.isPresent()) {
            return mapToResponse(optional.get());
        }

        return null;
    }

    @Override
    public GardenMaintenanceResponse updateGarden(Long id, GardenMaintenanceEntity garden) {

        Optional<GardenMaintenanceEntity> optional = repo.findById(id);

        if (optional.isPresent()) {

            GardenMaintenanceEntity g = optional.get();

            g.setGardenName(garden.getGardenName());
            g.setAreaSquareMeters(garden.getAreaSquareMeters());
            g.setVisitCount(garden.getVisitCount());
            g.setActive(garden.isActive());

            GardenMaintenanceEntity updated = repo.save(g);

            return mapToResponse(updated);
        }

        return null;
    }

    @Override
    public String deleteGarden(Long id) {

        Optional<GardenMaintenanceEntity> optional = repo.findById(id);

        if (optional.isPresent()) {
            repo.deleteById(id);
            return "Garden deleted successfully";
        }

        return "Garden ID not found";
    }

    public GardenMaintenanceResponse mapToResponse(GardenMaintenanceEntity garden) {

        GardenMaintenanceResponse response = new GardenMaintenanceResponse();

        response.setId(garden.getId());
        response.setGardenName(garden.getGardenName());
        response.setAreaSquareMeters(garden.getAreaSquareMeters());
        response.setVisitCount(garden.getVisitCount());
        response.setActive(garden.isActive());

        return response;
    }
}