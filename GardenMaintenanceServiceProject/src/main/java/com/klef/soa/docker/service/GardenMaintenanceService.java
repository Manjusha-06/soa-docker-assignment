package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.GardenMaintenanceResponse;
import com.klef.soa.docker.entity.GardenMaintenanceEntity;

public interface GardenMaintenanceService {

	GardenMaintenanceResponse addGarden(GardenMaintenanceEntity garden);

	List<GardenMaintenanceResponse> getAllGardens();

	GardenMaintenanceResponse getGardenById(Long id);

	GardenMaintenanceResponse updateGarden(Long id, GardenMaintenanceEntity garden);

	String deleteGarden(Long id);
}