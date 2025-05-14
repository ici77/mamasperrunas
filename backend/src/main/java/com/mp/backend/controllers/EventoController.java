package com.mp.backend.controllers;

import com.mp.backend.models.Evento;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.UsuarioEvento;
import com.mp.backend.services.EventoService;
import com.mp.backend.services.UsuarioEventoService;
import com.mp.backend.repositories.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 📌 Controlador `EventoController`
 *
 * Maneja las solicitudes HTTP relacionadas con los eventos.
 */
@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService eventoService;
    private final UsuarioEventoService usuarioEventoService;
    private final UsuarioRepository usuarioRepository;

    public EventoController(EventoService eventoService,
                            UsuarioEventoService usuarioEventoService,
                            UsuarioRepository usuarioRepository) {
        this.eventoService = eventoService;
        this.usuarioEventoService = usuarioEventoService;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * 📌 Obtener todos los eventos.
     * 🔹 Endpoint: GET /api/eventos
     */
    @GetMapping
    public ResponseEntity<List<Evento>> listarEventos() {
        return ResponseEntity.ok(eventoService.obtenerTodosLosEventos());
    }

    /**
     * 📌 Obtener un evento por su ID.
     * 🔹 Endpoint: GET /api/eventos/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerEventoPorId(@PathVariable Long id) {
        return eventoService.obtenerEventoPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 📌 Crear un nuevo evento.
     * 🔹 Endpoint: POST /api/eventos
     * 🔐 Requiere autenticación
     */
    @PostMapping
    public ResponseEntity<Evento> crearEvento(@RequestBody Evento evento) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Usuario)) {
            return ResponseEntity.status(403).build();
        }

        Evento nuevoEvento = eventoService.guardarEvento(evento);
        return ResponseEntity.ok(nuevoEvento);
    }

    /**
     * 📌 Apuntar al usuario autenticado a un evento.
     * 🔹 Endpoint: POST /api/eventos/{id}/apuntarse
     * 🔐 Requiere autenticación
     */
    @PostMapping("/{id}/apuntarse")
    public ResponseEntity<?> apuntarseAEvento(@PathVariable Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof Usuario)) {
            return ResponseEntity.status(403).body("No autorizado");
        }

        Usuario usuario = (Usuario) principal;

        Optional<Evento> eventoOptional = eventoService.obtenerEventoPorId(id);
        if (eventoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evento evento = eventoOptional.get();
        usuarioEventoService.apuntarseAEvento(usuario, evento);

        return ResponseEntity.ok("✅ Te has apuntado al evento correctamente.");
    }

    /**
     * 📌 Obtener resumen y lista completa de asistentes a un evento.
     * 🔹 Endpoint: GET /api/eventos/{id}/asistentes
     * 🔓 Público
     */
    @GetMapping("/{id}/asistentes")
    public ResponseEntity<?> obtenerResumenYListaAsistentes(@PathVariable Long id) {
        Optional<Evento> eventoOptional = eventoService.obtenerEventoPorId(id);

        if (eventoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evento evento = eventoOptional.get();

        List<UsuarioEvento> inscripciones = usuarioEventoService.obtenerAsistentesPorEvento(evento);
        List<String> nombres = inscripciones.stream()
                .map(inscripcion -> inscripcion.getUsuario().getNombre())
                .collect(Collectors.toList());

        int total = nombres.size();
        String resumen;

        if (total == 0) {
            resumen = "Nadie se ha apuntado todavía.";
        } else if (total == 1) {
            resumen = nombres.get(0) + " asistirá al evento.";
        } else if (total == 2) {
            resumen = nombres.get(0) + " y " + nombres.get(1) + " asistirán al evento.";
        } else {
            resumen = nombres.get(0) + ", " + nombres.get(1) + " y " + (total - 2) + " más asistirán al evento.";
        }

        return ResponseEntity.ok(
                Map.of(
                        "resumen", resumen,
                        "total", total,
                        "nombres", nombres
                )
        );
    }

    /**
     * 📌 Obtener eventos destacados.
     * 🔹 Endpoint: GET /api/eventos/destacados
     * 🔓 Público
     */
    @GetMapping("/destacados")
    public ResponseEntity<List<Evento>> obtenerEventosDestacados() {
        return ResponseEntity.ok(eventoService.obtenerEventosDestacados());
    }
    @GetMapping("/tipo/{tipo}")
public ResponseEntity<List<Evento>> eventosPorTipo(@PathVariable String tipo) {
    return ResponseEntity.ok(eventoService.obtenerEventosPorTipo(tipo));
}
@GetMapping("/pago/{pago}")
public ResponseEntity<List<Evento>> eventosPorPago(@PathVariable boolean pago) {
    return ResponseEntity.ok(eventoService.obtenerEventosPorPago(pago));
}
@GetMapping("/buscar")
public ResponseEntity<List<Evento>> buscarEventosAvanzado(
        @RequestParam String tipo,
        @RequestParam boolean pago,
        @RequestParam boolean destacado) {
    return ResponseEntity.ok(eventoService.buscarEventosAvanzado(tipo, pago, destacado));
}
/**
 * 📌 Obtener el número de personas apuntadas por evento (todos).
 * 🔹 Endpoint: GET /api/eventos/apuntados
 * 🔓 Público
 */
@GetMapping("/apuntados")
public ResponseEntity<Map<Long, Integer>> obtenerConteoApuntados() {
    return ResponseEntity.ok(eventoService.contarUsuariosPorEvento());
}



}
