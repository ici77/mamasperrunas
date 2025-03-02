package com.mp.backend.controllers;



import com.mp.backend.services.DogApiService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dogs")
@CrossOrigin(origins = "*") // Permitir peticiones desde cualquier origen (útil para Angular)
public class DogApiController {
    
    private final DogApiService dogApiService;

    public DogApiController(DogApiService dogApiService) {
        this.dogApiService = dogApiService;
    }

    @GetMapping("/breeds")
    public String getDogBreeds() {
        return dogApiService.getDogBreeds();
    }
}
