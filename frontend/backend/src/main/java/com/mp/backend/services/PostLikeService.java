package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.models.forum.PostLike;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.repositories.PostLikeRepository;
import com.mp.backend.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PostLikeService {

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Añade o elimina un like según si ya existe, y actualiza el contador.
     */
    public boolean toggleLike(Long postId, Long userId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        Optional<Usuario> userOpt = usuarioRepository.findById(userId);

        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            throw new RuntimeException("Post o usuario no encontrado");
        }

        Post post = postOpt.get();
        Usuario user = userOpt.get();

        Optional<PostLike> existingLike = postLikeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            // Ya había dado like: lo quitamos
            postLikeRepository.delete(existingLike.get());
            post.setUpvotes(post.getUpvotes() - 1);
            postRepository.save(post);
            return false; // ya no tiene like
        } else {
            // No había dado like: lo agregamos
            PostLike like = new PostLike();
            like.setUser(user);
            like.setPost(post);
            postLikeRepository.save(like);
            post.setUpvotes(post.getUpvotes() + 1);
            postRepository.save(post);
            return true; // ahora tiene like
        }
    }

    public int getTotalLikes(Long postId) {
        return (int) postLikeRepository.countByPost(
            postRepository.findById(postId).orElseThrow()
        );
    }

    public boolean hasUserLiked(Long postId, Long userId) {
        return postLikeRepository.existsByUserAndPost(
            usuarioRepository.findById(userId).orElseThrow(),
            postRepository.findById(postId).orElseThrow()
        );
    }
}