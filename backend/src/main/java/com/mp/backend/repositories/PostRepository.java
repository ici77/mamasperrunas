package com.mp.backend.repositories;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    
    /**
     * Obtiene los posts de un usuario específico.
     */
    List<Post> findByUserId(Long userId);
    // Posts creados por el usuario (preferible usar Usuario completo, no solo ID)
List<Post> findByUser(Usuario usuario);

// Posts con like del usuario
List<Post> findByUsuariosQueDieronLikeContaining(Usuario usuario);

// Posts favoritos del usuario
List<Post> findByUsuariosQueLoGuardaronContaining(Usuario usuario);

    /**
     * 📌 Obtiene los posts de una categoría específica.
     */
    List<Post> findByCategory_Name(String categoryName);

    Page<Post> findTopByOrderByCreatedAtDesc(Pageable pageable);

    
    // Buscar posts por nombre de la categoría con paginación
    Page<Post> findByCategory_Name(String category, Pageable pageable);

}
