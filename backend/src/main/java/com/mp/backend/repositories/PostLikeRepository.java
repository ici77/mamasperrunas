package com.mp.backend.repositories;

import com.mp.backend.models.forum.PostLike;
import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    Optional<PostLike> findByUserAndPost(Usuario user, Post post);

    long countByPost(Post post);

    boolean existsByUserAndPost(Usuario user, Post post);

    void deleteByUserAndPost(Usuario user, Post post);
}