package com.mp.backend;

import com.mp.backend.service.AmazonApiService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/amazon")
public class AmazonController {

    private final AmazonApiService amazonApiService;

    
    public AmazonController(AmazonApiService amazonApiService) {
        this.amazonApiService = amazonApiService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        if (keyword == null || keyword.isEmpty()) {
            return ResponseEntity.badRequest().body("El parámetro 'keyword' es obligatorio.");
        }

        String response = amazonApiService.searchProducts(keyword);
        return ResponseEntity.ok(response);
    }
}