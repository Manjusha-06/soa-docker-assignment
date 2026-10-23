package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GardenMaintenanceResponse {

	private Long id;
	private String gardenName;
	private double areaSquareMeters;
	private int visitCount;
	private boolean active;
}
