package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.Evento;
import com.mp.backend.models.UsuarioEvento;
import com.mp.backend.repositories.UsuarioEventoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 📌 Servicio `UsuarioEventoService`
 *
 * Maneja la lógica de inscripción de usuarios a eventos.
 * 
 * 🔹 Funciones:
 * - Apuntar a un usuario a un evento si no está inscrito
 * - Obtener lista de asistentes a un evento
 */
@Service
public class UsuarioEventoService {

    private final UsuarioEventoRepository usuarioEventoRepository;

    public UsuarioEventoService(UsuarioEventoRepository usuarioEventoRepository) {
        this.usuarioEventoRepository = usuarioEventoRepository;
    }

    /**
     * 📌 Inscribe a un usuario a un evento si aún no está apuntado.
     *
     * @param usuario usuario autenticado
     * @param evento evento al que se desea apuntar
     * @return inscripción nueva o existente
     */
    public UsuarioEvento apuntarseAEvento(Usuario usuario, Evento evento) {
        Optional<UsuarioEvento> existente = usuarioEventoRepository.findByUsuarioAndEvento(usuario, evento);

        return existente.orElseGet(() -> {
            UsuarioEvento nuevo = new UsuarioEvento(usuario, evento);
            return usuarioEventoRepository.save(nuevo);
        });
    }

    /**
     * 📌 Obtener todos los usuarios apuntados a un evento.
     *
     * @param evento evento
     * @return lista de `UsuarioEvento` que representan a los asistentes
     */
    public List<UsuarioEvento> obtenerAsistentesPorEvento(Evento evento) {
        return usuarioEventoRepository.findByEvento(evento);
    }

    /**
     * 📌 Verifica si un usuario ya está apuntado a un evento.
     *
     * @param usuario usuario autenticado
     * @param evento evento
     * @return true si ya está inscrito, false si no
     */
    public boolean estaInscrito(Usuario usuario, Evento evento) {
        return usuarioEventoRepository.findByUsuarioAndEvento(usuario, evento).isPresent();
    }
}
