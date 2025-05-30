package com.mp.backend.models.forum;

import com.mp.backend.models.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 📌 Representa un post dentro de una categoría del foro.
 */
@Entity
@Getter
@Setter
@Schema(description = "Entidad que representa un post dentro de una categoría del foro.")
public class Post {

    /** Identificador único del post */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único del post", example = "1")
    private Long id;

    /** Título del post */
    @Column(nullable = false)
    @Schema(description = "Título del post", example = "Cómo entrenar a un cachorro")
    private String title;

    /** Contenido del post */
    @Column(nullable = false, length = 500)
    @Schema(description = "Contenido del post (máximo 500 caracteres)", example = "Aquí te explico cómo entrenar a un cachorro de forma efectiva...")
    private String content;

    /** Categoría a la que pertenece el post */
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @Schema(description = "Categoría a la que pertenece el post")
    private Category category;

    /** Usuario que creó el post */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @Schema(description = "Usuario que creó el post")
    private Usuario user;

    @ManyToMany
@JoinTable(
    name = "post_likes",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@Schema(description = "Usuarios que han dado 'Me gusta' al post")
private Set<Usuario> usuariosQueDieronLike = new HashSet<>();

@ManyToMany
@JoinTable(
    name = "post_dislikes",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@Schema(description = "Usuarios que han dado 'No me gusta' al post")
private Set<Usuario> usuariosQueDieronDislike = new HashSet<>();


    /** 📌 Usuarios que han guardado este post como favorito */
@ManyToMany
@JoinTable(
    name = "favoritos_posts",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@Schema(description = "Usuarios que han añadido este post a favoritos")
private Set<Usuario> usuariosQueLoGuardaron = new HashSet<>();


    /** Número de 'Me gusta' en el post */
    @Schema(description = "Número de 'Me gusta' recibidos", example = "15")
    private int upvotes = 0;

    /** Número de 'No me gusta' en el post */
    @Schema(description = "Número de 'No me gusta' recibidos", example = "3")
    private int downvotes = 0;

    /** Número de veces que el post ha sido guardado como favorito */
    @Schema(description = "Número de veces que el post ha sido guardado en favoritos", example = "5")
    private int favorites = 0;

    /** Número de veces que el post ha sido reportado por usuarios */
    @Schema(description = "Número de denuncias recibidas", example = "2")
    private int reports = 0;

    /** 📌 Nueva funcionalidad: Almacena los usuarios que han denunciado este post para evitar duplicados */
    @ManyToMany
    @JoinTable(
        name = "reported_posts",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Schema(description = "Usuarios que han denunciado este post")
    private Set<Usuario> reportedByUsers = new HashSet<>();

    
   /** 📌 Imagen única asociada al post */
@Schema(description = "URL de la imagen asociada al post")
private String imagenUrl;

    /** 📌 Nueva funcionalidad: Sistema de etiquetas (tags) para mejorar la búsqueda y clasificación */
    @ElementCollection
    @Schema(description = "Etiquetas asociadas al post")
    private Set<String> tags = new HashSet<>();

    /** Fecha y hora de creación del post */
    @Column(nullable = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @Schema(description = "Fecha de creación del post", example = "2024-03-01T12:30:00")
    private LocalDateTime createdAt = LocalDateTime.now();
}
