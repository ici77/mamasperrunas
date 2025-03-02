package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.validation.Valid;
import java.util.Map;

/**
 * 📌 **Controlador de Usuarios (`UsuarioController`)**
 *
 * Maneja el registro de usuarios y la autenticación de login.
 *
 * 🔹 **Endpoints:**
 * - `POST /api/usuarios/registro` → Registra un nuevo usuario con contraseña encriptada.
 * - `POST /api/usuarios/login` → Autentica un usuario y devuelve un token JWT.
 * - `GET /api/usuarios` → Endpoint de prueba.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final AuthService authService;

    /**
     * 🔹 **Constructor del controlador**
     *
     * @param authService Servicio de autenticación para manejar registro y login.
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
            authService.registerUser(usuario); // ✅ Registro con contraseña encriptada
            return ResponseEntity.ok().body("{\"mensaje\": \"Usuario registrado exitosamente\"}");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"El email ya está registrado.\"}");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"Error al registrar el usuario.\"}");
        }
    }

    /**
     * 📌 **Iniciar sesión (Autenticación)**
     *
     * 🔹 **Endpoint:** `POST /api/usuarios/login`
     *
     * - Busca al usuario por email.
     * - Compara la contraseña encriptada con la ingresada.
     * - Si es correcta, genera y devuelve un token JWT.
     * - Si falla, devuelve un mensaje de error.
     *
     * @param request JSON con `email` y `password`.
     * @return `ResponseEntity<String>` con el token JWT o mensaje de error.
     */
    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<String> iniciarSesion(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email y contraseña son obligatorios\"}");
        }

        return authService.authenticate(email, password)
                .map(token -> ResponseEntity.ok("{\"token\": \"" + token + "\"}"))
                .orElseGet(() -> ResponseEntity.status(403).body("{\"error\": \"Credenciales inválidas\"}"));
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
