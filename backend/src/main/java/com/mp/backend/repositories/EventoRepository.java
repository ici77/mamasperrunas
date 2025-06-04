package com.mp.backend.repositories;

import com.mp.backend.models.Evento;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.UsuarioEvento;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * 📌 Repositorio de eventos
 *
 * Este repositorio extiende JpaRepository y permite realizar operaciones CRUD
 * sobre la entidad Evento sin necesidad de escribir código SQL manualmente.
 *
 * 🔹 Métodos disponibles automáticamente:
 * - findAll() → Obtener todos los eventos.
 * - findById(id) → Buscar un evento por ID.
 * - save(evento) → Guardar o actualizar un evento.
 * - deleteById(id) → Eliminar un evento por ID.
 */
@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
   List<Evento> findByDestacadoTrue();
   List<Evento> findByTipoEventoIgnoreCase(String tipoEvento);
   List<Evento> findByTipoEventoIgnoreCaseAndDestacadoTrue(String tipoEvento);
   List<Evento> findByEsDePago(boolean esDePago);
   
// Búsqueda combinada opcional (para buscador avanzado)
List<Evento> findByTipoEventoIgnoreCaseAndEsDePagoAndDestacado(
    String tipoEvento, boolean esDePago, boolean destacado
);


List<Evento> findByUsuario(Usuario usuario); 



@Query("SELECT e FROM Evento e " +
       "WHERE (:tipoEvento IS NULL OR LOWER(e.tipoEvento) = LOWER(:tipoEvento)) " +
       "AND (:esDePago IS NULL OR e.esDePago = :esDePago) " +
       "AND (:destacado IS NULL OR e.destacado = :destacado)")
List<Evento> buscarEventosAvanzado(@Param("tipoEvento") String tipoEvento,
                                    @Param("esDePago") Boolean esDePago,
                                    @Param("destacado") Boolean destacado);


}
