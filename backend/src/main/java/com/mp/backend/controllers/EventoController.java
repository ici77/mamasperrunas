package com.mp.backend.controllers;

import com.mp.backend.models.Evento;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.UsuarioEvento;
import com.mp.backend.services.EventoService;
import com.mp.backend.services.UsuarioEventoService;
import com.mp.backend.repositories.UsuarioRepository;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @GetMapping
    public ResponseEntity<List<Evento>> listarEventos() {
        return ResponseEntity.ok(eventoService.obtenerTodosLosEventos());
    }

   @GetMapping("/{id}")
public ResponseEntity<?> obtenerEventoPorId(@PathVariable Long id) {
    Optional<Evento> eventoOpt = eventoService.obtenerEventoPorId(id);

    if (eventoOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Evento evento = eventoOpt.get();

    // 👤 Intentar obtener el usuario autenticado
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

    if (usuarioOpt.isPresent()) {
        Usuario usuario = usuarioOpt.get();
        boolean yaInscrito = usuarioEventoService.estaInscrito(usuario, evento);
        evento.setYaInscrito(yaInscrito); // ✅ Actualiza el evento con el estado de inscripción
    }

    return ResponseEntity.ok(evento);
}

@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<?> crearEventoConImagen(
    @RequestPart("evento") Evento evento,
    @RequestPart(value = "imagen", required = false) MultipartFile imagen
) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

    if (usuarioOpt.isEmpty()) {
        return ResponseEntity.status(403).body("Usuario no autorizado");
    }

    Usuario usuario = usuarioOpt.get();
    evento.setUsuario(usuario);

    // Guardar imagen si existe
    if (imagen != null && !imagen.isEmpty()) {
        try {
            String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

            // 📁 Ruta absoluta: dentro del proyecto/backend/uploads
            String rutaCarpeta = System.getProperty("user.dir") + File.separator + "uploads";
            File carpeta = new File(rutaCarpeta);
            if (!carpeta.exists()) carpeta.mkdirs();

            // 📄 Ruta completa del archivo a guardar
            String rutaArchivo = rutaCarpeta + File.separator + nombreArchivo;
            imagen.transferTo(new File(rutaArchivo));

            // Guarda la ruta relativa para usarla en el frontend si es necesario
            evento.setImagenUrl("uploads/" + nombreArchivo);
        } catch (IOException | IllegalStateException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al guardar imagen");
        }
    }

    Evento guardado = eventoService.guardarEvento(evento);
    return ResponseEntity.ok(guardado);
}



    @PostMapping("/{id}/apuntarse")
    public ResponseEntity<?> apuntarseAEvento(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("error", "Usuario no encontrado"));
        }

        Usuario usuario = usuarioOptional.get();
        Optional<Evento> eventoOptional = eventoService.obtenerEventoPorId(id);

        if (eventoOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Evento evento = eventoOptional.get();

        boolean yaInscrito = usuarioEventoService.estaInscrito(usuario, evento);
        if (yaInscrito) {
            return ResponseEntity.ok(Map.of("mensaje", "ℹ️ Ya estabas apuntado a este evento.", "yaInscrito", true));
        }

        usuarioEventoService.apuntarseAEvento(usuario, evento);

        return ResponseEntity.ok(Map.of("mensaje", "✅ Te has apuntado al evento correctamente.", "yaInscrito", true));
    }

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

        return ResponseEntity.ok(Map.of("resumen", resumen, "total", total, "nombres", nombres));
    }

    @GetMapping("/destacados")
    public ResponseEntity<List<Evento>> obtenerEventosDestacados() {
        List<Evento> destacados = eventoService.obtenerEventosDestacados();

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            for (Evento evento : destacados) {
                boolean yaInscrito = usuarioEventoService.estaInscrito(usuario, evento);
                evento.setYaInscrito(yaInscrito);
            }
        }

        return ResponseEntity.ok(destacados);
    }

    @PostMapping("/upload-imagen")
    public ResponseEntity<?> subirImagen(@RequestParam("file") MultipartFile file) {
        try {
            String nombreArchivo = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String ruta = "uploads/" + nombreArchivo;

            File carpeta = new File("uploads");
            if (!carpeta.exists()) carpeta.mkdirs();

            file.transferTo(new File(ruta));
            return ResponseEntity.ok(Map.of("url", ruta));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al subir imagen"));
        }
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
public ResponseEntity<List<Evento>> buscarEventos(
    @RequestParam(required = false) String tipo,
    @RequestParam(required = false) String pago,
    @RequestParam(required = false) Boolean destacado
) {
    List<Evento> eventos = eventoService.buscarEventosAvanzado(tipo, pago, destacado);

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

    if (usuarioOpt.isPresent()) {
        Usuario usuario = usuarioOpt.get();
        for (Evento evento : eventos) {
            boolean yaInscrito = usuarioEventoService.estaInscrito(usuario, evento);
            evento.setYaInscrito(yaInscrito);

            
        }
    }

    return ResponseEntity.ok(eventos);
}


    @GetMapping("/apuntados")
    public ResponseEntity<Map<Long, Integer>> obtenerConteoApuntados() {
        return ResponseEntity.ok(eventoService.contarUsuariosPorEvento());
    }
}
