package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

import jakarta.validation.Valid;

/**
 * 📌 **Controlador de Usuarios (`UsuarioController`)**
 *
 * Maneja el registro de usuarios y endpoints de prueba.
 *
 * 🔹 **Endpoints:**
 * - `POST /api/usuarios/registro` → Registra un nuevo usuario con contraseña encriptada.
 * - `GET /api/usuarios` → Endpoint de prueba.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final AuthService authService;  // 🔥 Cambio de UsuarioService a AuthService

    /**
     * 🔹 **Constructor del controlador**
     *
     * @param authService Servicio de autenticación para manejar el registro.
     */
    public UsuarioController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     *
     * 🔹 **Endpoint:** `POST /api/usuarios/registro`
     *
     * - Recibe un objeto `Usuario` validado.
     * - Llama a `AuthService` para registrarlo con contraseña encriptada.
     * - Maneja excepciones en caso de email duplicado o errores en la base de datos.
     *
     * @param usuario Objeto `Usuario` con los datos de registro.
     * @param result Objeto `BindingResult` para manejar validaciones.
     * @return `ResponseEntity<String>` con mensaje de éxito o error.
     */
    @PostMapping(value = "/registro", produces = "application/json")
    public ResponseEntity<String> registrarUsuario(@Valid @RequestBody Usuario usuario, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Datos inválidos. Verifica los campos.\"}");
        }

        try {
            authService.registerUser(usuario);  // 🔥 Ahora usa AuthService para encriptar la contraseña
            return ResponseEntity.ok().body("{\"mensaje\": \"Usuario registrado exitosamente\"}");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"El email ya está registrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Error al registrar el usuario.\"}");
        }
    }

    /**
     * 📌 **Endpoint de prueba**
     *
     * 🔹 **Endpoint:** `GET /api/usuarios`
     *
     * - Permite verificar si el controlador está funcionando correctamente.
     *
     * @return `ResponseEntity<String>` con un mensaje de confirmación.
     */
    @GetMapping
    public ResponseEntity<String> pruebaEndpoint() {
        return ResponseEntity.ok("✅ Endpoint de prueba alcanzado correctamente");
    }
}
