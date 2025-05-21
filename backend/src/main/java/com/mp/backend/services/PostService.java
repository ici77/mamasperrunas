package com.mp.backend.services;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.repositories.PostRepository;
import com.mp.backend.repositories.UsuarioRepository;
import com.mp.backend.models.forum.Category;
import com.mp.backend.repositories.CategoryRepository;
import java.util.Collections;

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
private CategoryRepository categoryRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    public Category getCategoryById(Long categoryId) {
    return categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + categoryId));
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

   public void addToFavorites(Long postId, Usuario usuario) {
    Optional<Post> optionalPost = postRepository.findById(postId);

    if (optionalPost.isPresent()) {
        Post post = optionalPost.get();

        // 🔍 Verificar si ya ha sido añadido por este usuario
        if (!post.getUsuariosQueLoGuardaron().contains(usuario)) {
            post.getUsuariosQueLoGuardaron().add(usuario);
            post.setFavorites(post.getFavorites() + 1);
            postRepository.save(post);
        }
    }
}
public void quitarDeFavoritos(Long postId, Usuario usuario) {
    Post post = postRepository.findById(postId).orElseThrow();
    post.getUsuariosQueLoGuardaron().remove(usuario);
    postRepository.save(post);
}

public void quitarReporte(Long postId, Usuario usuario) {
    Post post = postRepository.findById(postId).orElseThrow();
    post.getReportedByUsers().remove(usuario); // ✅ nombre correcto del getter
    postRepository.save(post);
}





    public boolean reportPost(Long postId, Usuario usuario) {
    Optional<Post> optionalPost = postRepository.findById(postId);

    if (optionalPost.isPresent()) {
        Post post = optionalPost.get();

        if (post.getReportedByUsers().contains(usuario)) {
            return false; // Ya denunciado
        }

        post.getReportedByUsers().add(usuario);
        post.setReports(post.getReports() + 1);
        postRepository.save(post);
        return true;
    }

    return false;
}


    

    public List<Post> getRandomPostsByCategory(String categoryName, int limit) {
        List<Post> posts = postRepository.findByCategory_Name(categoryName);
        Collections.shuffle(posts);
        return posts.stream().limit(limit).collect(Collectors.toList());
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
