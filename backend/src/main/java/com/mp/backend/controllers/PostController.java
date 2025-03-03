package com.mp.backend.controllers;

import com.mp.backend.models.forum.Post;
import com.mp.backend.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 📌 API REST para gestionar los posts del foro.
 */
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Habilita CORS para permitir llamadas desde el frontend
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * 📌 Obtiene todos los posts de una categoría con paginación.
     *
     * @param category Nombre de la categoría.
     * @param page Número de página (por defecto 0).
     * @param size Tamaño de la página (por defecto 10).
     * @return Página de posts de la categoría.
     */
    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<Page<Post>> getPaginatedPosts(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Post> posts = postService.getPaginatedPosts(category, page, size);

        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content si no hay posts
        }

        return ResponseEntity.ok(posts); // 200 OK con los posts
    }
}
