package com.mp.backend;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // Indica que esta clase es un controlador REST
public class HolaMundoController {

    @GetMapping("/api/hola") // Mapeo para la ruta /api/hola
    public String holaMundo() {
        return "¡Hola Mundo desde el backend!";
    }
}
