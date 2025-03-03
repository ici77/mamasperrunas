package com.mp.backend.services;

import com.mp.backend.models.forum.Post;
import com.mp.backend.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    /**
     * Obtiene todos los posts sin paginación.
     */
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    /**
     * Obtiene un post por su ID.
     */
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    /**
     * Crea un nuevo post.
     */
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    /**
     * Elimina un post por su ID.
     */
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    /**
     * 📌 Obtiene posts paginados por categoría.
     */
    public Page<Post> getPaginatedPosts(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByCategory_Name(category, pageable);
    }
    
    public List<Post> getTopPostsByCategory(String category) {
        List<Post> allPosts = postRepository.findByCategory_Name(category);
    
        return allPosts.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getUpvotes(), p1.getUpvotes())) // Orden descendente
                .limit(4) // Máximo 4 posts
                .collect(Collectors.toList());
    }
}
    
