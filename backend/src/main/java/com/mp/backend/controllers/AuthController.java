package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import com.mp.backend.utils.JwtTokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> login(@RequestBody Usuario usuario) {
        return authService.authenticate(usuario.getEmail(), usuario.getPassword())
                .map(user -> {
                    // Generar el token JWT
                    String token = jwtTokenUtil.generateToken(user);
                    return ResponseEntity.ok("Bearer " + token);
                })
                .orElseGet(() -> ResponseEntity.status(401).body("Credenciales inválidas"));
    }
}
