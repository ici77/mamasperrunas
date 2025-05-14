package com.mp.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * 📌 Entidad `UsuarioEvento`
 *
 * Representa la inscripción de un usuario a un evento.
 * Actúa como tabla intermedia en una relación muchos-a-muchos entre Usuario y Evento.
 *
 * 🔹 Incluye la fecha de inscripción.
 */
@Entity
@Table(name = "usuario_evento", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "evento_id"}) // evitar duplicados
})
public class UsuarioEvento {

    /**
     * ID autogenerado para la relación.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Usuario que se apunta al evento.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /**
     * Evento al que se apunta el usuario.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;

    /**
     * Fecha y hora en que el usuario se apuntó al evento.
     */
    private LocalDateTime fechaInscripcion;

    // 🔽 Constructor vacío
    public UsuarioEvento() {}

    // 🔽 Constructor personalizado
    public UsuarioEvento(Usuario usuario, Evento evento) {
        this.usuario = usuario;
        this.evento = evento;
        this.fechaInscripcion = LocalDateTime.now();
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public LocalDateTime getFechaInscripcion() {
        return fechaInscripcion;
    }

    public void setFechaInscripcion(LocalDateTime fechaInscripcion) {
        this.fechaInscripcion = fechaInscripcion;
    }
}
