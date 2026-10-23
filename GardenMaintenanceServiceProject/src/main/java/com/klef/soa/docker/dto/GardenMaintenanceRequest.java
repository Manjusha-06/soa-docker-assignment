package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GardenMaintenanceRequest {

	private String gardenName;
	private double areaSquareMeters;
	private int visitCount;
	private boolean active;
}
