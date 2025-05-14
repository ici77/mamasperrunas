package com.mp.backend.services;

import com.mp.backend.models.Evento;
import com.mp.backend.repositories.EventoRepository;
import com.mp.backend.repositories.UsuarioEventoRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final UsuarioEventoRepository usuarioEventoRepository;

    // ✅ Constructor corregido
    public EventoService(EventoRepository eventoRepository, UsuarioEventoRepository usuarioEventoRepository) {
        this.eventoRepository = eventoRepository;
        this.usuarioEventoRepository = usuarioEventoRepository;
    }

    public List<Evento> obtenerTodosLosEventos() {
        return eventoRepository.findAll();
    }

    public Optional<Evento> obtenerEventoPorId(Long id) {
        return eventoRepository.findById(id);
    }

    public Evento guardarEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    public void eliminarEvento(Long id) {
        eventoRepository.deleteById(id);
    }

    public List<Evento> obtenerEventosDestacados() {
        return eventoRepository.findByDestacadoTrue();
    }

    public List<Evento> obtenerEventosPorTipo(String tipoEvento) {
        return eventoRepository.findByTipoEventoIgnoreCase(tipoEvento);
    }

    public List<Evento> obtenerEventosPorPago(boolean esDePago) {
        return eventoRepository.findByEsDePago(esDePago);
    }

    public List<Evento> buscarEventosAvanzado(String tipoEvento, boolean esDePago, boolean destacado) {
        return eventoRepository.findByTipoEventoIgnoreCaseAndEsDePagoAndDestacado(tipoEvento, esDePago, destacado);
    }

    // ✅ Conteo de apuntados por evento
    public Map<Long, Integer> contarUsuariosPorEvento() {
        List<Object[]> resultados = usuarioEventoRepository.contarUsuariosPorEvento();
        Map<Long, Integer> conteos = new HashMap<>();
        for (Object[] fila : resultados) {
            Long eventoId = (Long) fila[0];
            Long conteo = (Long) fila[1];
            conteos.put(eventoId, conteo.intValue());
        }
        return conteos;
    }
}
