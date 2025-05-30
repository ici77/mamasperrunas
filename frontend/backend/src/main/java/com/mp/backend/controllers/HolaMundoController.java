package com.mp.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HolaMundoController {

    @GetMapping("/holamundo")
    public String saludar() {
        return "¡Hola mundo desde Railway!";
    }
}
