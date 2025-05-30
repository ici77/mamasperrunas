package com.mp.backend.controllers;

import com.mp.backend.models.Usuario;
import com.mp.backend.models.forum.Reply;
import com.mp.backend.services.ReplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "*")
@Tag(name = "Respuestas", description = "Operaciones relacionadas con las respuestas a los posts")
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    // 📌 Obtener respuestas paginadas
    @Operation(summary = "Obtiene respuestas paginadas de un post")
    @ApiResponse(responseCode = "200", description = "Respuestas obtenidas correctamente")
    @GetMapping("/post/{postId}/paginated")
    public ResponseEntity<Page<Reply>> getRepliesByPostPaginated(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Reply> replies = replyService.getRepliesByPost(postId, page, size);
        return replies.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(replies);
    }

    // 📌 Obtener todas las respuestas sin paginación
    @Operation(summary = "Obtiene todas las respuestas de un post")
    @ApiResponse(responseCode = "200", description = "Respuestas obtenidas correctamente")
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Reply>> getAllRepliesByPost(@PathVariable Long postId) {
        List<Reply> replies = replyService.getRepliesByPostId(postId);
        return ResponseEntity.ok(replies);
    }

    // 📌 Crear una nueva respuesta
    @Operation(summary = "Crea una nueva respuesta")
    @ApiResponse(responseCode = "201", description = "Respuesta creada exitosamente")
    @PostMapping
    public ResponseEntity<Reply> createReply(@RequestBody Map<String, Object> payload) {
        Long postId = Long.valueOf(payload.get("postId").toString());
        String content = payload.get("content").toString();
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Reply savedReply = replyService.createReply(postId, content, usuario);
        return ResponseEntity.status(201).body(savedReply);
    }

    // 📌 Eliminar una respuesta
    @Operation(summary = "Eliminar una respuesta")
    @ApiResponse(responseCode = "200", description = "Respuesta eliminada correctamente")
    @ApiResponse(responseCode = "403", description = "No tienes permisos para eliminar esta respuesta")
    @DeleteMapping("/{replyId}")
    public ResponseEntity<String> deleteReply(@PathVariable Long replyId) {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean deleted = replyService.deleteReply(replyId, usuario.getId());

        return deleted
                ? ResponseEntity.ok("✅ Respuesta eliminada correctamente.")
                : ResponseEntity.status(403).body("⚠️ No tienes permisos para eliminar esta respuesta.");
    }

    // 📌 Votar una respuesta con "Me gusta"
    @Operation(summary = "Votar una respuesta con 'Me gusta'")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Respuesta no encontrada")
    @PostMapping("/{replyId}/upvote")
    public ResponseEntity<String> upvoteReply(@PathVariable Long replyId) {
        replyService.upvoteReply(replyId);
        return ResponseEntity.ok("✅ Respuesta votada con 'Me gusta'.");
    }

    // 📌 Votar una respuesta con "No me gusta"
    @Operation(summary = "Votar una respuesta con 'No me gusta'")
    @ApiResponse(responseCode = "200", description = "Voto registrado")
    @ApiResponse(responseCode = "404", description = "Respuesta no encontrada")
    @PostMapping("/{replyId}/downvote")
    public ResponseEntity<String> downvoteReply(@PathVariable Long replyId) {
        replyService.downvoteReply(replyId);
        return ResponseEntity.ok("✅ Respuesta votada con 'No me gusta'.");
    }

    // 📌 Denunciar una respuesta
    @Operation(summary = "Denunciar una respuesta")
    @ApiResponse(responseCode = "200", description = "Denuncia registrada")
    @ApiResponse(responseCode = "409", description = "El usuario ya denunció esta respuesta")
    @PostMapping("/{replyId}/report/{userId}")
    public ResponseEntity<String> reportReply(@PathVariable Long replyId, @PathVariable Long userId) {
        boolean success = replyService.reportReply(replyId, userId);

        return success
                ? ResponseEntity.ok("✅ Respuesta denunciada con éxito.")
                : ResponseEntity.status(409).body("⚠️ Ya has denunciado esta respuesta.");
    }

    // 📌 Obtener respuestas más votadas
    @Operation(summary = "Obtener respuestas destacadas")
    @ApiResponse(responseCode = "200", description = "Respuestas destacadas obtenidas correctamente")
    @GetMapping("/post/{postId}/top")
    public ResponseEntity<List<Reply>> getTopRepliesByPost(@PathVariable Long postId) {
        List<Reply> topReplies = replyService.getTopRepliesByPost(postId);
        return ResponseEntity.ok(topReplies);
    }
}
