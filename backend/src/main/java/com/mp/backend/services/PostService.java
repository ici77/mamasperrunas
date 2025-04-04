package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.repositories.PostRepository;
import com.mp.backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 📌 Servicio para la gestión de posts en el foro.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public boolean deletePost(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isEmpty()) return false;

        Post post = optionalPost.get();
        Usuario currentUser = getAuthenticatedUser();
        if (!post.getUser().getId().equals(currentUser.getId())) {
            return false; // No autorizado
        }

        postRepository.deleteById(postId);
        return true;
    }

    public Page<Post> getPaginatedPosts(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByCategory_Name(category, pageable);
    }

    public List<Post> getTopPostsByCategory(String category) {
        List<Post> allPosts = postRepository.findByCategory_Name(category);
        return allPosts.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getUpvotes(), p1.getUpvotes()))
                .limit(4)
                .collect(Collectors.toList());
    }

    public void upvotePost(Long postId) {
        postRepository.findById(postId).ifPresent(post -> {
            post.setUpvotes(post.getUpvotes() + 1);
            postRepository.save(post);
        });
    }

    public void downvotePost(Long postId) {
        postRepository.findById(postId).ifPresent(post -> {
            post.setDownvotes(post.getDownvotes() + 1);
            postRepository.save(post);
        });
    }

    public void addToFavorites(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Usuario currentUser = getAuthenticatedUser();

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setFavorites(post.getFavorites() + 1);
            postRepository.save(post);
        }
    }

    public boolean reportPost(Long postId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        Usuario currentUser = getAuthenticatedUser();

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();

            if (post.getReportedByUsers().contains(currentUser)) {
                return false; // Ya denunciado
            }

            post.getReportedByUsers().add(currentUser);
            post.setReports(post.getReports() + 1);
            postRepository.save(post);
            return true;
        }

        return false;
    }

    public void addImagesToPost(Long postId, List<String> images) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();

            if (post.getImageUrls().size() + images.size() > 3) {
                throw new IllegalArgumentException("Un post no puede tener más de 3 imágenes.");
            }

            post.getImageUrls().addAll(images);
            postRepository.save(post);
        }
    }

    public void addTagsToPost(Long postId, Set<String> tags) {
        Optional<Post> optionalPost = postRepository.findById(postId);

        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.getTags().addAll(tags);
            postRepository.save(post);
        }
    }

    /** ✅ Utilidad para obtener el usuario autenticado desde el SecurityContext */
    private Usuario getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));
    }
}
