package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.GardenMaintenanceResponse;
import com.klef.soa.docker.entity.GardenMaintenanceEntity;
import com.klef.soa.docker.service.GardenMaintenanceServiceImpl;

@RestController
@RequestMapping("/garden")
@CrossOrigin(origins = "http://localhost:3000")
public class GardenMaintenanceController {

	@Autowired
	GardenMaintenanceServiceImpl impl;
	
	@GetMapping("/")
	public String home()
	{
		return "GardenMaintenance Project is Running!!";
	}
	
	@PostMapping("/add")
	public GardenMaintenanceResponse addGarden(@RequestBody GardenMaintenanceEntity g)
	{
		return impl.addGarden(g);
	}
	
	@GetMapping("/displayall")
	public List<GardenMaintenanceResponse> displayAll()
	{
		return impl.getAllGardens();
	}
	
	@GetMapping("/displayById/{id}")
	public GardenMaintenanceResponse displaybyid(@PathVariable Long id)
	{
		return impl.getGardenById(id);
	}
	
	@PutMapping("/updateGardenDetails/{id}")
	public GardenMaintenanceResponse update(@PathVariable Long id, @RequestBody GardenMaintenanceEntity g)
	{
		return impl.updateGarden(id, g);
	}
	
	@DeleteMapping("/delete/{id}")
	public String delete(@PathVariable Long id)
	{
		return impl.deleteGarden(id);
	}
}
