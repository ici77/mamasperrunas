package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.models.forum.PostDislike;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.repositories.PostDislikeRepository;
import com.mp.backend.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostDislikeService {

    @Autowired
    private PostDislikeRepository postDislikeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Añade o elimina un "No me gusta" según si ya existe.
     * Devuelve true si se añadió, false si se eliminó.
     */
    public boolean toggleDislike(Long postId, Long userId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        Optional<Usuario> userOpt = usuarioRepository.findById(userId);

        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            throw new RuntimeException("Post o usuario no encontrado");
        }

        Post post = postOpt.get();
        Usuario user = userOpt.get();

        Optional<PostDislike> existingDislike = postDislikeRepository.findByUserAndPost(user, post);

        if (existingDislike.isPresent()) {
            // Ya había dado dislike: lo quitamos
            postDislikeRepository.delete(existingDislike.get());
            return false;
        } else {
            // No había dado dislike: lo agregamos
            PostDislike dislike = new PostDislike();
            dislike.setUser(user);
            dislike.setPost(post);
            postDislikeRepository.save(dislike);
            return true;
        }
    }

    /**
     * Devuelve el número total de "No me gusta" de un post.
     */
    public int getTotalDislikes(Long postId) {
        return (int) postDislikeRepository.countByPost(
            postRepository.findById(postId).orElseThrow()
        );
    }

    /**
     * Indica si un usuario ya dio "No me gusta" a un post.
     */
    public boolean hasUserDisliked(Long postId, Long userId) {
        return postDislikeRepository.existsByUserAndPost(
            usuarioRepository.findById(userId).orElseThrow(),
            postRepository.findById(postId).orElseThrow()
        );
    }
}
