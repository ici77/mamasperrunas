package com.mp.backend.repositories;

import com.mp.backend.models.forum.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ReplyRepository extends JpaRepository<Reply, Long> {

    /**
     * 📌 Obtiene todas las respuestas de un post específico.
     */
    List<Reply> findByPostId(Long postId);
    /**
     * 📌 Obtiene todas las respuestas de un post con paginación.
     */
    Page<Reply> findByPostId(Long postId, Pageable pageable);
}
