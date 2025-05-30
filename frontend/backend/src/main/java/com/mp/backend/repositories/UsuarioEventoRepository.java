package com.mp.backend.repositories;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.Evento;
import com.mp.backend.models.UsuarioEvento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 📌 Repositorio `UsuarioEventoRepository`
 *
 * Permite acceder a las inscripciones de usuarios a eventos.
 */
@Repository
public interface UsuarioEventoRepository extends JpaRepository<UsuarioEvento, Long> {

    /**
     * Buscar si un usuario está apuntado a un evento específico.
     * @param usuario usuario
     * @param evento evento
     * @return inscripción existente si la hay
     */
    Optional<UsuarioEvento> findByUsuarioAndEvento(Usuario usuario, Evento evento);

    /**
     * Obtener todos los registros de usuarios apuntados a un evento.
     * @param evento evento
     * @return lista de inscripciones
     */
    List<UsuarioEvento> findByEvento(Evento evento);

    /**
     * Obtener todos los eventos a los que está inscrito un usuario.
     * @param usuario usuario
     * @return lista de inscripciones
     */
    List<UsuarioEvento> findByUsuario(Usuario usuario);

    /**
     * Contar cuántos usuarios hay apuntados a cada evento.
     * @return lista de pares (id del evento, número de usuarios apuntados)
     */
    @Query("SELECT ue.evento.id, COUNT(ue) FROM UsuarioEvento ue GROUP BY ue.evento.id")
    List<Object[]> contarUsuariosPorEvento();
}
