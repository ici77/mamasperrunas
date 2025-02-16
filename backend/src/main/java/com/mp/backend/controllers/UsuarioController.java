package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.services.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

/**
 * 📌 **Controlador UsuarioController**
 *
 * Este controlador maneja las operaciones relacionadas con los usuarios, como su registro y prueba de conexión.
 *
 * 🔹 **Endpoints Disponibles:**
 * - `POST /api/usuarios/registro` → Registra un nuevo usuario.
 * - `GET /api/usuarios` → Endpoint de prueba.
 *
 * 🔹 **Dependencias:**
 * - `UsuarioService`: Servicio para manejar la lógica de negocio relacionada con usuarios.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    /**
     * 🔹 **Constructor del controlador**
     *
     * @param usuarioService Servicio para manejar la lógica de los usuarios.
     */
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * 📌 **Registrar un nuevo usuario**
     *
     * 🔹 **Endpoint:** `POST /api/usuarios/registro`
     * 
     * - Recibe un objeto `Usuario` validado.
     * - Llama al servicio `UsuarioService` para registrarlo en la base de datos.
     * - Maneja excepciones en caso de que el email ya esté registrado o si ocurre un error interno.
     *
     * @param usuario Objeto `Usuario` con los datos de registro.
     * @param result Objeto `BindingResult` para manejar validaciones de entrada.
     * @return `ResponseEntity<String>` con un mensaje de éxito o error en formato JSON.
     */
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
        return ResponseEntity.ok("Endpoint de prueba alcanzado correctamente");
    }
}
