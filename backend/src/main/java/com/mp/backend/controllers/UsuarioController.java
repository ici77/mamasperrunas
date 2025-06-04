package com.mp.backend.controllers;

import com.mp.backend.dto.EstadisticasDTO;
import com.mp.backend.dto.PerfilUsuarioDTO;
import com.mp.backend.models.Evento;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.UsuarioEvento;
import com.mp.backend.models.forum.Post;
import com.mp.backend.repositories.EventoRepository;
import com.mp.backend.repositories.PostRepository;
import com.mp.backend.repositories.UsuarioEventoRepository;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.services.AuthService;
import com.mp.backend.services.UsuarioService;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.*;

import javax.imageio.ImageIO;

/**
 * 📌 Controlador de Usuarios (`UsuarioController`)
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final AuthService authService;
    private final UsuarioRepository usuarioRepository;
    private final PostRepository postRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioEventoRepository usuarioEventoRepository;
    private final UsuarioService usuarioService;

   public UsuarioController(
    AuthService authService,
    UsuarioRepository usuarioRepository,
    PostRepository postRepository,
    EventoRepository eventoRepository,
    UsuarioEventoRepository usuarioEventoRepository,
    UsuarioService usuarioService // <-- añade esto
) {
    this.authService = authService;
    this.usuarioRepository = usuarioRepository;
    this.postRepository = postRepository;
    this.eventoRepository = eventoRepository;
    this.usuarioEventoRepository = usuarioEventoRepository;
    this.usuarioService = usuarioService; // <-- y asígnalo aquí
}

    // 🔐 Registrar nuevo usuario
    @PostMapping(value = "/registro", produces = "application/json")
    public ResponseEntity<String> registrarUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            authService.registerUser(usuario);
            return ResponseEntity.ok("{\"mensaje\": \"Usuario registrado exitosamente\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\": \"No se pudo registrar el usuario\"}");
        }
    }

    // 🔐 Login
    @PostMapping(value = "/login", produces = "application/json")
    public ResponseEntity<String> iniciarSesion(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email y contraseña obligatorios\"}");
        }

        return authService.authenticate(email, password)
                .map(token -> ResponseEntity.ok("{\"token\": \"" + token + "\"}"))
                .orElseGet(() -> ResponseEntity.status(403).body("{\"error\": \"Credenciales inválidas\"}"));
    }

    // 📄 Perfil de usuario autenticado
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfilUsuario() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PerfilUsuarioDTO dto = new PerfilUsuarioDTO();
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setFotoPerfil(usuario.getFotoPerfil());

        dto.setPostsCreados(postRepository.findByUser(usuario));
        dto.setPostsLike(postRepository.findByUsuariosQueDieronLikeContaining(usuario));
        dto.setPostsFavoritos(postRepository.findByUsuariosQueLoGuardaronContaining(usuario));
        dto.setEventosCreados(eventoRepository.findByUsuario(usuario));

        List<Evento> eventosInscrito = usuarioEventoRepository.findByUsuario(usuario)
                .stream().map(UsuarioEvento::getEvento).toList();
        dto.setEventosInscrito(eventosInscrito);

        EstadisticasDTO estadisticas = new EstadisticasDTO();
        estadisticas.setTotalPosts(dto.getPostsCreados().size());
        estadisticas.setTotalLikes(dto.getPostsLike().size());
        estadisticas.setTotalEventos(eventosInscrito.size());
        dto.setEstadisticas(estadisticas);

        return ResponseEntity.ok(dto);
    }

    // 📸 Subir imagen de perfil
    @PostMapping("/imagen")
    public ResponseEntity<?> subirImagenPerfil(@RequestParam("imagen") MultipartFile imagen) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        try {
            String nombreArchivo = "perfil_" + usuario.getId() + "_" + System.currentTimeMillis() + ".jpg";
            String rutaBase = "uploads/perfiles/";
            File carpeta = new File(rutaBase);
            if (!carpeta.exists()) carpeta.mkdirs();

            BufferedImage original = ImageIO.read(imagen.getInputStream());
            BufferedImage redimensionada = resizeImagen(original, 300, 300);
            File destino = new File(rutaBase + nombreArchivo);
            ImageIO.write(redimensionada, "jpg", destino);

            usuario.setFotoPerfil("/" + rutaBase + nombreArchivo);
            usuarioRepository.save(usuario);

            return ResponseEntity.ok().body("{\"mensaje\":\"Imagen actualizada\"}");
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("{\"error\":\"No se pudo procesar la imagen\"}");
        }
    }

    private BufferedImage resizeImagen(BufferedImage original, int width, int height) {
        BufferedImage redimensionada = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = redimensionada.createGraphics();
        g.drawImage(original, 0, 0, width, height, null);
        g.dispose();
        return redimensionada;
    }

    // ✅ PUT para actualizar solo el nombre
    @PutMapping("/perfil/nombre")
    public ResponseEntity<?> actualizarNombre(@RequestBody Map<String, String> payload) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> optionalUsuario = usuarioRepository.findByEmail(email);

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        Usuario usuario = optionalUsuario.get();
        String nuevoNombre = payload.get("nombre");

        if (nuevoNombre == null || nuevoNombre.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre no puede estar vacío");
        }

        usuario.setNombre(nuevoNombre.trim());
        usuarioRepository.save(usuario);

       return ResponseEntity.ok(Map.of("mensaje", "Nombre actualizado correctamente"));

    }

    @PutMapping("/cambiar-password")
public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> datos, Authentication authentication) {
    String email = authentication.getName();
    String actual = datos.get("actual");
    String nueva = datos.get("nueva");

    boolean cambiada = usuarioService.cambiarPassword(email, actual, nueva);
    if (cambiada) {
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
    } else {
        return ResponseEntity.status(400).body(Map.of("error", "La contraseña actual no es correcta"));
    }
}

@DeleteMapping("/eventos/{eventoId}/cancelar")

public ResponseEntity<?> cancelarInscripcionEvento(@PathVariable Long eventoId) {
    // 1. Obtener el email del usuario autenticado desde el token JWT
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    // 2. Buscar el evento por ID
    Optional<Evento> eventoOptional = eventoRepository.findById(eventoId);
    if (eventoOptional.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("error", "Evento no encontrado"));
    }
    Evento evento = eventoOptional.get();

    // 3. Verificar si el usuario está inscrito
    Optional<UsuarioEvento> inscripcion = usuarioEventoRepository.findByUsuarioAndEvento(usuario, evento);
    if (inscripcion.isEmpty()) {
        return ResponseEntity.status(400).body(Map.of("error", "No estás inscrito en este evento"));
    }

    // 4. Eliminar la inscripción
    usuarioEventoRepository.delete(inscripcion.get());
    return ResponseEntity.ok(Map.of("mensaje", "Inscripción cancelada correctamente"));
}




    // Test endpoint
    @GetMapping
    public ResponseEntity<String> pruebaEndpoint() {
        return ResponseEntity.ok("✅ Endpoint de prueba alcanzado correctamente");
    }
}
