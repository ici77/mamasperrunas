package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.services.PostService;
import com.mp.backend.services.PostDislikeService;
import com.mp.backend.services.PostLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
@Tag(name = "Posts", description = "Operaciones relacionadas con los posts del foro")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @Autowired
    private PostLikeService postLikeService;

    @Autowired
    private PostDislikeService postDislikeService;

    // ----------------------- LIKE -----------------------
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            boolean liked = postLikeService.toggleLike(postId, usuario.getId());
            int totalLikes = postLikeService.getTotalLikes(postId);

            response.put("mensaje", liked ? "✅ Like añadido." : "❌ Like eliminado.");
            response.put("totalLikes", totalLikes);
            response.put("liked", liked);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("mensaje", "⚠️ No se pudo procesar el like: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    @GetMapping("/{postId}/like/{userId}")
public ResponseEntity<Boolean> hasUserLiked(@PathVariable Long postId, @PathVariable Long userId) {
    return ResponseEntity.ok(postLikeService.hasUserLiked(postId, userId));
}


    // ----------------------- DISLIKE -----------------------
    @Operation(summary = "Dar o quitar 'No me gusta' a un post", description = "Activa o desactiva el 'No me gusta' de un usuario en un post.")
    @ApiResponse(responseCode = "200", description = "Estado del dislike actualizado")
    @ApiResponse(responseCode = "404", description = "Post o usuario no encontrado")
    @PostMapping("/{postId}/dislike")
    public ResponseEntity<Map<String, Object>> toggleDislike(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();

        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            boolean disliked = postDislikeService.toggleDislike(postId, usuario.getId());
            int totalDislikes = postDislikeService.getTotalDislikes(postId);

            response.put("mensaje", disliked ? "👎 Dislike añadido." : "❌ Dislike eliminado.");
            response.put("totalDislikes", totalDislikes);
            response.put("disliked", disliked);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("mensaje", "⚠️ No se pudo procesar el dislike: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // (opcional) Para saber si un usuario ha hecho dislike (mantener si usas en frontend)
    @GetMapping("/{postId}/dislike/{userId}")
    public ResponseEntity<Boolean> hasUserDisliked(@PathVariable Long postId, @PathVariable Long userId) {
        return ResponseEntity.ok(postDislikeService.hasUserDisliked(postId, userId));
    }

    // ----------------------- CREAR POST -----------------------
    @Operation(summary = "Crear un nuevo post", description = "Permite a un usuario autenticado crear un nuevo post.")
    @ApiResponse(responseCode = "201", description = "Post creado correctamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado: Usuario no autenticado o sin permisos")
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    // ----------------------- DOWNVOTE (simple contador) -----------------------
    @Operation(summary = "Votar un post con 'No me gusta'", description = "Aumenta el contador de 'No me gusta' en el post especificado.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @PostMapping("/{postId}/downvote")
    public ResponseEntity<String> downvotePost(@PathVariable Long postId) {
        postService.downvotePost(postId);
        return ResponseEntity.ok("✅ Post votado con 'No me gusta'.");
    }

    // ----------------------- FAVORITOS -----------------------
    @PostMapping("/{postId}/favorites")
    public ResponseEntity<String> addToFavorites(@PathVariable Long postId) {
        postService.addToFavorites(postId);
        return ResponseEntity.ok("✅ Post guardado en favoritos.");
    }

    // ----------------------- REPORTAR -----------------------
    @PostMapping("/{postId}/report")
    public ResponseEntity<String> reportPost(@PathVariable Long postId) {
        boolean success = postService.reportPost(postId);
        if (success) {
            return ResponseEntity.ok("✅ Post denunciado.");
        } else {
            return ResponseEntity.status(409).body("⚠️ Ya habías denunciado este post.");
        }
    }

    // ----------------------- IMÁGENES -----------------------
    @PostMapping("/{postId}/images")
    public ResponseEntity<String> addImagesToPost(@PathVariable Long postId, @RequestBody List<String> images) {
        try {
            postService.addImagesToPost(postId, images);
            return ResponseEntity.ok("✅ Imágenes agregadas correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("⚠️ No puedes agregar más de 3 imágenes.");
        }
    }

    // ----------------------- ETIQUETAS -----------------------
    @PostMapping("/{postId}/tags")
    public ResponseEntity<String> addTagsToPost(@PathVariable Long postId, @RequestBody Set<String> tags) {
        postService.addTagsToPost(postId, tags);
        return ResponseEntity.ok("✅ Etiquetas agregadas correctamente.");
    }

    // ----------------------- GET POSTS -----------------------
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long postId) {
        Optional<Post> optionalPost = postService.getPostById(postId);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Post post = optionalPost.get();
        int totalLikes = postLikeService.getTotalLikes(post.getId());
        int totalDislikes = postDislikeService.getTotalDislikes(post.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("post", post);
        response.put("totalLikes", totalLikes);
        response.put("totalDislikes", totalDislikes);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/top")
    public ResponseEntity<List<Post>> getTopPostsByCategory(@RequestParam String category) {
        List<Post> topPosts = postService.getTopPostsByCategory(category);
        return ResponseEntity.ok(topPosts);
    }

    // 🔀 Obtener posts aleatorios por categoría
@GetMapping("/category/{category}/random")
public ResponseEntity<List<Post>> getRandomPostsByCategory(
        @PathVariable String category,
        @RequestParam(defaultValue = "6") int limit) {
    List<Post> posts = postService.getRandomPostsByCategory(category, limit);
    return ResponseEntity.ok(posts);
}

    



    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<Page<Post>> getPaginatedPosts(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Post> posts = postService.getPaginatedPosts(category, page, size);
        if (posts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(posts);
    }
}
