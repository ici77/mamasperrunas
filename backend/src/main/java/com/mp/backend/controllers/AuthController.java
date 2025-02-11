package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import com.mp.backend.utils.JwtTokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthController(AuthService authService, JwtTokenUtil jwtTokenUtil) {
        this.authService = authService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    /**
     * Endpoint para registrar un nuevo usuario.
     */
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario registeredUser = authService.registerUser(usuario);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * Endpoint para iniciar sesión con email y contraseña.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Usuario usuario) {
        return authService.authenticate(usuario.getEmail(), usuario.getPassword())
                .map(user -> {
                    // Generar el token JWT
                    String token = jwtTokenUtil.generateToken(user);
                    
                    // Crear un mapa para devolver el token en formato JSON
                    Map<String, String> response = new HashMap<>();
                    response.put("token", "Bearer " + token);
                    
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Credenciales inválidas");
                    return ResponseEntity.status(401).body(errorResponse);
                });
    }
}
