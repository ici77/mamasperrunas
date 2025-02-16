package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import com.mp.backend.utils.JwtTokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 📌 **Controlador de Autenticación (`AuthController`)**
 *
 * Este controlador maneja la autenticación y el registro de usuarios en el sistema.
 * Incluye endpoints para registrar usuarios y autenticarse con credenciales.
 *
 * 🔹 **Endpoints:**
 * - `/auth/register`: Registrar un nuevo usuario.
 * - `/auth/login`: Iniciar sesión y obtener un token JWT.
 *
 * 🔹 **Dependencias:**
 * - `AuthService`: Servicio de autenticación y gestión de usuarios.
 * - `JwtTokenUtil`: Utilidad para generar tokens JWT.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;

    /**
     * 🔹 **Constructor del controlador**
     *
     * @param authService Servicio para manejar la autenticación y registro.
     * @param jwtTokenUtil Utilidad para generar y validar tokens JWT.
     */
    public AuthController(AuthService authService, JwtTokenUtil jwtTokenUtil) {
        this.authService = authService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     *
     * 🔹 Endpoint: **POST** `/auth/register`
     * 
     * @param usuario Objeto `Usuario` con los datos de registro.
     * @return `ResponseEntity<Usuario>` con el usuario registrado.
     */
    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody Usuario usuario) {
        Usuario registeredUser = authService.registerUser(usuario);
        return ResponseEntity.ok(registeredUser);
    }

    /**
     * 📌 **Iniciar sesión y obtener un token JWT**
     *
     * 🔹 Endpoint: **POST** `/auth/login`
     * 
     * - Verifica las credenciales del usuario.
     * - Si son correctas, genera y devuelve un **token JWT**.
     * - Si son incorrectas, devuelve un error **401 - Unauthorized**.
     *
     * @param usuario Objeto `Usuario` con email y contraseña.
     * @return `ResponseEntity<Map<String, String>>` con el token o mensaje de error.
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
