package com.mp.backend.controllers;

import com.mp.backend.models.forum.Post;
import com.mp.backend.services.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus; // ✅ Importación necesaria
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import java.util.List;
import java.util.Set;

/**
 * 📌 API REST para gestionar los posts del foro.
 */
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*") // Habilita CORS para permitir llamadas desde el frontend
@Tag(name = "Posts", description = "Operaciones relacionadas con los posts del foro")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * 📌 Obtiene los posts de una categoría con paginación.
     *
     * @param category Nombre de la categoría.
     * @param page Número de página (por defecto 0).
     * @param size Tamaño de la página (por defecto 10).
     * @return Página de posts de la categoría.
     */
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
            return ResponseEntity.noContent().build(); // 204 No Content si no hay posts
        }

        return ResponseEntity.ok(posts); // 200 OK con los posts
    }

    /**
     * 📌 Permite que un usuario vote un post con "Me gusta".
     *
     * @param postId ID del post.
     * @return Mensaje de éxito o error.
     */
    @Operation(summary = "Votar un post con 'Me gusta'", description = "Aumenta el contador de 'Me gusta' en el post especificado.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @PostMapping("/{postId}/upvote")
    public ResponseEntity<String> upvotePost(@PathVariable Long postId) {
        postService.upvotePost(postId);
        return ResponseEntity.ok("✅ Post votado con 'Me gusta'.");
    }

    /**
     * 📌 Crea un nuevo post.
     *
     * @param post Datos del post a crear.
     * @return Post creado.
     */
    @Operation(summary = "Crear un nuevo post", description = "Permite a un usuario autenticado crear un nuevo post.")
    @ApiResponse(responseCode = "201", description = "Post creado correctamente")
    @ApiResponse(responseCode = "403", description = "Acceso denegado: Usuario no autenticado o sin permisos")
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost); // ✅ Usa HttpStatus.CREATED
    }

    /**
     * 📌 Permite que un usuario vote un post con "No me gusta".
     *
     * @param postId ID del post.
     * @return Mensaje de éxito o error.
     */
    @Operation(summary = "Votar un post con 'No me gusta'", description = "Aumenta el contador de 'No me gusta' en el post especificado.")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @PostMapping("/{postId}/downvote")
    public ResponseEntity<String> downvotePost(@PathVariable Long postId) {
        postService.downvotePost(postId);
        return ResponseEntity.ok("✅ Post votado con 'No me gusta'.");
    }

    /**
     * 📌 Permite que un usuario guarde un post en favoritos.
     *
     * @param postId ID del post.
     * @param userId ID del usuario.
     * @return Mensaje de éxito.
     */
    @Operation(summary = "Guardar un post en favoritos", description = "Añade el post a la lista de favoritos del usuario.")
    @ApiResponse(responseCode = "200", description = "Post agregado a favoritos")
    @ApiResponse(responseCode = "404", description = "Post o usuario no encontrado")
    @PostMapping("/{postId}/favorite/{userId}")
    public ResponseEntity<String> addToFavorites(@PathVariable Long postId, @PathVariable Long userId) {
        postService.addToFavorites(postId, userId);
        return ResponseEntity.ok("✅ Post guardado en favoritos.");
    }

    /**
     * 📌 Permite que un usuario denuncie un post.
     *
     * @param postId ID del post a denunciar.
     * @param userId ID del usuario que realiza la denuncia.
     * @return Mensaje de éxito o error si ya fue denunciado.
     */
    @Operation(summary = "Denunciar un post", description = "Permite que un usuario registrado denuncie un post.")
    @ApiResponse(responseCode = "200", description = "Denuncia registrada")
    @ApiResponse(responseCode = "409", description = "El usuario ya denunció este post")
    @PostMapping("/{postId}/report/{userId}")
    public ResponseEntity<String> reportPost(@PathVariable Long postId, @PathVariable Long userId) {
        boolean success = postService.reportPost(postId, userId);

        if (success) {
            return ResponseEntity.ok("✅ Post denunciado con éxito.");
        } else {
            return ResponseEntity.status(409).body("⚠️ Ya has denunciado este post.");
        }
    }

    /**
     * 📌 Agrega imágenes a un post.
     *
     * @param postId ID del post.
     * @param images Lista de URLs de imágenes.
     * @return Mensaje de éxito o error si se excede el límite de 3 imágenes.
     */
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

    /**
     * 📌 Agrega etiquetas a un post.
     *
     * @param postId ID del post.
     * @param tags Lista de etiquetas.
     * @return Mensaje de éxito.
     */
    @Operation(summary = "Agregar etiquetas a un post", description = "Permite asignar etiquetas a un post.")
    @ApiResponse(responseCode = "200", description = "Etiquetas agregadas correctamente")
    @PostMapping("/{postId}/tags")
    public ResponseEntity<String> addTagsToPost(@PathVariable Long postId, @RequestBody Set<String> tags) {
        postService.addTagsToPost(postId, tags);
        return ResponseEntity.ok("✅ Etiquetas agregadas correctamente.");
    }

    /**
     * 📌 Obtiene un post por su ID.
     *
     * @param postId ID del post.
     * @return Post encontrado o error 404 si no existe.
     */
    @Operation(summary = "Obtiene un post por ID", description = "Devuelve el post correspondiente al ID proporcionado.")
    @ApiResponse(responseCode = "200", description = "Post obtenido correctamente")
    @ApiResponse(responseCode = "404", description = "Post no encontrado")
    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable Long postId) {
        Optional<Post> optionalPost = postService.getPostById(postId);

        return optionalPost.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 📌 Obtiene los 4 posts más votados de una categoría.
     *
     * @param category Nombre de la categoría.
     * @return Lista de los 4 posts más votados.
     */
    @GetMapping("/category/top")
    public ResponseEntity<List<Post>> getTopPostsByCategory(@RequestParam String category) {
        List<Post> topPosts = postService.getTopPostsByCategory(category);
        return ResponseEntity.ok(topPosts);
    }
}