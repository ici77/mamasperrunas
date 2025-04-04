package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.services.PostService;
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

import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    @Operation(summary = "Obtiene posts paginados por categoría", description = "Devuelve una página de posts de la categoría especificada.")
    @ApiResponse(responseCode = "200", description = "Posts obtenidos correctamente")
    @ApiResponse(responseCode = "204", description = "No hay posts en esta categoría")
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

    @PostMapping("/{postId}/like")
public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long postId) {
    Map<String, Object> response = new HashMap<>();

    // Obtener el usuario autenticado desde el contexto
    Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    System.out.println("🔐 Like solicitado por usuario: " + usuario.getEmail() + " (ID: " + usuario.getId() + ")");
    System.out.println("📌 Post ID: " + postId);

    try {
        boolean liked = postLikeService.toggleLike(postId, usuario.getId());
        int totalLikes = postLikeService.getTotalLikes(postId);

        response.put("mensaje", liked ? "✅ Like añadido." : "❌ Like eliminado.");
        response.put("totalLikes", totalLikes);
        response.put("liked", liked);

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        System.out.println("❌ Error al procesar like: " + e.getMessage());
        response.put("mensaje", "⚠️ No se pudo procesar el like: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}



    


    @Operation(summary = "Crear un nuevo post", description = "Permite a un usuario autenticado crear un nuevo post.")
    @ApiResponse(responseCode = "201", description = "Post creado correctamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado: Usuario no autenticado o sin permisos")
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @Operation(summary = "Votar un post con 'No me gusta'", description = "Aumenta el contador de 'No me gusta' en el post especificado.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @PostMapping("/{postId}/downvote")
    public ResponseEntity<String> downvotePost(@PathVariable Long postId) {
        postService.downvotePost(postId);
        return ResponseEntity.ok("✅ Post votado con 'No me gusta'.");
    }

    @Operation(summary = "Guardar un post en favoritos", description = "Añade el post a la lista de favoritos del usuario.")
    @ApiResponse(responseCode = "200", description = "Post agregado a favoritos")
    @ApiResponse(responseCode = "404", description = "Post o usuario no encontrado")
    @PostMapping("/{postId}/favorites")
public ResponseEntity<String> addToFavorites(@PathVariable Long postId) {
    postService.addToFavorites(postId);
    return ResponseEntity.ok("✅ Post guardado en favoritos.");
}

    @Operation(summary = "Denunciar un post", description = "Permite que un usuario registrado denuncie un post.")
    @ApiResponse(responseCode = "200", description = "Denuncia registrada")
    @ApiResponse(responseCode = "409", description = "El usuario ya denunció este post")
    @PostMapping("/{postId}/report")
public ResponseEntity<String> reportPost(@PathVariable Long postId) {
    boolean success = postService.reportPost(postId);
    if (success) {
        return ResponseEntity.ok("✅ Post denunciado.");
    } else {
        return ResponseEntity.status(409).body("⚠️ Ya habías denunciado este post.");
    }
}


    @Operation(summary = "Agregar imágenes a un post", description = "Permite agregar hasta 3 imágenes a un post.")
    @ApiResponse(responseCode = "200", description = "Imágenes agregadas correctamente")
    @ApiResponse(responseCode = "400", description = "Número máximo de imágenes excedido")
    @PostMapping("/{postId}/images")
    public ResponseEntity<String> addImagesToPost(@PathVariable Long postId, @RequestBody List<String> images) {
        try {
            postService.addImagesToPost(postId, images);
            return ResponseEntity.ok("✅ Imágenes agregadas correctamente.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("⚠️ No puedes agregar más de 3 imágenes.");
        }
    }

    @Operation(summary = "Agregar etiquetas a un post", description = "Permite asignar etiquetas a un post.")
    @ApiResponse(responseCode = "200", description = "Etiquetas agregadas correctamente")
    @PostMapping("/{postId}/tags")
    public ResponseEntity<String> addTagsToPost(@PathVariable Long postId, @RequestBody Set<String> tags) {
        postService.addTagsToPost(postId, tags);
        return ResponseEntity.ok("✅ Etiquetas agregadas correctamente.");
    }

    @Operation(summary = "Obtiene un post por ID", description = "Devuelve el post correspondiente al ID proporcionado.")
    @ApiResponse(responseCode = "200", description = "Post obtenido correctamente")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable Long postId) {
        Optional<Post> optionalPost = postService.getPostById(postId);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        Post post = optionalPost.get();
        int totalLikes = postLikeService.getTotalLikes(post.getId());
    
        Map<String, Object> response = new HashMap<>();
        response.put("post", post);
        response.put("totalLikes", totalLikes);
    
        return ResponseEntity.ok(response);
    }
    

    @GetMapping("/category/top")
    public ResponseEntity<List<Post>> getTopPostsByCategory(@RequestParam String category) {
        List<Post> topPosts = postService.getTopPostsByCategory(category);
        return ResponseEntity.ok(topPosts);
    }
}