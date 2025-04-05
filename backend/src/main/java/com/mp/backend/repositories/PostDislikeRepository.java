package com.mp.backend.repositories;

import com.mp.backend.models.forum.PostDislike;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostDislikeRepository extends JpaRepository<PostDislike, Long> {

    Optional<PostDislike> findByUserAndPost(Usuario user, Post post);

    boolean existsByUserAndPost(Usuario user, Post post);

    long countByPost(Post post);

    void deleteByUserAndPost(Usuario user, Post post);
}
