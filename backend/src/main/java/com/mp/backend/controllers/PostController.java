package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Post;
import com.mp.backend.services.PostService;
import com.mp.backend.services.PostDislikeService;
import com.mp.backend.services.PostLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @GetMapping("/{postId}/dislike/{userId}")
    public ResponseEntity<Boolean> hasUserDisliked(@PathVariable Long postId, @PathVariable Long userId) {
        return ResponseEntity.ok(postDislikeService.hasUserDisliked(postId, userId));
    }

    // ----------------------- CREAR POST SIN IMAGEN -----------------------
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    // ----------------------- CREAR POST CON IMAGEN REDIMENSIONADA -----------------------
    @PostMapping("/crear-con-imagen")
    public ResponseEntity<Post> createPostWithImage(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        try {
            Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            Post post = new Post();
            post.setTitle(title);
            post.setContent(content);
            post.setUser(usuario);
            post.setCategory(postService.getCategoryById(categoryId));

            if (imagen != null && !imagen.isEmpty()) {
                BufferedImage originalImage = ImageIO.read(imagen.getInputStream());
                BufferedImage resizedImage = resizeImage(originalImage, 800); // máximo ancho

                String filename = UUID.randomUUID() + ".jpg";
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(resizedImage, "jpg", baos);

                byte[] resizedBytes = baos.toByteArray();
                Path uploadPath = Paths.get("uploads", "forum");
                Files.createDirectories(uploadPath);
                Files.write(uploadPath.resolve(filename), resizedBytes);

                post.setImagenUrl("/uploads/forum/" + filename);
            }

            Post createdPost = postService.createPost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth) {
        int originalWidth = originalImage.getWidth();
        int originalHeight = originalImage.getHeight();
        int targetHeight = (targetWidth * originalHeight) / originalWidth;

        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();
        g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();
        return resizedImage;
    }

    // ----------------------- OTROS ENDPOINTS -----------------------

    @PostMapping("/{postId}/favorites")
    public ResponseEntity<String> addToFavorites(@PathVariable Long postId) {
        postService.addToFavorites(postId);
        return ResponseEntity.ok("✅ Post guardado en favoritos.");
    }

    @PostMapping("/{postId}/report")
    public ResponseEntity<String> reportPost(@PathVariable Long postId) {
        boolean success = postService.reportPost(postId);
        if (success) {
            return ResponseEntity.ok("✅ Post denunciado.");
        } else {
            return ResponseEntity.status(409).body("⚠️ Ya habías denunciado este post.");
        }
    }

    @PostMapping("/{postId}/tags")
    public ResponseEntity<String> addTagsToPost(@PathVariable Long postId, @RequestBody Set<String> tags) {
        postService.addTagsToPost(postId, tags);
        return ResponseEntity.ok("✅ Etiquetas agregadas correctamente.");
    }

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
