package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping(value = "/registro", produces = "application/json")
   public ResponseEntity<String> registrarUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
        try {
            usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok().body("{\"mensaje\": \"Usuario registrado exitosamente\"}");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"El email ya está registrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Ocurrió un error al registrar el usuario.\"}");
        }
    }
    
    
    
     // Método de prueba para verificar el endpoint
     @GetMapping
     public ResponseEntity<String> pruebaEndpoint() {
         return ResponseEntity.ok("Endpoint de prueba alcanzado correctamente");
     }
}
