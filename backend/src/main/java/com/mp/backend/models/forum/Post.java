package com.mp.backend.models.forum;

import com.mp.backend.models.Usuario; // 🔹 Importa la entidad correcta
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

/**
 * Representa un post dentro de una categoría del foro.
 */
@Entity
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String content;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // 🔹 Usando "Usuario" en lugar de "User"
    private Usuario user; // Cambiado a "Usuario"

    private int upvotes = 0;
    private int downvotes = 0;
    private int favorites = 0;
    private int reports = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
