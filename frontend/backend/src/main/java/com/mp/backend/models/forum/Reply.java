package com.mp.backend.models.forum;

import com.mp.backend.models.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * 📌 Representa una respuesta a un post en el foro.
 */
@Entity
@Getter
@Setter
@Schema(description = "Entidad que representa una respuesta a un post dentro del foro.")
public class Reply {

    /** Identificador único de la respuesta */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único de la respuesta", example = "1")
    private Long id;

    /** Contenido de la respuesta */
    @Column(nullable = false, length = 500)
    @Schema(description = "Contenido de la respuesta (máximo 500 caracteres)", example = "Estoy de acuerdo con este tema...")
    private String content;

    /** Post al que pertenece esta respuesta */
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @Schema(description = "Post al que pertenece esta respuesta")
    private Post post;

    /** Usuario que escribió la respuesta */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "Usuario que creó la respuesta")
    private Usuario user;

    /** 📌 Número de 'Me gusta' en la respuesta */
    @Schema(description = "Número de 'Me gusta' recibidos", example = "10")
    private int upvotes = 0;

    /** 📌 Número de 'No me gusta' en la respuesta */
    @Schema(description = "Número de 'No me gusta' recibidos", example = "2")
    private int downvotes = 0;

    /** 📌 Número de veces que la respuesta ha sido reportada */
    @Schema(description = "Número de denuncias recibidas", example = "1")
    private int reports = 0;

    /** 📌 Usuarios que han denunciado esta respuesta para evitar múltiples denuncias */
    @ManyToMany
    @JoinTable(
        name = "reported_replies",
        joinColumns = @JoinColumn(name = "reply_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Schema(description = "Usuarios que han denunciado esta respuesta")
    private Set<Usuario> reportedByUsers = new HashSet<>();

    /** Fecha y hora de creación de la respuesta */
    @Column(nullable = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Schema(description = "Fecha de creación de la respuesta", example = "2024-03-01T14:00:00")
    private LocalDateTime createdAt = LocalDateTime.now();
}
